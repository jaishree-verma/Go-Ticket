// GoTicket NLU Service — Deterministic Natural Language Understanding Layer
//
// Converts free-form user travel messages into a normalized, structured
// TravelRequest that the travel agent state machine can act on.
//
// Architecture Rules (enforced):
//   ✓ Pure JavaScript — no React imports
//   ✓ No calls to bus, seat, or booking services
//   ✓ Never mutates the context object passed to it
//   ✓ Returns null for any field not explicitly found in the message
//   ✓ LLM-ready interface: a future LLM implementation must produce the same shape
//
// Confidence scoring is deterministic (evidence-based), NOT an ML probability.

import {
  INTENTS,
  KNOWN_CITIES,
  CITY_ALIASES,
  BUS_TYPE_ALIASES,
  PRIORITY_KEYWORDS,
  TIME_WINDOWS,
  SEAT_PREFERENCE_TYPES,
} from './intentDefinitions.js';

// =============================================================================
// INTERNAL UTILITIES
// =============================================================================

/**
 * Converts "HH:MM AM/PM" or a partial time string into 24-hour "HH:MM".
 * Returns null if the string cannot be parsed.
 *
 * @param {string} raw - e.g. "9 PM", "9:30 PM", "21:00", "9"
 * @returns {string|null} "HH:MM" in 24-hour format
 */
const toHHMM = (raw) => {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();

  // Try 12-hour: "9 pm", "9:30 pm", "9pm", "09:00 am"
  const m12 = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const min = m12[2] ? parseInt(m12[2], 10) : 0;
    const ampm = m12[3].toLowerCase();
    if (ampm === 'pm' && h < 12) h += 12;
    if (ampm === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  }

  // Try 24-hour: "21:00", "08:30"
  const m24 = s.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    const h = parseInt(m24[1], 10);
    const min = parseInt(m24[2], 10);
    if (h >= 0 && h <= 23 && min >= 0 && min <= 59) {
      return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    }
  }

  // Bare hour: "9" — ambiguous, return null (caller must resolve from context)
  return null;
};

/**
 * Converts a time string into minutes from midnight (for arithmetic comparisons).
 * Handles "HH:MM", 12-hour formats, and named windows.
 *
 * @param {string} timeStr
 * @returns {number|null}
 */
const toMinutes = (timeStr) => {
  if (!timeStr) return null;
  const hhmm = toHHMM(timeStr);
  if (hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }
  return null;
};

/**
 * Given a day name ("monday", "friday" etc.) and the current date,
 * returns the next occurrence of that day as a Date object.
 * If diff === 0 (today IS that day), returns next week.
 *
 * @param {number} targetDayIndex - 0=Sun, 1=Mon, …, 6=Sat
 * @param {Date} from
 * @returns {Date}
 */
const nextWeekday = (targetDayIndex, from) => {
  const d = new Date(from);
  const current = d.getDay();
  let diff = targetDayIndex - current;
  if (diff <= 0) diff += 7;
  d.setDate(d.getDate() + diff);
  return d;
};

/**
 * Matches a city name inside a text token, supporting both canonical names
 * and CITY_ALIASES.
 *
 * @param {string} token - A word or short phrase
 * @returns {string|null} Canonical city name or null
 */
const matchCity = (token) => {
  if (!token) return null;
  const t = token.trim().toLowerCase();

  // Direct alias lookup (handles abbreviations like "knp")
  if (CITY_ALIASES[t]) return CITY_ALIASES[t];

  // Multi-word alias check (e.g. "new delhi", "pink city")
  for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
    if (t.includes(alias)) return canonical;
  }

  // Canonical name check
  for (const city of KNOWN_CITIES) {
    if (t.includes(city.toLowerCase())) {
      // Normalize Bengaluru → Bangalore
      return city === 'Bengaluru' ? 'Bangalore' : city;
    }
  }

  return null;
};

// =============================================================================
// INTENT DETECTION
// =============================================================================

