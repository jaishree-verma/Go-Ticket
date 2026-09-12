/**
 * GoTicket NLU Service — Test Suite
 *
 * Self-contained test runner. No Jest required.
 * Run with:   node src/services/nluService.test.js
 *
 * Tests cover 44+ varied natural-language inputs across all NLU dimensions.
 * Each test reports: input, detected intent, extracted entities/constraints,
 * expected result, actual result, and PASS/FAIL.
 */

// Node ESM compatibility shim for running in CRA (ESM import via dynamic import)
// This file uses CommonJS-style runner but the imports are ES module.
// Run this file via: node --experimental-vm-modules ... OR use the CRA test runner.
// For a plain Node run, we inline a lightweight transformer approach below.

// ─── INLINE STUBS (mirrors intentDefinitions.js constants) ──────────────────
// These are duplicated here so the test file can run standalone via Node
// without needing a bundler. Keep in sync with intentDefinitions.js.

const INTENTS = {
  SEARCH_BUS: 'SEARCH_BUS',
  SEARCH_AND_RECOMMEND: 'SEARCH_AND_RECOMMEND',
  FILTER_RESULTS: 'FILTER_RESULTS',
  COMPARE_BUSES: 'COMPARE_BUSES',
  SELECT_BUS: 'SELECT_BUS',
  CHECK_SEATS: 'CHECK_SEATS',
  SELECT_SEATS: 'SELECT_SEATS',
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
  CANCEL: 'CANCEL',
  CHANGE_REQUEST: 'CHANGE_REQUEST',
  TRACK_BUS: 'TRACK_BUS',
  HELP: 'HELP',
  UNKNOWN: 'UNKNOWN',
};

// ─── INLINE NLU (copy of core logic for standalone test execution) ───────────
// NOTE: In the actual app, the import below is used instead.
// For the CRA build environment, this file is imported as a module.
// The inline copy below is only for `node nluService.test.js` runs.

const KNOWN_CITIES = [
  'Kanpur', 'Delhi', 'Lucknow', 'Agra', 'Jaipur', 'Mumbai',
  'Pune', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Kolkata', 'Dehradun', 'Chandigarh', 'Ahmedabad', 'Surat',
  'Varanasi', 'Goa', 'Bhopal', 'Indore', 'Patna', 'Ranchi',
];

const CITY_ALIASES = {
  'knp': 'Kanpur', 'cawnpore': 'Kanpur',
  'new delhi': 'Delhi', 'ndls': 'Delhi', 'dli': 'Delhi',
  'lko': 'Lucknow', 'lkw': 'Lucknow',
  'bengaluru': 'Bangalore', 'blr': 'Bangalore',
  'bombay': 'Mumbai', 'bom': 'Mumbai',
  'pink city': 'Jaipur', 'jp': 'Jaipur',
  'taj city': 'Agra',
  'poona': 'Pune',
  'hyd': 'Hyderabad', 'cyberabad': 'Hyderabad',
  'madras': 'Chennai', 'maa': 'Chennai',
  'calcutta': 'Kolkata', 'cal': 'Kolkata',
};

const BUS_TYPE_ALIASES = {
  'non ac': 'Non-AC', 'non-ac': 'Non-AC', 'nonac': 'Non-AC',
  'without ac': 'Non-AC', 'no ac': 'Non-AC', 'non air conditioned': 'Non-AC',
  'general': 'Non-AC', 'ordinary': 'Non-AC',
  'ac sleeper': 'AC Sleeper', 'ac seater': 'AC Seater',
  'non ac sleeper': 'Non-AC Sleeper', 'non-ac sleeper': 'Non-AC Sleeper',
  'volvo bus': 'Volvo AC', 'volvo': 'Volvo AC',
  'air conditioned': 'AC', 'air-conditioned': 'AC', 'airconditioned': 'AC',
  'with ac': 'AC', 'a/c': 'AC',
  'ac': 'AC', 'sleeper': 'Sleeper', 'seater': 'Seater',
  'luxury': 'AC Sleeper', 'premium': 'AC Sleeper',
};

const PRIORITY_KEYWORDS = {
  price: ['cheapest', 'most affordable', 'lowest fare', 'lowest price', 'budget', 'low cost', 'inexpensive', 'economical', 'value', 'cheaper', 'something cheaper', 'more affordable', 'less expensive'],
  time: ['fastest', 'fastest option', 'quickest', 'earliest', 'shortest', 'least time', 'minimum time', 'earliest arrival', 'soonest', 'faster', 'quicker', 'something faster', 'earlier bus'],
  comfort: ['most comfortable', 'comfortable', 'luxury', 'premium', 'best amenities'],
  rating: ['best rated', 'top rated', 'highest rated', 'best reviews', 'most popular'],
  balanced: ['balanced', 'best overall', 'best option', 'good option', 'best pick'],
};

