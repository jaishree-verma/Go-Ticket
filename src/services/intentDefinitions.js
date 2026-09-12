// GoTicket NLU Intent Definitions
// Single source of truth for all NLU constants, schemas, and normalization maps.
// Zero project imports — this file is a pure data/constant module.
// Designed so that a future LLM-based NLU can produce the same contract.

// =============================================================================
// INTENT TAXONOMY
// =============================================================================

/**
 * Centralized intent taxonomy for the GoTicket travel agent.
 *
 * Rules:
 * - Add new intents here first, then handle them in nluService.js.
 * - Never use raw strings for intent names outside this file.
 * - Keep the list small and purposeful — do not over-engineer.
 */
export const INTENTS = Object.freeze({
  /** User wants to search for buses on a route */
  SEARCH_BUS: 'SEARCH_BUS',

  /** User wants to search AND get a recommendation in one shot */
  SEARCH_AND_RECOMMEND: 'SEARCH_AND_RECOMMEND',

  /** User wants to narrow down an existing result set (e.g. "show cheaper ones") */
  FILTER_RESULTS: 'FILTER_RESULTS',

  /** User wants to compare two or more specific buses */
  COMPARE_BUSES: 'COMPARE_BUSES',

  /** User wants to select a specific bus from the result list */
  SELECT_BUS: 'SELECT_BUS',

  /** User wants to check seat availability for a selected bus */
  CHECK_SEATS: 'CHECK_SEATS',

  /** User is selecting specific seat numbers (e.g. "Book S3 and S4") */
  SELECT_SEATS: 'SELECT_SEATS',

  /** User is explicitly confirming a booking */
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',

  /** User wants to cancel the current flow */
  CANCEL: 'CANCEL',

  /** User wants to change something in the current context (bus, seat, date) */
  CHANGE_REQUEST: 'CHANGE_REQUEST',

  /** User wants to track a live bus */
  TRACK_BUS: 'TRACK_BUS',

  /** User is asking for help, a greeting, or a general question */
  HELP: 'HELP',

  /** Intent could not be determined from the input */
  UNKNOWN: 'UNKNOWN',
});

// =============================================================================
// TRAVEL REQUEST SCHEMA
// =============================================================================

/**
 * Factory that returns a normalized, empty TravelRequest object.
 *
 * The NLU layer populates only fields it can extract from the user message.
 * Fields that are not mentioned by the user MUST remain null.
 * The agent/service layer merges this with existing context and decides what
 * to ask the user for.
 *
 * @returns {Object} A fresh, null-filled TravelRequest
 */
export const createTravelRequest = () => ({
  /** Detected intent (one of INTENTS values) */
  intent: null,

  /** Departure city — matched to a known city; null if not mentioned */
  source: null,

  /** Arrival city — matched to a known city; null if not mentioned */
  destination: null,

  /** Travel date as ISO string (YYYY-MM-DD); null if not mentioned */
  date: null,

  /** Earliest acceptable departure time as "HH:MM" (24-hour); null if not stated */
  departure_after: null,

  /** Latest acceptable departure time as "HH:MM" (24-hour); null if not stated */
  departure_before: null,

  /** Arrival must be before this time as "HH:MM" (24-hour); null if not stated */
  arrival_before: null,

  /** Maximum acceptable fare in INR; null if not stated numerically */
  max_price: null,

  /** Minimum acceptable fare in INR (rarely used); null if not stated */
  min_price: null,

  /** Normalized bus type string; null if not stated */
  bus_type: null,

  /** Number of passengers; null if not stated (NOT defaulted to 1 — agent decides) */
  passengers: null,

  /** Seat preference object { type, count } or null */
  seat_preference: null,

  /**
   * User's optimization priority.
   * Values: "price" | "time" | "comfort" | "rating" | "balanced" | null
   * null means user did not express a qualitative priority.
   */
  priority: null,
});

// =============================================================================
// CITY NORMALIZATION MAP
// =============================================================================

/**
 * Canonical city names supported by the GoTicket platform.
 * The NLU uses this as the single source of truth for city matching.
 * Add new cities here to extend coverage.
 */
export const KNOWN_CITIES = [
  'Kanpur', 'Delhi', 'Lucknow', 'Agra', 'Jaipur', 'Mumbai',
  'Pune', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Kolkata', 'Dehradun', 'Chandigarh', 'Ahmedabad', 'Surat',
  'Varanasi', 'Goa', 'Bhopal', 'Indore', 'Patna', 'Ranchi',
];

/**
 * City aliases and abbreviations → canonical city name.
 * Keys are lowercase. Values are canonical KNOWN_CITIES entries.
 * Extend this map to support more regional aliases.
 */
export const CITY_ALIASES = Object.freeze({
  // Kanpur aliases
  'knp': 'Kanpur',
  'cawnpore': 'Kanpur',
  'kanpur nagar': 'Kanpur',

  // Delhi aliases
  'new delhi': 'Delhi',
  'ndls': 'Delhi',
  'dli': 'Delhi',

  // Lucknow aliases
  'lko': 'Lucknow',
  'lkw': 'Lucknow',
  'lucknow city': 'Lucknow',

  // Bangalore / Bengaluru
  'bengaluru': 'Bangalore',
  'blr': 'Bangalore',

  // Mumbai
  'bombay': 'Mumbai',
  'bom': 'Mumbai',

  // Jaipur
  'pink city': 'Jaipur',
  'jp': 'Jaipur',

  // Agra
  'taj city': 'Agra',
  'agra city': 'Agra',

  // Pune
  'poona': 'Pune',

  // Hyderabad
  'hyd': 'Hyderabad',
  'cyberabad': 'Hyderabad',

  // Chennai
  'madras': 'Chennai',
  'maa': 'Chennai',

  // Kolkata
  'calcutta': 'Kolkata',
  'cal': 'Kolkata',
});