/**
 * Detects the primary intent of the user message using keyword pattern matching.
 * Returns the highest-confidence INTENTS value.
 *
 * Priority order: more specific intents are checked before general ones.
 *
 * @param {string} q - Lowercased user message
 * @param {Object} context - Current agent context (read-only)
 * @returns {string} One of the INTENTS constants
 */
const detectIntent = (q, context) => {
  // --- CANCEL ---
  if (/\b(cancel|abort|never mind|nevermind|don'?t book|not now|no thanks|stop)\b/.test(q)) {
    return INTENTS.CANCEL;
  }

  // --- BOOKING CONFIRMATION ---
  if (/\b(yes[,.]?\s*confirm|confirm booking|book it|go ahead|proceed with booking|yes please book|yes do it|do it|confirm it)\b/.test(q)) {
    return INTENTS.BOOKING_CONFIRMATION;
  }

  // --- TRACK BUS ---
  if (/\b(track|live location|where is (my|the) bus|bus location|bus tracking)\b/.test(q)) {
    return INTENTS.TRACK_BUS;
  }

  // --- SELECT SEATS (specific seat IDs mentioned) ---
  if (/\bS[-_\s]?\d{1,2}\b/i.test(q) && /\b(book|select|choose|want seat|s\d)\b/i.test(q)) {
    return INTENTS.SELECT_SEATS;
  }
  // Generic "book seat N" patterns
  if (/\bseats?\s+\d{1,2}\b/i.test(q) && /\b(book|select|choose)\b/.test(q)) {
    return INTENTS.SELECT_SEATS;
  }

  // --- CHECK SEATS ---
  if (/\b(show seats|check seats|available seats|seat (map|availability)|which seats|what seats)\b/.test(q)) {
    return INTENTS.CHECK_SEATS;
  }

  // --- SELECT BUS ---
  const hasBusResult = context.searchResults && context.searchResults.length > 0;
  if (
    hasBusResult &&
    /\b(select|choose|pick|want the|go with|i'?ll take|book (the |this )?(first|second|third|1st|2nd|3rd|recommended|cheapest|fastest|bus))\b/.test(q)
  ) {
    return INTENTS.SELECT_BUS;
  }

  // --- COMPARE BUSES ---
  if (/\b(compare|vs|versus|difference between|which (one|bus) is better)\b/.test(q)) {
    return INTENTS.COMPARE_BUSES;
  }

  // --- CHANGE REQUEST ---
  if (/\b(change (seat|bus|date|passenger|name|email|phone|mobile)|different (seat|bus)|another (seat|bus|date))\b/.test(q)) {
    return INTENTS.CHANGE_REQUEST;
  }

  // --- FILTER RESULTS (follow-up narrowing with existing results) ---
  if (
    hasBusResult &&
    /\b(cheaper|cheapest|faster|fastest|earliest|show (me )?(more|less|only|just)|filter|affordable|under|below|within|less than|sort|something (cheap|affordable|faster|better|earlier))\b/.test(q)
  ) {
    return INTENTS.FILTER_RESULTS;
  }

  // --- HELP / GREETING ---
  if (/^(hi|hello|hey|help|hiya|howdy|good (morning|evening|afternoon|night))[.!?]?$/.test(q.trim())) {
    return INTENTS.HELP;
  }
  if (/\b(what can you do|how does this work|help me|what (is|are) (your|the) options)\b/.test(q)) {
    return INTENTS.HELP;
  }

  // --- SEARCH + RECOMMEND (user explicitly asks for best/recommendation) ---
  const hasRouteSignal =
    /\b(from|to|→|->\s)|([a-z]+\s*(to|-|→)\s*[a-z]+)/.test(q);
  if (
    hasRouteSignal &&
    /\b(best|recommend|suggest|ideal|which (one|bus) (should|would)|good option)\b/.test(q)
  ) {
    return INTENTS.SEARCH_AND_RECOMMEND;
  }

  // --- SEARCH BUS (general search) ---
  if (
    /\b(find|search|look for|get me|show me|book|i (need|want|have) to (travel|go|take|reach)|buses? (from|to|for)|travel from|going to|i'?m going)\b/.test(q) ||
    hasRouteSignal
  ) {
    return INTENTS.SEARCH_BUS;
  }

  return INTENTS.UNKNOWN;
};

// =============================================================================
// ENTITY EXTRACTION
// =============================================================================

/**
 * Extracts source and destination cities from the message.
 * Tries multiple pattern families in priority order.
 * Never guesses — returns null if a city is not recognizable.
 *
 * @param {string} q - Lowercased message
 * @returns {{ source: string|null, destination: string|null }}
 */
const extractCities = (q) => {
  let source = null;
  let destination = null;

  // Pattern 1: "from X to Y"
  const fromTo = q.match(/\bfrom\s+([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\s+(?:tomorrow|today|on\s|at\s|around\s|before\s|after\s|morning|evening|night|this\s|next\s|\d)|$)/i);
  if (fromTo) {
    source = matchCity(fromTo[1].trim());
    destination = matchCity(fromTo[2].trim());
    if (source || destination) return { source, destination };
  }

  // Pattern 2: "X to Y" / "X → Y" / "X - Y" / "X -> Y"
  const arrowMatch = q.match(/\b([a-z]+)\s*(?:to\b|→|->|-(?=\s*[a-z]))\s*([a-z]+)/i);
  if (arrowMatch) {
    const maybeSource = matchCity(arrowMatch[1].trim());
    const maybeDest = matchCity(arrowMatch[2].trim());
    if (maybeSource || maybeDest) {
      source = maybeSource;
      destination = maybeDest;
      return { source, destination };
    }
  }

  // Pattern 3: "travel X → Y" or "KNP to Delhi"
  const travelMatch = q.match(/\b(?:travel|go|going|journey)(?:\s+from)?\s+([a-z]+)\s+(?:to|→)\s+([a-z]+)/i);
  if (travelMatch) {
    source = matchCity(travelMatch[1].trim());
    destination = matchCity(travelMatch[2].trim());
    if (source || destination) return { source, destination };
  }

  // Pattern 4: "Delhi from Kanpur" (reversed phrasing)
  const reversedMatch = q.match(/\b([a-z]+)\s+from\s+([a-z]+)/i);
  if (reversedMatch) {
    const maybeDest = matchCity(reversedMatch[1].trim());
    const maybeSrc = matchCity(reversedMatch[2].trim());
    if (maybeDest || maybeSrc) {
      destination = maybeDest;
      source = maybeSrc;
      return { source, destination };
    }
  }

  // Pattern 5: standalone "to X" only
  const toOnly = q.match(/\bto\s+([a-z]+)/i);
  if (toOnly) destination = matchCity(toOnly[1].trim());

  // Pattern 6: standalone "from X" only
  const fromOnly = q.match(/\bfrom\s+([a-z]+)/i);
  if (fromOnly) source = matchCity(fromOnly[1].trim());

  // Pattern 7: scan all known cities/aliases in the message (last resort)
  if (!source && !destination) {
    const found = [];
    for (const city of KNOWN_CITIES) {
      if (q.includes(city.toLowerCase())) {
        const normalized = city === 'Bengaluru' ? 'Bangalore' : city;
        if (!found.includes(normalized)) found.push(normalized);
      }
    }
    for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
      if (q.includes(alias) && !found.includes(canonical)) {
        found.push(canonical);
      }
    }
    if (found.length === 2) {
      [source, destination] = found;
    } else if (found.length === 1) {
      // Can't determine direction from a single city without pattern
      destination = found[0];
    }
  }

  return { source, destination };
};

/**
 * Extracts and normalizes a date from the message using the current system date.
 * Supports: today, tomorrow, day after tomorrow, next/this weekday, on weekday.
 *
 * @param {string} q - Lowercased message
 * @returns {string|null} ISO date string (YYYY-MM-DD) or null
 */
const extractDate = (q) => {
  const today = new Date();

  if (q.includes('day after tomorrow')) {
    const d = new Date(today);
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }

  if (q.includes('tomorrow')) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  if (q.includes('today')) {
    return today.toISOString().split('T')[0];
  }

  // Weekday names
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < dayNames.length; i++) {
    const day = dayNames[i];
    // "next Monday", "on Monday", "this Friday", "Monday"
    const pattern = new RegExp(`\\b(?:next|this|on)?\\s*${day}\\b`, 'i');
    if (pattern.test(q)) {
      const d = nextWeekday(i, today);
      return d.toISOString().split('T')[0];
    }
  }

  return null;
};

/**
 * Extracts departure time constraints from the message.
 *
 * Produces departure_after and/or departure_before in "HH:MM" (24-hour).
 * Uses named time windows for qualitative expressions like "evening", "morning".
 *
 * Examples:
 *   "after 9 PM"     → departure_after: "21:00"
 *   "around 9 PM"    → departure_after: "20:30", departure_before: "21:30" (±30 min window)
 *   "before 10 PM"   → departure_before: "22:00"
 *   "evening"        → departure_after: "17:00", departure_before: "21:00"
 *   "morning"        → departure_after: "06:00", departure_before: "12:00"
 *
 * @param {string} q - Lowercased message
 * @returns {{ departure_after: string|null, departure_before: string|null }}
 */
const extractDepartureTime = (q) => {
  let departure_after = null;
  let departure_before = null;

  // Explicit "after X AM/PM" or "after X:XX"
  const afterMatch = q.match(/\bafter\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (afterMatch) {
    departure_after = toHHMM(afterMatch[1]);
  }

  // Explicit "before X AM/PM"
  const beforeMatch = q.match(/\bbefore\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b(?!.*reach|.*arrive|.*get there)/i);
  if (beforeMatch && !q.match(/\b(reach|arrive|get there|be there)\b/)) {
    departure_before = toHHMM(beforeMatch[1]);
  }

  // "around X PM" → ±30 min window
  const aroundMatch = q.match(/\baround\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (aroundMatch && !departure_after) {
    const center = toHHMM(aroundMatch[1]);
    if (center) {
      const mins = toMinutes(center);
      const afterMins = Math.max(0, mins - 30);
      const beforeMins = mins + 30;
      departure_after = `${String(Math.floor(afterMins / 60)).padStart(2, '0')}:${String(afterMins % 60).padStart(2, '0')}`;
      departure_before = `${String(Math.floor(beforeMins / 60)).padStart(2, '0')}:${String(beforeMins % 60).padStart(2, '0')}`;
    }
  }

  // Named time windows (only if no explicit time found)
  if (!departure_after && !departure_before) {
    // Check longest alias first to avoid partial matches
    const sortedWindows = Object.entries(TIME_WINDOWS).sort((a, b) => b[0].length - a[0].length);
    for (const [label, range] of sortedWindows) {
      if (q.includes(label)) {
        departure_after = range.departure_after;
        departure_before = range.departure_before;
        break;
      }
    }
  }

  return { departure_after, departure_before };
};

/**
 * Extracts an arrival deadline constraint from the message.
 *
 * Supports patterns like:
 *   "reach before 8 AM"         → arrival_before: "08:00"
 *   "get there by 8"            → arrival_before: "08:00" (AM assumed for small numbers)
 *   "arrive by 10 AM"           → arrival_before: "10:00"
 *   "need to be there at 9 AM"  → arrival_before: "09:00"
 *   "interview at 10 AM ... one hour early" → arrival_before: "09:00"
 *
 * Does NOT calculate arrival from event time unless the event time is explicitly given.
 *
 * @param {string} q - Lowercased message
 * @returns {string|null} "HH:MM" or null
 */
const extractArrivalConstraint = (q) => {
  // "reach before X", "arrive before X", "get there by X", "be there by X", "reach by X"
  const arrivalPatterns = [
    // "reach [city] before X", "reach before X", "arrive [city] by X"
    /\b(?:reach|arrive|get there|be there|reach there)(?:\s+\w+)?\s+(?:before|by|at)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
    /\b(?:need to reach|have to reach|must reach|want to reach)(?:\s+\w+)?\s+(?:before|by|at)?\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
    /\b(?:i need to|i have to|i must)\s+(?:be there|arrive|reach)(?:\s+\w+)?\s+(?:before|by|at)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
    /\bget me there by\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
  ];

  for (const pattern of arrivalPatterns) {
    const m = q.match(pattern);
    if (m) {
      let time = toHHMM(m[1]);
      // Disambiguation: bare number like "8" without AM/PM
      // If number <= 12 and no AM/PM context, leave as-is (toHHMM returns null for bare numbers)
      // Attempt with "AM" appended for small numbers (heuristic: travel arrivals before noon)
      if (!time) {
        const bareNum = m[1].trim().match(/^(\d{1,2})$/);
        if (bareNum) {
          const h = parseInt(bareNum[1], 10);
          // Heuristic: numbers 1-12 without AM/PM context in arrival are treated as AM
          time = `${String(h).padStart(2, '0')}:00`;
        }
      }
      if (time) return time;
    }
  }

  // "interview/meeting/event at X AM ... one hour early/before"
  const eventEarlyMatch = q.match(
    /\b(?:interview|meeting|event|exam|class|appointment)\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b.*?\b(\d+)\s*hour/i
  );
  if (eventEarlyMatch) {
    const eventTime = toHHMM(eventEarlyMatch[1]);
    const hoursEarly = parseInt(eventEarlyMatch[2], 10);
    if (eventTime && !isNaN(hoursEarly)) {
      const mins = toMinutes(eventTime);
      const adjusted = Math.max(0, mins - hoursEarly * 60);
      return `${String(Math.floor(adjusted / 60)).padStart(2, '0')}:${String(adjusted % 60).padStart(2, '0')}`;
    }
  }

  // "one hour before X AM" or "an hour before X"
  const hourBeforeMatch = q.match(
    /\b(?:one|an|1)\s*hour(?:s)?\s+(?:early|before|prior)\b.*?at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i
  );
  if (hourBeforeMatch) {
    const eventTime = toHHMM(hourBeforeMatch[1]);
    if (eventTime) {
      const mins = toMinutes(eventTime);
      const adjusted = Math.max(0, mins - 60);
      return `${String(Math.floor(adjusted / 60)).padStart(2, '0')}:${String(adjusted % 60).padStart(2, '0')}`;
    }
  }

  return null;
};

/**
 * Extracts price constraints from the message.
 *
 * Explicit numeric constraints → max_price (number)
 * Qualitative preferences → priority (delegated to extractPriority)
 *
 * @param {string} q - Lowercased message
 * @returns {{ max_price: number|null, min_price: number|null }}
 */
const extractPrice = (q) => {
  let max_price = null;
  let min_price = null;

  // "under ₹1500", "below 1500", "less than 1500", "within 1500", "not more than 1500", "upto 1500"
  const maxPatterns = [
    /\b(?:under|below|less than|within|not more than|upto|up to|max(?:imum)?|at most)\s*[₹]?\s*(\d[\d,]*)/i,
    /[₹]?\s*(\d[\d,]*)\s*(?:or less|and below|max)/i,
    /\bbudget[:\s]+[₹]?\s*(\d[\d,]*)/i,
  ];
  for (const pattern of maxPatterns) {
    const m = q.match(pattern);
    if (m) {
      max_price = parseInt(m[1].replace(/,/g, ''), 10);
      break;
    }
  }

  // "around ₹1500" — treat as max_price with ±10% tolerance (store as max)
  if (!max_price) {
    const approxMatch = q.match(/\baround\s*[₹]?\s*(\d[\d,]*)/i);
    if (approxMatch) {
      max_price = Math.round(parseInt(approxMatch[1].replace(/,/g, ''), 10) * 1.1);
    }
  }

  // "above ₹500", "more than 500" — min_price
  const minPatterns = [
    /\b(?:above|more than|over|at least|minimum)\s*[₹]?\s*(\d[\d,]*)/i,
  ];
  for (const pattern of minPatterns) {
    const m = q.match(pattern);
    if (m) {
      min_price = parseInt(m[1].replace(/,/g, ''), 10);
      break;
    }
  }

  return { max_price, min_price };
};

/**
 * Extracts normalized bus type from the message.
 *
 * @param {string} q - Lowercased message
 * @returns {string|null} Normalized bus type or null
 */
const extractBusType = (q) => {
  // Sort longest aliases first to avoid partial matches
  const sortedAliases = Object.entries(BUS_TYPE_ALIASES).sort((a, b) => b[0].length - a[0].length);
  for (const [alias, normalized] of sortedAliases) {
    if (q.includes(alias.toLowerCase())) {
      return normalized;
    }
  }
  return null;
};

/**
 * Extracts passenger count from the message.
 * Returns null if no count is explicitly mentioned.
 *
 * @param {string} q - Lowercased message
 * @returns {number|null}
 */
const extractPassengers = (q) => {
  const wordToNum = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  };

  // "2 passengers", "3 seats", "for 2 people", "booking for 2"
  const numericMatch = q.match(/\b(\d+)\s*(?:passenger|seat|person|people|adult|travell?er)/i);
  if (numericMatch) return parseInt(numericMatch[1], 10);

  // "for two people", "we are three"
  const wordMatch = q.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:passenger|seat|person|people|adult|travell?er)?/i);
  if (wordMatch) {
    const num = wordToNum[wordMatch[1].toLowerCase()];
    if (num) return num;
  }

  // "me and my friend" → 2, "me and two friends" → 3
  if (/\bme and my (friend|colleague|partner|wife|husband|brother|sister)\b/i.test(q)) return 2;
  const meAndFriends = q.match(/\bme and\s+(\w+)\s+(?:friends?|colleagues?|people)\b/i);
  if (meAndFriends) {
    const n = wordToNum[meAndFriends[1].toLowerCase()];
    if (n) return n + 1;
    const d = parseInt(meAndFriends[1], 10);
    if (!isNaN(d)) return d + 1;
  }

  // "we are three" / "we are 3"
  const weAreMatch = q.match(/\bwe are\s+(\w+)\b/i);
  if (weAreMatch) {
    const n = wordToNum[weAreMatch[1].toLowerCase()] || parseInt(weAreMatch[1], 10);
    if (!isNaN(n)) return n;
  }

  // "for two" (with no other context for the word)
  const forWordMatch = q.match(/\bfor\s+(two|three|four|five|six)\b/i);
  if (forWordMatch) {
    const n = wordToNum[forWordMatch[1].toLowerCase()];
    if (n) return n;
  }

  return null;
};

/**
 * Extracts seat preference from the message.
 *
 * @param {string} q - Lowercased message
 * @returns {{ type: string, count: number|null }|null}
 */
const extractSeatPreference = (q) => {
  const wordToNum = { 'one': 1, 'two': 2, 'three': 3, 'four': 4 };

  // "two seats together", "adjacent seats", "side by side"
  if (/\b(together|adjacent|side by side|next to each other)\b/.test(q)) {
    const countMatch = q.match(/\b(\d+|two|three|four)\s+seats?\b/i);
    const count = countMatch
      ? (parseInt(countMatch[1], 10) || wordToNum[countMatch[1].toLowerCase()] || null)
      : null;
    return { type: SEAT_PREFERENCE_TYPES.ADJACENT, count };
  }

  // "window seat"
  if (/\bwindow\s+seat\b/.test(q)) return { type: SEAT_PREFERENCE_TYPES.WINDOW, count: null };

  // "aisle seat"
  if (/\baisle\s*(?:seat)?\b/.test(q)) return { type: SEAT_PREFERENCE_TYPES.AISLE, count: null };

  // "front seat", "seat in front"
  if (/\b(front\s+seat|seat\s+in\s+front|near\s+front)\b/.test(q)) return { type: SEAT_PREFERENCE_TYPES.FRONT, count: null };

  // "back seat", "rear"
  if (/\b(back\s+seat|rear\s+seat|seat\s+(in\s+the\s+)?back)\b/.test(q)) return { type: SEAT_PREFERENCE_TYPES.BACK, count: null };

  // "middle seat"
  if (/\bmiddle\s+seat\b/.test(q)) return { type: SEAT_PREFERENCE_TYPES.MIDDLE, count: null };

  // "lower berth"
  if (/\blower\s+(berth|bunk|bed)\b/.test(q)) return { type: SEAT_PREFERENCE_TYPES.LOWER, count: null };

  // "upper berth"
  if (/\bupper\s+(berth|bunk|bed)\b/.test(q)) return { type: SEAT_PREFERENCE_TYPES.UPPER, count: null };

  return null;
};

/**
 * Extracts qualitative optimization priority from the message.
 *
 * @param {string} q - Lowercased message
 * @returns {string|null} Priority enum value or null
 */
const extractPriority = (q) => {
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    for (const kw of keywords) {
      if (q.includes(kw.toLowerCase())) {
        return priority;
      }
    }
  }

  // "cheap" / "affordable" without explicit price number → price priority
  if (/\b(cheap|affordable|inexpensive|economical)\b/.test(q) && !q.match(/[₹]?\d+/)) {
    return 'price';
  }

  return null;
};