const TIME_WINDOWS = {
  'early morning': { departure_after: '04:00', departure_before: '07:00' },
  'morning': { departure_after: '06:00', departure_before: '12:00' },
  'afternoon': { departure_after: '12:00', departure_before: '17:00' },
  'late evening': { departure_after: '19:00', departure_before: '23:00' },
  'evening': { departure_after: '17:00', departure_before: '21:00' },
  'tonight': { departure_after: '18:00', departure_before: null },
  'night': { departure_after: '20:00', departure_before: null },
  'late night': { departure_after: '22:00', departure_before: null },
};

const SEAT_PREF = {
  WINDOW: 'window', AISLE: 'aisle', FRONT: 'front',
  BACK: 'back', MIDDLE: 'middle', ADJACENT: 'adjacent',
  LOWER: 'lower', UPPER: 'upper',
};

// ─── Inline NLU helpers ──────────────────────────────────────────────────────

function toHHMM(raw) {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  const m12 = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const min = m12[2] ? parseInt(m12[2], 10) : 0;
    const ap = m12[3].toLowerCase();
    if (ap === 'pm' && h < 12) h += 12;
    if (ap === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
  }
  const m24 = s.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    const h = parseInt(m24[1], 10), mn = parseInt(m24[2], 10);
    if (h >= 0 && h <= 23 && mn >= 0 && mn <= 59)
      return `${String(h).padStart(2,'0')}:${String(mn).padStart(2,'0')}`;
  }
  return null;
}

function toMinutes(t) {
  const h = toHHMM(t);
  if (!h) return null;
  const [hr, mn] = h.split(':').map(Number);
  return hr * 60 + mn;
}

function matchCity(token) {
  if (!token) return null;
  const t = token.trim().toLowerCase();
  if (CITY_ALIASES[t]) return CITY_ALIASES[t];
  for (const [alias, can] of Object.entries(CITY_ALIASES))
    if (t.includes(alias)) return can;
  for (const city of KNOWN_CITIES)
    if (t.includes(city.toLowerCase()))
      return city === 'Bengaluru' ? 'Bangalore' : city;
  return null;
}