// =============================================================================
// BUS TYPE NORMALIZATION MAP
// =============================================================================

/**
 * Maps natural-language bus type mentions → normalized bus type strings.
 * Keys are lowercase phrases to match against.
 * Values are normalized representations consistent with mockBuses.js busType field.
 */
export const BUS_TYPE_ALIASES = Object.freeze({
  // AC variants
  'ac': 'AC',
  'a/c': 'AC',
  'air conditioned': 'AC',
  'air-conditioned': 'AC',
  'airconditioned': 'AC',
  'with ac': 'AC',

  // Non-AC variants
  'non ac': 'Non-AC',
  'non-ac': 'Non-AC',
  'nonac': 'Non-AC',
  'without ac': 'Non-AC',
  'no ac': 'Non-AC',
  'non air conditioned': 'Non-AC',
  'general': 'Non-AC',
  'ordinary': 'Non-AC',

  // Sleeper variants
  'sleeper': 'Sleeper',
  'sleeping': 'Sleeper',
  'sleep bus': 'Sleeper',

  // Seater variants
  'seater': 'Seater',
  'seated': 'Seater',
  'sitting': 'Seater',
  'sit bus': 'Seater',

  // Volvo
  'volvo': 'Volvo AC',
  'volvo bus': 'Volvo AC',

  // Combined types
  'ac sleeper': 'AC Sleeper',
  'ac seater': 'AC Seater',
  'non ac sleeper': 'Non-AC Sleeper',
  'non-ac sleeper': 'Non-AC Sleeper',
  'luxury': 'AC Sleeper',
  'premium': 'AC Sleeper',
});

// =============================================================================
// PRIORITY NORMALIZATION MAP
// =============================================================================

/**
 * Maps qualitative preference phrases → priority enum values.
 * Used when the user expresses a general preference rather than a specific constraint.
 */
export const PRIORITY_KEYWORDS = Object.freeze({
  // Price priority (includes comparatives for follow-up requests)
  price: ['cheapest', 'cheapo', 'most affordable', 'lowest fare', 'lowest price',
    'cheapest option', 'budget', 'low cost', 'inexpensive', 'economical', 'value',
    'cheaper', 'something cheaper', 'more affordable', 'less expensive'],

  // Time priority (includes comparatives)
  time: ['fastest', 'fastest option', 'quickest', 'earliest', 'shortest', 'shortest journey',
    'least time', 'minimum time', 'earliest arrival', 'soonest', 'faster', 'quicker',
    'something faster', 'earlier bus'],

  // Comfort priority
  comfort: ['most comfortable', 'comfortable', 'luxury', 'premium', 'best comfort',
    'coziest', 'best amenities', 'sleeper', 'reclining'],

  // Rating priority
  rating: ['best rated', 'top rated', 'highest rated', 'best reviews',
    'most popular', 'best reviewed', 'well rated', 'top reviews'],

  // Balanced (explicit)
  balanced: ['balanced', 'best overall', 'best option', 'best value',
    'good option', 'recommended', 'suggest', 'best pick'],
});

// =============================================================================
// TIME WINDOW DEFINITIONS
// =============================================================================

/**
 * Named time windows mapped to 24-hour HH:MM ranges.
 * Used when the user says "evening" or "night" rather than a specific time.
 *
 * Format: { label, departure_after, departure_before }
 * A null boundary means "no constraint on that side".
 */
export const TIME_WINDOWS = Object.freeze({
  'early morning': { departure_after: '04:00', departure_before: '07:00' },
  'morning': { departure_after: '06:00', departure_before: '12:00' },
  'noon': { departure_after: '11:00', departure_before: '13:00' },
  'afternoon': { departure_after: '12:00', departure_before: '17:00' },
  'evening': { departure_after: '17:00', departure_before: '21:00' },
  'late evening': { departure_after: '19:00', departure_before: '23:00' },
  'night': { departure_after: '20:00', departure_before: null },
  'late night': { departure_after: '22:00', departure_before: null },
  'tonight': { departure_after: '18:00', departure_before: null },
  'midnight': { departure_after: '23:00', departure_before: '01:00' },
});

// =============================================================================
// SEAT PREFERENCE TYPES
// =============================================================================

/**
 * Seat preference type constants.
 * The NLU extracts a { type, count } object using these values.
 */
export const SEAT_PREFERENCE_TYPES = Object.freeze({
  WINDOW: 'window',
  AISLE: 'aisle',
  FRONT: 'front',
  BACK: 'back',
  MIDDLE: 'middle',
  ADJACENT: 'adjacent',   // seats together / side by side
  LOWER: 'lower',         // lower berth in sleeper
  UPPER: 'upper',         // upper berth in sleeper
});