// =============================================================================
// MISSING FIELD DETECTOR
// =============================================================================

/**
 * Identifies which fields are required but not present after extraction.
 * The agent uses this list to formulate follow-up questions.
 *
 * @param {Object} entities
 * @param {Object} constraints
 * @param {string} intent
 * @param {Object} context - Current agent context (read-only)
 * @returns {string[]} Array of missing field names
 */
const detectMissing = (entities, constraints, intent, context) => {
  const missing = [];

  const searchIntents = [INTENTS.SEARCH_BUS, INTENTS.SEARCH_AND_RECOMMEND];
  if (!searchIntents.includes(intent)) return missing;

  // Resolve against context (context values fill gaps, but NLU doesn't mutate context)
  const effectiveSource = entities.source || context.source;
  const effectiveDestination = entities.destination || context.destination;

  if (!effectiveSource) missing.push('source');
  if (!effectiveDestination) missing.push('destination');
  // date is optional — agent will default to today if missing

  return missing;
};

// =============================================================================
// CONFIDENCE SCORING (Deterministic Evidence-Based)
// =============================================================================

/**
 * Computes a deterministic confidence score based on extraction evidence.
 *
 * This is NOT an ML probability. It is a transparent heuristic indicating
 * how complete and unambiguous the parsed result is.
 *
 * Scoring breakdown:
 *   +0.30  intent recognized (not UNKNOWN)
 *   +0.25  both source AND destination found
 *   +0.20  date found
 *   +0.15  at least one constraint found
 *   +0.10  context fills remaining gaps
 *
 * @param {string} intent
 * @param {Object} entities
 * @param {Object} constraints
 * @param {Object} context - Read-only
 * @returns {number} 0.0–1.0
 */