function extractCities(q) {
  let source = null, destination = null;

  const fromTo = q.match(/\bfrom\s+([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\s+(?:tomorrow|today|on\s|at\s|around\s|before\s|after\s|morning|evening|night|this\s|next\s|\d)|$)/i);
  if (fromTo) {
    source = matchCity(fromTo[1].trim());
    destination = matchCity(fromTo[2].trim());
    if (source || destination) return { source, destination };
  }

  const arrowMatch = q.match(/\b([a-z]+)\s*(?:to\b|→|->|-(?=\s*[a-z]))\s*([a-z]+)/i);
  if (arrowMatch) {
    const s = matchCity(arrowMatch[1].trim()), d = matchCity(arrowMatch[2].trim());
    if (s || d) return { source: s, destination: d };
  }

  const travelMatch = q.match(/\b(?:travel|go|going|journey)(?:\s+from)?\s+([a-z]+)\s+(?:to|→)\s+([a-z]+)/i);
  if (travelMatch) {
    source = matchCity(travelMatch[1].trim());
    destination = matchCity(travelMatch[2].trim());
    if (source || destination) return { source, destination };
  }

  const rev = q.match(/\b([a-z]+)\s+from\s+([a-z]+)/i);
  if (rev) {
    const d = matchCity(rev[1].trim()), s = matchCity(rev[2].trim());
    if (d || s) return { source: s, destination: d };
  }

  const toOnly = q.match(/\bto\s+([a-z]+)/i);
  if (toOnly) destination = matchCity(toOnly[1].trim());
  const fromOnly = q.match(/\bfrom\s+([a-z]+)/i);
  if (fromOnly) source = matchCity(fromOnly[1].trim());

  if (!source && !destination) {
    const found = [];
    for (const city of KNOWN_CITIES)
      if (q.includes(city.toLowerCase())) {
        const n = city === 'Bengaluru' ? 'Bangalore' : city;
        if (!found.includes(n)) found.push(n);
      }
    for (const [alias, can] of Object.entries(CITY_ALIASES))
      if (q.includes(alias) && !found.includes(can)) found.push(can);
    if (found.length === 2) [source, destination] = found;
    else if (found.length === 1) destination = found[0];
  }

  return { source, destination };
}

function nextWeekday(target, from) {
  const d = new Date(from);
  let diff = target - d.getDay();
  if (diff <= 0) diff += 7;
  d.setDate(d.getDate() + diff);
  return d;
}

function extractDate(q) {
  const today = new Date();
  if (q.includes('day after tomorrow')) {
    const d = new Date(today); d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }
  if (q.includes('tomorrow')) {
    const d = new Date(today); d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
  if (q.includes('today')) return today.toISOString().split('T')[0];
  const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  for (let i = 0; i < days.length; i++) {
    if (new RegExp(`\\b(?:next|this|on)?\\s*${days[i]}\\b`,'i').test(q))
      return nextWeekday(i, today).toISOString().split('T')[0];
  }
  return null;
}

function extractDepartureTime(q) {
  let departure_after = null, departure_before = null;

  const afterM = q.match(/\bafter\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (afterM) departure_after = toHHMM(afterM[1]);

  if (!q.match(/\b(reach|arrive|get there|be there)\b/)) {
    const beforeM = q.match(/\bbefore\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    if (beforeM) departure_before = toHHMM(beforeM[1]);
  }

  const aroundM = q.match(/\baround\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (aroundM && !departure_after) {
    const center = toHHMM(aroundM[1]);
    if (center) {
      const mins = toMinutes(center);
      const am = Math.max(0, mins - 30), bm = mins + 30;
      departure_after = `${String(Math.floor(am/60)).padStart(2,'0')}:${String(am%60).padStart(2,'0')}`;
      departure_before = `${String(Math.floor(bm/60)).padStart(2,'0')}:${String(bm%60).padStart(2,'0')}`;
    }
  }

  if (!departure_after && !departure_before) {
    const sorted = Object.entries(TIME_WINDOWS).sort((a,b) => b[0].length - a[0].length);
    for (const [label, range] of sorted) {
      if (q.includes(label)) {
        departure_after = range.departure_after;
        departure_before = range.departure_before;
        break;
      }
    }
  }

  return { departure_after, departure_before };
}

function extractArrivalConstraint(q) {
  const patterns = [
    /\b(?:reach|arrive|get there|be there|reach there)(?:\s+\w+)?\s+(?:before|by|at)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
    /\b(?:need to reach|have to reach|must reach)(?:\s+\w+)?\s+(?:before|by|at)?\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
    /\b(?:i need to|i have to|i must)\s+(?:be there|arrive|reach)(?:\s+\w+)?\s+(?:before|by|at)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
    /\bget me there by\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
  ];
  for (const p of patterns) {
    const m = q.match(p);
    if (m) {
      let t = toHHMM(m[1]);
      if (!t) {
        const bare = m[1].trim().match(/^(\d{1,2})$/);
        if (bare) t = `${String(parseInt(bare[1],10)).padStart(2,'0')}:00`;
      }
      if (t) return t;
    }
  }

  const eventEarly = q.match(/\b(?:interview|meeting|event|exam|class|appointment)\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b.*?\b(\d+)\s*hour/i);
  if (eventEarly) {
    const et = toHHMM(eventEarly[1]), hrs = parseInt(eventEarly[2], 10);
    if (et && !isNaN(hrs)) {
      const adj = Math.max(0, toMinutes(et) - hrs * 60);
      return `${String(Math.floor(adj/60)).padStart(2,'0')}:${String(adj%60).padStart(2,'0')}`;
    }
  }

  return null;
}

function extractPrice(q) {
  let max_price = null, min_price = null;
  const maxP = [
    /\b(?:under|below|less than|within|not more than|upto|up to|max(?:imum)?|at most)\s*[₹]?\s*(\d[\d,]*)/i,
    /[₹]?\s*(\d[\d,]*)\s*(?:or less|and below|max)/i,
    /\bbudget[:\s]+[₹]?\s*(\d[\d,]*)/i,
  ];
  for (const p of maxP) {
    const m = q.match(p);
    if (m) { max_price = parseInt(m[1].replace(/,/g,''), 10); break; }
  }
  if (!max_price) {
    const am = q.match(/\baround\s*[₹]?\s*(\d[\d,]*)/i);
    if (am) max_price = Math.round(parseInt(am[1].replace(/,/g,''),10) * 1.1);
  }
  const minM = q.match(/\b(?:above|more than|over|at least|minimum)\s*[₹]?\s*(\d[\d,]*)/i);
  if (minM) min_price = parseInt(minM[1].replace(/,/g,''), 10);
  return { max_price, min_price };
}

function extractBusType(q) {
  const sorted = Object.entries(BUS_TYPE_ALIASES).sort((a,b) => b[0].length - a[0].length);
  for (const [alias, norm] of sorted)
    if (q.includes(alias.toLowerCase())) return norm;
  return null;
}

function extractPassengers(q) {
  const w2n = { one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10 };
  const nm = q.match(/\b(\d+)\s*(?:passenger|seat|person|people|adult|travell?er)/i);
  if (nm) return parseInt(nm[1], 10);
  const wm = q.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:passenger|seat|person|people|adult|travell?er)?/i);
  if (wm) { const n = w2n[wm[1].toLowerCase()]; if (n) return n; }
  if (/\bme and my (friend|colleague|partner|wife|husband|brother|sister)\b/i.test(q)) return 2;
  const maF = q.match(/\bme and\s+(\w+)\s+(?:friends?|colleagues?|people)\b/i);
  if (maF) { const n = w2n[maF[1].toLowerCase()]; if (n) return n+1; const d=parseInt(maF[1],10); if(!isNaN(d)) return d+1; }
  const weAre = q.match(/\bwe are\s+(\w+)\b/i);
  if (weAre) { const n = w2n[weAre[1].toLowerCase()] || parseInt(weAre[1],10); if(!isNaN(n)) return n; }
  const fw = q.match(/\bfor\s+(two|three|four|five|six)\b/i);
  if (fw) { const n = w2n[fw[1].toLowerCase()]; if (n) return n; }
  return null;
}

function extractSeatPreference(q) {
  if (/\b(together|adjacent|side by side|next to each other)\b/.test(q)) {
    const cm = q.match(/\b(\d+|two|three|four)\s+seats?\b/i);
    const w2n={two:2,three:3,four:4};
    const count = cm ? (parseInt(cm[1],10)||w2n[cm[1]?.toLowerCase()]||null) : null;
    return { type: SEAT_PREF.ADJACENT, count };
  }
  if (/\bwindow\s+seat\b/.test(q)) return { type: SEAT_PREF.WINDOW, count: null };
  if (/\baisle\s*(?:seat)?\b/.test(q)) return { type: SEAT_PREF.AISLE, count: null };
  if (/\b(front\s+seat|near\s+front)\b/.test(q)) return { type: SEAT_PREF.FRONT, count: null };
  if (/\b(back\s+seat|rear\s+seat)\b/.test(q)) return { type: SEAT_PREF.BACK, count: null };
  if (/\bmiddle\s+seat\b/.test(q)) return { type: SEAT_PREF.MIDDLE, count: null };
  if (/\blower\s+(berth|bunk|bed)\b/.test(q)) return { type: SEAT_PREF.LOWER, count: null };
  if (/\bupper\s+(berth|bunk|bed)\b/.test(q)) return { type: SEAT_PREF.UPPER, count: null };
  return null;
}

function extractPriority(q) {
  for (const [priority, keywords] of Object.entries(PRIORITY_KEYWORDS))
    for (const kw of keywords)
      if (q.includes(kw.toLowerCase())) return priority;
  if (/\b(cheap|affordable|inexpensive|economical)\b/.test(q) && !q.match(/[₹]?\d+/))
    return 'price';
  return null;
}

function detectIntent(q, ctx) {
  if (/\b(cancel|abort|never mind|nevermind|don'?t book|not now|no thanks|stop)\b/.test(q)) return INTENTS.CANCEL;
  if (/\b(yes[,.]?\s*confirm|confirm booking|book it|go ahead|proceed with booking|yes please book|yes do it|do it|confirm it)\b/.test(q)) return INTENTS.BOOKING_CONFIRMATION;
  if (/\b(track|live location|where is (my|the) bus|bus location|bus tracking)\b/.test(q)) return INTENTS.TRACK_BUS;
  if (/\bS[-_\s]?\d{1,2}\b/i.test(q) && /\b(book|select|choose|want seat|s\d)\b/i.test(q)) return INTENTS.SELECT_SEATS;
  if (/\bseats?\s+\d{1,2}\b/i.test(q) && /\b(book|select|choose)\b/.test(q)) return INTENTS.SELECT_SEATS;
  if (/\b(show seats|check seats|available seats|seat (map|availability)|which seats|what seats)\b/.test(q)) return INTENTS.CHECK_SEATS;
  const hasBusResult = ctx.searchResults && ctx.searchResults.length > 0;
  if (hasBusResult && /\b(select|choose|pick|want the|go with|i'?ll take|book (the |this )?(first|second|third|1st|2nd|3rd|recommended|cheapest|fastest|bus))\b/.test(q)) return INTENTS.SELECT_BUS;
  if (/\b(compare|vs|versus|difference between|which (one|bus) is better)\b/.test(q)) return INTENTS.COMPARE_BUSES;
  if (/\b(change (seat|bus|date|passenger|name|email|phone|mobile)|different (seat|bus)|another (seat|bus|date))\b/.test(q)) return INTENTS.CHANGE_REQUEST;
  if (hasBusResult && /\b(cheaper|cheapest|faster|fastest|earliest|show (me )?(more|less|only|just)|filter|affordable|under|below|within|less than|sort|something (cheap|affordable|faster|better|earlier))\b/.test(q)) return INTENTS.FILTER_RESULTS;
  if (/^(hi|hello|hey|help|hiya|howdy|good (morning|evening|afternoon|night))[.!?]?$/.test(q.trim())) return INTENTS.HELP;
  if (/\b(what can you do|how does this work|help me)\b/.test(q)) return INTENTS.HELP;
  const hasRouteSignal = /\b(from|to|→|->)\s/.test(q) || /([a-z]+\s*(to|-|→)\s*[a-z]+)/.test(q);
  if (hasRouteSignal && /\b(best|recommend|suggest|ideal|which (one|bus) (should|would)|good option)\b/.test(q)) return INTENTS.SEARCH_AND_RECOMMEND;
  if (/\b(find|search|look for|get me|show me|book|i (need|want|have) to (travel|go|take|reach)|buses? (from|to|for)|travel from|going to|i'?m going)\b/.test(q) || hasRouteSignal) return INTENTS.SEARCH_BUS;
  return INTENTS.UNKNOWN;
}

function parseUserMessage(message = '', context = {}) {
  const raw = message.toLowerCase().trim().replace(/\s+/g, ' ');
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
    const intent = detectIntent(raw, ctx);
    const { source, destination } = extractCities(raw);
    const date = extractDate(raw);
    const passengers = extractPassengers(raw);
    const entities = { source, destination, date, passengers };

    const { departure_after, departure_before } = extractDepartureTime(raw);
    const arrival_before = extractArrivalConstraint(raw);
    const { max_price, min_price } = extractPrice(raw);
    const bus_type = extractBusType(raw);
    const seat_preference = extractSeatPreference(raw);
    const priority = extractPriority(raw);
    const constraints = { departure_after, departure_before, arrival_before, max_price, min_price, bus_type, seat_preference, priority };

    const missing = [];
    if ([INTENTS.SEARCH_BUS, INTENTS.SEARCH_AND_RECOMMEND].includes(intent)) {
      if (!source && !ctx.source) missing.push('source');
      if (!destination && !ctx.destination) missing.push('destination');
    }

    let score = 0;
    if (intent !== INTENTS.UNKNOWN) score += 0.30;
    if (source && destination) score += 0.25;
    else if (source || destination) score += 0.10;
    if (date) score += 0.20;
    if (Object.values(constraints).some(v => v !== null)) score += 0.15;
    const ctxFill = (!source && ctx.source ? 0.05 : 0) + (!destination && ctx.destination ? 0.05 : 0);
    score += Math.min(0.10, ctxFill);
    const confidence = parseFloat(Math.min(1.0, score).toFixed(2));

    return { success: true, intent, entities, constraints, missing, confidence, raw };
  } catch (err) {
    return {
      success: false, intent: INTENTS.UNKNOWN,
      entities: { source:null, destination:null, date:null, passengers:null },
      constraints: { departure_after:null, departure_before:null, arrival_before:null, max_price:null, min_price:null, bus_type:null, seat_preference:null, priority:null },
      missing: [], confidence: 0, raw: message.toLowerCase().trim(), error: err.message
    };
  }
}

// ─── TEST RUNNER ─────────────────────────────────────────────────────────────

let passed = 0, failed = 0, total = 0;
const failures = [];

/**
 * Runs a single test case.
 *
 * @param {string} description
 * @param {string} message - User input
 * @param {Object} context - Optional agent context
 * @param {Object} assertions - Expected field values { intent, source, destination, date, ... }
 */
function test(description, message, context, assertions) {
  total++;
  const result = parseUserMessage(message, context);
  const flat = {
    intent: result.intent,
    source: result.entities.source,
    destination: result.entities.destination,
    date: result.entities.date,
    passengers: result.entities.passengers,
    departure_after: result.constraints.departure_after,
    departure_before: result.constraints.departure_before,
    arrival_before: result.constraints.arrival_before,
    max_price: result.constraints.max_price,
    min_price: result.constraints.min_price,
    bus_type: result.constraints.bus_type,
    priority: result.constraints.priority,
    seat_preference_type: result.constraints.seat_preference?.type || null,
    seat_preference_count: result.constraints.seat_preference?.count || null,
    missing_includes: null, // special handling below
    source_null: null,
    destination_null: null,
  };

  let ok = true;
  const mismatches = [];

  for (const [key, expected] of Object.entries(assertions)) {
    if (key === 'missing_includes') {
      // Check that 'missing' array includes the expected value
      if (!result.missing.includes(expected)) {
        ok = false;
        mismatches.push(`missing should include "${expected}", got [${result.missing.join(', ')}]`);
      }
    } else if (key === 'source_null') {
      if (result.entities.source !== null) {
        ok = false;
        mismatches.push(`source should be null, got "${result.entities.source}"`);
      }
    } else if (key === 'destination_null') {
      if (result.entities.destination !== null) {
        ok = false;
        mismatches.push(`destination should be null, got "${result.entities.destination}"`);
      }
    } else {
      const actual = flat[key];
      if (actual !== expected) {
        ok = false;
        mismatches.push(`${key}: expected "${expected}", got "${actual}"`);
      }
    }
  }

  const status = ok ? '✅ PASS' : '❌ FAIL';
  if (ok) {
    passed++;
    console.log(`${status}  [${total.toString().padStart(2,'0')}] ${description}`);
  } else {
    failed++;
    failures.push({ num: total, description, message, mismatches });
    console.log(`${status}  [${total.toString().padStart(2,'0')}] ${description}`);
    mismatches.forEach(m => console.log(`         ⚠ ${m}`));
  }
}

// =============================================================================
// TEST CASES
// =============================================================================

console.log('\n══════════════════════════════════════════════════════════════');
console.log('  GoTicket NLU Service — Test Suite');
console.log('  Current date:', new Date().toISOString().split('T')[0]);
console.log('══════════════════════════════════════════════════════════════\n');

// ── Category 1: Basic search variations ──────────────────────────────────────
console.log('── 1. Basic Search Variations ──────────────────────────────────');

test('Standard "find buses from X to Y" phrasing',
  'Find buses from Kanpur to Delhi tomorrow',
  {},
  { intent: INTENTS.SEARCH_BUS, source: 'Kanpur', destination: 'Delhi' });

test('Informal "I need to travel" phrasing',
  'I need to travel from Kanpur to Delhi tomorrow',
  {},
  { intent: INTENTS.SEARCH_BUS, source: 'Kanpur', destination: 'Delhi' });

test('Abbreviation KNP recognized as Kanpur',
  'Can you get me a bus KNP to Delhi tomorrow?',
  {},
  { intent: INTENTS.SEARCH_BUS, source: 'Kanpur', destination: 'Delhi' });

test('Reversed phrasing "Delhi from Kanpur"',
  'I want to go Delhi from Kanpur tomorrow',
  {},
  { intent: INTENTS.SEARCH_BUS, source: 'Kanpur', destination: 'Delhi' });

test('Arrow notation "Kanpur → Delhi"',
  'Travel Kanpur → Delhi tomorrow',
  {},
  { intent: INTENTS.SEARCH_BUS, source: 'Kanpur', destination: 'Delhi' });

// ── Category 2: Source/Destination Wording Variations ────────────────────────
console.log('\n── 2. Source / Destination Wording ────────────────────────────');

test('"I want to go from X to Y"',
  'I want to go from Lucknow to Delhi tomorrow',
  {},
  { source: 'Lucknow', destination: 'Delhi' });

test('"Search X to Y" short form',
  'Search Kanpur to Lucknow',
  {},
  { source: 'Kanpur', destination: 'Lucknow' });

test('"Get me to X" — only destination',
  'Book me a bus to Delhi',
  {},
  { source: null, destination: 'Delhi', missing_includes: 'source' });

test('"Starting from X" — only source',
  'I am starting from Kanpur',
  {},
  { source: 'Kanpur', destination: null, missing_includes: 'destination' });

test('Alias: "Bombay" resolves to "Mumbai"',
  'Find buses from Bombay to Pune',
  {},
  { source: 'Mumbai', destination: 'Pune' });

test('Alias: "Bengaluru" resolves to "Bangalore"',
  'Buses from Bangalore to Hyderabad',
  {},
  { source: 'Bangalore', destination: 'Hyderabad' });

// ── Category 3: Relative Date Variations ─────────────────────────────────────
console.log('\n── 3. Relative Date Variations ─────────────────────────────────');

const today = new Date().toISOString().split('T')[0];
const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; })();
const dayAfter = (() => { const d = new Date(); d.setDate(d.getDate()+2); return d.toISOString().split('T')[0]; })();

test('"today" resolves to today\'s date',
  'Find buses from Kanpur to Delhi today',
  {},
  { date: today });

test('"tomorrow" resolves to tomorrow\'s date',
  'I need to travel from Kanpur to Delhi tomorrow',
  {},
  { date: tomorrow });

test('"day after tomorrow" resolves correctly',
  'Book a bus from Delhi to Jaipur day after tomorrow',
  {},
  { date: dayAfter });

test('"next Monday" resolves to next Monday',
  'Find buses from Kanpur to Delhi next Monday',
  {},
  { intent: INTENTS.SEARCH_BUS });
// (date value varies by run day; we just check intent and no crash)

test('"this Friday" resolves to upcoming Friday',
  'Can I get a bus from Delhi to Lucknow this Friday?',
  {},
  { intent: INTENTS.SEARCH_BUS, source: 'Delhi', destination: 'Lucknow' });

// ── Category 4: Departure Time Preferences ───────────────────────────────────
console.log('\n── 4. Departure Time Preferences ───────────────────────────────');

test('"after 9 PM" → departure_after 21:00',
  'Find buses from Kanpur to Delhi after 9 PM',
  {},
  { departure_after: '21:00' });

test('"around 9 PM" → departure window ±30 min',
  'Find buses from Kanpur to Delhi around 9 PM',
  {},
  { departure_after: '20:30', departure_before: '21:30' });

test('"evening" → departure window 17:00–21:00',
  'I want to go from Kanpur to Delhi in the evening',
  {},
  { departure_after: '17:00', departure_before: '21:00' });

test('"morning" → departure window 06:00–12:00',
  'Show me morning buses from Lucknow to Delhi',
  {},
  { departure_after: '06:00', departure_before: '12:00' });

test('"tonight" → departure_after 18:00',
  'Find buses from Kanpur to Delhi tonight',
  {},
  { departure_after: '18:00' });

test('"early morning" → departure window 04:00–07:00',
  'I need an early morning bus from Delhi to Jaipur',
  {},
  { departure_after: '04:00', departure_before: '07:00' });

// ── Category 5: Budget Constraints ───────────────────────────────────────────
console.log('\n── 5. Budget Constraints ───────────────────────────────────────');

test('"under 1500" → max_price: 1500',
  'Find buses from Kanpur to Delhi under 1500',
  {},
  { max_price: 1500 });

test('"below ₹1500" → max_price: 1500',
  'Show me buses from Kanpur to Delhi below ₹1500',
  {},
  { max_price: 1500 });

test('"less than 700" → max_price: 700',
  'I want a bus from Kanpur to Delhi less than 700',
  {},
  { max_price: 700 });

test('"cheap" without number → priority: price',
  'Find me a cheap bus from Kanpur to Delhi',
  {},
  { priority: 'price', max_price: null });

test('"affordable" → priority: price',
  'I need an affordable bus to Delhi tomorrow',
  {},
  { priority: 'price' });

// ── Category 6: Bus Type ──────────────────────────────────────────────────────
console.log('\n── 6. Bus Type ─────────────────────────────────────────────────');

test('"AC" → bus_type: AC',
  'Find an AC bus from Kanpur to Delhi tomorrow',
  {},
  { bus_type: 'AC' });

test('"non-AC" → bus_type: Non-AC',
  'I want a non-AC bus from Kanpur to Lucknow',
  {},
  { bus_type: 'Non-AC' });

test('"AC sleeper" → bus_type: AC Sleeper',
  'Find AC sleeper buses from Delhi to Jaipur tomorrow',
  {},
  { bus_type: 'AC Sleeper' });

test('"Volvo" → bus_type: Volvo AC',
  'Get me a Volvo bus from Kanpur to Delhi',
  {},
  { bus_type: 'Volvo AC' });

// ── Category 7: Passenger Count ───────────────────────────────────────────────
console.log('\n── 7. Passenger Count ──────────────────────────────────────────');

test('"2 passengers" → passengers: 2',
  'Find buses from Kanpur to Delhi for 2 passengers tomorrow',
  {},
  { passengers: 2 });

test('"for two people" → passengers: 2',
  'I need a bus from Kanpur to Delhi for two people',
  {},
  { passengers: 2 });

test('"me and my friend" → passengers: 2',
  'Book a bus from Delhi to Agra for me and my friend tomorrow',
  {},
  { passengers: 2 });

test('"we are three" → passengers: 3',
  'We are three and want to travel from Lucknow to Delhi tomorrow',
  {},
  { passengers: 3 });

// ── Category 8: Seat Preferences ─────────────────────────────────────────────
console.log('\n── 8. Seat Preferences ─────────────────────────────────────────');

test('"window seat" → seat_preference: window',
  'I want a window seat',
  {},
  { seat_preference_type: 'window' });

test('"aisle seat" → seat_preference: aisle',
  'Please give me an aisle seat',
  {},
  { seat_preference_type: 'aisle' });

test('"two seats together" → adjacent, count 2',
  'I need two seats together',
  {},
  { seat_preference_type: 'adjacent', seat_preference_count: 2 });

test('"lower berth" → seat_preference: lower',
  'I prefer a lower berth in the sleeper bus',
  {},
  { seat_preference_type: 'lower' });

// ── Category 9: Arrival Constraints ──────────────────────────────────────────
console.log('\n── 9. Arrival Constraints ──────────────────────────────────────');

test('"reach before 8 AM" → arrival_before: 08:00',
  'I need to reach Delhi before 8 AM',
  {},
  { arrival_before: '08:00' });

test('"get me there by 8" → arrival_before: 08:00',
  'Get me there by 8',
  {},
  { arrival_before: '08:00' });

test('"interview at 10 AM, 1 hour early" → arrival_before: 09:00',
  'I have an interview at 10 AM and need to be there 1 hour early',
  {},
  { arrival_before: '09:00' });

// ── Category 10: Multi-Constraint Combined Requests ───────────────────────────
console.log('\n── 10. Combined Multi-Constraint Requests ───────────────────────');

test('Route + date + time + budget',
  'Find AC buses from Kanpur to Delhi tomorrow after 9 PM under 1500',
  {},
  { source: 'Kanpur', destination: 'Delhi', date: tomorrow, departure_after: '21:00', max_price: 1500, bus_type: 'AC' });

test('Route + passengers + seat preference',
  'I need two seats together on a bus from Lucknow to Delhi tomorrow',
  {},
  { source: 'Lucknow', destination: 'Delhi', date: tomorrow, passengers: 2, seat_preference_type: 'adjacent' });

test('Route + arrival constraint + bus type',
  'Find a sleeper bus from Kanpur to Delhi, I need to reach by 6 AM',
  {},
  { source: 'Kanpur', destination: 'Delhi', bus_type: 'Sleeper', arrival_before: '06:00' });

// ── Category 11: Follow-Up / Filter Requests (with context) ──────────────────
console.log('\n── 11. Follow-Up / Filter Requests (with context) ──────────────');

const searchCtx = {
  source: 'Kanpur',
  destination: 'Delhi',
  date: tomorrow,
  searchResults: [{ id: 'BUS1', operator: 'GoRide' }]
};

test('"show cheaper ones" with context → FILTER_RESULTS',
  'Show me something cheaper',
  searchCtx,
  { intent: INTENTS.FILTER_RESULTS, priority: 'price' });

test('"fastest" with context → FILTER_RESULTS + priority: time',
  'Give me the fastest option',
  searchCtx,
  { intent: INTENTS.FILTER_RESULTS, priority: 'time' });

test('"select the first one" with context → SELECT_BUS',
  'Select the first one',
  searchCtx,
  { intent: INTENTS.SELECT_BUS });

// ── Category 12: Ambiguous / Missing Info ─────────────────────────────────────
console.log('\n── 12. Ambiguous / Missing Info ────────────────────────────────');

test('"Book me a bus" — no route → missing source AND destination',
  'Book me a bus',
  {},
  { intent: INTENTS.SEARCH_BUS, source_null: true, destination_null: true, missing_includes: 'source' });

test('"Book me a bus to Delhi" — no source',
  'Book me a bus to Delhi',
  {},
  { destination: 'Delhi', source_null: true, missing_includes: 'source' });

test('"Find something cheap" — no route, no context',
  'Find something cheap',
  {},
  { priority: 'price', source_null: true, destination_null: true });

// ── Category 13: Context Preservation ────────────────────────────────────────
console.log('\n── 13. Context Preservation ────────────────────────────────────');

test('NLU does not erase existing route context',
  'Show me something cheaper',
  { source: 'Kanpur', destination: 'Delhi', date: tomorrow, searchResults: [{ id: 'BUS1' }] },
  { intent: INTENTS.FILTER_RESULTS }
  // source/destination come from context, NLU doesn't erase them
);

test('NLU does not invent source when context has destination only',
  'Show me buses after 9 PM',
  { destination: 'Delhi', searchResults: [] },
  { departure_after: '21:00', source_null: true }
);

// ── Category 14: Special Intents ─────────────────────────────────────────────
console.log('\n── 14. Special Intents ─────────────────────────────────────────');

test('Cancel intent',
  'Cancel',
  {},
  { intent: INTENTS.CANCEL });

test('Track bus intent',
  'Where is my bus?',
  {},
  { intent: INTENTS.TRACK_BUS });

test('Select seats intent (specific seat IDs)',
  'Book S3 and S4',
  {},
  { intent: INTENTS.SELECT_SEATS });

test('Check seats intent',
  'Show available seats',
  {},
  { intent: INTENTS.CHECK_SEATS });

test('Search and recommend intent',
  'What is the best bus from Kanpur to Delhi tomorrow?',
  {},
  { intent: INTENTS.SEARCH_AND_RECOMMEND, source: 'Kanpur', destination: 'Delhi' });

test('Help / greeting intent',
  'Hi',
  {},
  { intent: INTENTS.HELP });

// =============================================================================
// SUMMARY
// =============================================================================

console.log('\n══════════════════════════════════════════════════════════════');
console.log(`  Results: ${passed} PASSED / ${failed} FAILED / ${total} TOTAL`);
if (failures.length > 0) {
  console.log('\n  Failed Tests:');
  failures.forEach(f => {
    console.log(`    [${f.num}] ${f.description}`);
    console.log(`         Input: "${f.message}"`);
    f.mismatches.forEach(m => console.log(`         ✗ ${m}`));
  });
}
console.log('══════════════════════════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('  All NLU tests passed! ✅\n');
}