const computeConfidence = (intent, entities, constraints, context) => {
  let score = 0;

  if (intent !== INTENTS.UNKNOWN) score += 0.30;

  if (entities.source && entities.destination) score += 0.25;
  else if (entities.source || entities.destination) score += 0.10;

  if (entities.date) score += 0.20;

  const hasConstraint = Object.values(constraints).some((v) => v !== null);
  if (hasConstraint) score += 0.15;

  // Context contribution (read-only — not mutating)
  const contextFills =
    (!entities.source && context.source ? 0.05 : 0) +
    (!entities.destination && context.destination ? 0.05 : 0);
  score += Math.min(0.10, contextFills);

  return parseFloat(Math.min(1.0, score).toFixed(2));
};

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Parses a natural-language user message into a normalized TravelRequest.
 *
 * CONTRACT (stable — future LLM implementation must produce the same shape):
 *
 * @param {string} message - Raw user input
 * @param {Object} [context={}] - Current agent context (read-only, never mutated)
 * @param {string|null}  context.source          - Previously known departure city
 * @param {string|null}  context.destination     - Previously known destination city
 * @param {string|null}  context.date            - Previously known travel date
 * @param {string|null}  context.preferredTime   - Previously known departure preference
 * @param {Object|null}  context.selectedBus     - Currently selected bus (if any)
 * @param {Array}        context.searchResults   - Current search results (if any)
 * @param {number|null}  context.passengers      - Previously known passenger count
 * @param {Object|null}  context.constraints     - Previously known constraints
 *
 * @returns {{
 *   success: boolean,
 *   intent: string,
 *   entities: {
 *     source: string|null,
 *     destination: string|null,
 *     date: string|null,
 *     passengers: number|null
 *   },
 *   constraints: {
 *     departure_after: string|null,
 *     departure_before: string|null,
 *     arrival_before: string|null,
 *     max_price: number|null,
 *     min_price: number|null,
 *     bus_type: string|null,
 *     seat_preference: {type: string, count: number|null}|null,
 *     priority: string|null
 *   },
 *   missing: string[],
 *   confidence: number,
 *   raw: string
 * }}
 */
export const parseUserMessage = (message = '', context = {}) => {
  // Normalize: lowercase, trim, collapse whitespace
  const raw = message.toLowerCase().trim().replace(/\s+/g, ' ');

  // Safe context snapshot (read-only)
  const ctx = {
    source: context.source || null,
    destination: context.destination || null,
    date: context.date || null,
    preferredTime: context.preferredTime || null,
    selectedBus: context.selectedBus || null,
    searchResults: Array.isArray(context.searchResults) ? context.searchResults : [],
    passengers: context.passengers || null,
    constraints: context.constraints || null,
  };

  try {
    // --- Step 1: Detect Intent ---
    const intent = detectIntent(raw, ctx);

    // --- Step 2: Extract Entities ---
    const { source, destination } = extractCities(raw);
    const date = extractDate(raw);
    const passengers = extractPassengers(raw);

    const entities = { source, destination, date, passengers };

    // --- Step 3: Extract Constraints ---
    const { departure_after, departure_before } = extractDepartureTime(raw);
    const arrival_before = extractArrivalConstraint(raw);
    const { max_price, min_price } = extractPrice(raw);
    const bus_type = extractBusType(raw);
    const seat_preference = extractSeatPreference(raw);
    const priority = extractPriority(raw);

    const constraints = {
      departure_after,
      departure_before,
      arrival_before,
      max_price,
      min_price,
      bus_type,
      seat_preference,
      priority,
    };

    // --- Step 4: Detect missing required fields ---
    const missing = detectMissing(entities, constraints, intent, ctx);

    // --- Step 5: Compute deterministic confidence ---
    const confidence = computeConfidence(intent, entities, constraints, ctx);

    return {
      success: true,
      intent,
      entities,
      constraints,
      missing,
      confidence,
      raw,
    };
  } catch (err) {
    // NLU must never throw — return a safe fallback
    return {
      success: false,
      intent: INTENTS.UNKNOWN,
      entities: { source: null, destination: null, date: null, passengers: null },
      constraints: {
        departure_after: null,
        departure_before: null,
        arrival_before: null,
        max_price: null,
        min_price: null,
        bus_type: null,
        seat_preference: null,
        priority: null,
      },
      missing: [],
      confidence: 0,
      raw: message.toLowerCase().trim(),
      error: err.message,
    };
  }
};

// =============================================================================
// NAMED EXPORTS (for granular testing / future extension)
// =============================================================================
export {
  detectIntent,
  extractCities,
  extractDate,
  extractDepartureTime,
  extractArrivalConstraint,
  extractPrice,
  extractBusType,
  extractPassengers,
  extractSeatPreference,
  extractPriority,
  matchCity,
  toHHMM,
};
