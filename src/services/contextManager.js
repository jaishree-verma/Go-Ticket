// GoTicket Context Manager — Step 2: Agent Context Manager
//
// Pure, UI-independent service that maintains, merges, and updates
// conversation context across multiple user turns.
//
// Architectural Rules:
//   ✓ Pure JavaScript — zero React or UI imports
//   ✓ Zero calls to busService, seatService, bookingService, or agentTools
//   ✓ Never mutates context in-place — all operations return fresh snapshots
//   ✓ Keeps travel requirements and agent execution state cleanly separated
//   ✓ Independent of whether NLU is deterministic or LLM-driven

// Zero project imports — pure data/context management service.

// =============================================================================
// INTERNAL UTILITIES
// =============================================================================

/**
 * Deep clones an object or array without relying on external packages.
 * Safe for JSON-serializable structures (strings, numbers, booleans, null, arrays, objects).
 *
 * @param {*} val
 * @returns {*}
 */
export const deepClone = (val) => {
  if (val === null || typeof val !== 'object') {
    return val;
  }
  if (Array.isArray(val)) {
    return val.map((item) => deepClone(item));
  }
  const copy = {};
  for (const key of Object.keys(val)) {
    copy[key] = deepClone(val[key]);
  }
  return copy;
};

// =============================================================================
// FACTORY / INITIALIZATION
// =============================================================================

/**
 * Creates a fresh, default AgentContext object.
 *
 * Schema:
 *   travelRequest: User travel intent and search constraints
 *   conversation: Turn metadata (lastIntent, lastUserMessage)
 *   search: Execution state for bus search and recommendation
 *   seats: Execution state for seat availability and hold
 *   booking: Execution state for passenger details and confirmation status
 *
 * @param {Object} [initialState={}]
 * @returns {Object} Fresh AgentContext
 */
export const createAgentContext = (initialState = {}) => {
  const base = {
    travelRequest: {
      source: null,
      destination: null,
      date: null,
      departure_after: null,
      departure_before: null,
      arrival_before: null,
      max_price: null,
      min_price: null,
      bus_type: null,
      passengers: null,
      seat_preference: null,
      priority: null,
    },
    conversation: {
      lastIntent: null,
      lastUserMessage: null,
    },
    search: {
      results: [],
      selectedBus: null,
      selectedSlot: null,
    },
    seats: {
      available: [],
      selected: [],
    },
    booking: {
      passenger: null,
      status: null,
    },
  };

  if (!initialState || typeof initialState !== 'object') {
    return base;
  }

  const cloned = deepClone(base);

  if (initialState.travelRequest) {
    cloned.travelRequest = { ...cloned.travelRequest, ...deepClone(initialState.travelRequest) };
  }
  if (initialState.conversation) {
    cloned.conversation = { ...cloned.conversation, ...deepClone(initialState.conversation) };
  }
  if (initialState.search) {
    cloned.search = { ...cloned.search, ...deepClone(initialState.search) };
  }
  if (initialState.seats) {
    cloned.seats = { ...cloned.seats, ...deepClone(initialState.seats) };
  }
  if (initialState.booking) {
    cloned.booking = { ...cloned.booking, ...deepClone(initialState.booking) };
  }

  return cloned;
};

/**
 * Builds or reconciles an AgentContext from existing agentState and params.
 * Ensures seamless compatibility with legacy state formats while persisting
 * the structured context.
 *
 * @param {Object} args
 * @param {Object} [args.agentState={}]
 * @param {Object} [args.params={}]
 * @param {Array}  [args.searchResults=[]]
 * @param {Object} [args.selectedBus=null]
 * @param {Object} [args.selectedSlot=null]
 * @param {Array}  [args.selectedSeats=[]]
 * @returns {Object} An AgentContext instance
 */
export const buildAgentContextFromState = ({
  agentState = {},
  params = {},
  searchResults = [],
  selectedBus = null,
  selectedSlot = null,
  selectedSeats = [],
} = {}) => {
  // If agentState already contains an AgentContext, start from it
  if (agentState && agentState.agentCtx && typeof agentState.agentCtx === 'object') {
    const ctx = deepClone(agentState.agentCtx);

    // Sync execution state if explicitly provided and non-empty
    if (Array.isArray(searchResults) && searchResults.length > 0) {
      ctx.search.results = deepClone(searchResults);
    }
    if (selectedBus) {
      ctx.search.selectedBus = deepClone(selectedBus);
    }
    if (selectedSlot) {
      ctx.search.selectedSlot = deepClone(selectedSlot);
    }
    if (Array.isArray(selectedSeats) && selectedSeats.length > 0) {
      ctx.seats.selected = deepClone(selectedSeats);
    }

    return ctx;
  }

  // Otherwise initialize a new context from legacy params and state
  const ctx = createAgentContext({
    travelRequest: {
      source: params.source || null,
      destination: params.destination || null,
      date: params.date || null,
      departure_after: params.preferredTime || null,
      passengers: params.passengers || null,
      max_price: params.max_price || null,
      bus_type: params.bus_type || null,
    },
    search: {
      results: Array.isArray(searchResults) ? deepClone(searchResults) : [],
      selectedBus: selectedBus ? deepClone(selectedBus) : null,
      selectedSlot: selectedSlot ? deepClone(selectedSlot) : null,
    },
    seats: {
      available: Array.isArray(params.availableSeats) ? deepClone(params.availableSeats) : [],
      selected: Array.isArray(selectedSeats) ? deepClone(selectedSeats) : [],
    },
    booking: {
      passenger: agentState.passengerDetails ? deepClone(agentState.passengerDetails) : null,
      status: agentState.state || null,
    },
  });

  return ctx;
};

// =============================================================================
// NLU ADAPTER
// =============================================================================

/**
 * Builds the read-only context snapshot expected by `parseUserMessage(message, context)`.
 *
 * @param {Object} context - AgentContext
 * @returns {Object} Read-only snapshot for NLU
 */
export const buildNLUContext = (context = {}) => {
  const req = context.travelRequest || {};
  const search = context.search || {};

  return {
    source: req.source || null,
    destination: req.destination || null,
    date: req.date || null,
    preferredTime: req.departure_after || null,
    selectedBus: search.selectedBus || null,
    searchResults: Array.isArray(search.results) ? deepClone(search.results) : [],
    passengers: req.passengers || null,
    constraints: {
      departure_after: req.departure_after || null,
      departure_before: req.departure_before || null,
      arrival_before: req.arrival_before || null,
      max_price: req.max_price || null,
      min_price: req.min_price || null,
      bus_type: req.bus_type || null,
      seat_preference: req.seat_preference ? deepClone(req.seat_preference) : null,
      priority: req.priority || null,
    },
  };
};

// =============================================================================
// CLEARING HEURISTICS
// =============================================================================

/**
 * Checks if the user message contains explicit intent to clear specific constraints.
 * Only triggers on unambiguous clearing phrases.
 *
 * @param {string} raw - Lowercased user message
 * @returns {string[]} Array of field names to clear (e.g. ['max_price', 'min_price'])
 */
export const detectExplicitClearing = (raw = '') => {
  if (!raw || typeof raw !== 'string') return [];
  const text = raw.toLowerCase();
  const cleared = [];

  // Budget / price clearing
  if (
    /\b(don'?t care about (the )?budget|no budget|any budget|remove budget|without budget|no price limit|clear budget|any price)\b/.test(text)
  ) {
    cleared.push('max_price', 'min_price');
  }

  // Seat preference clearing
  if (
    /\b(no seat preference|any seat|clear seat preference|don'?t care about seat)\b/.test(text)
  ) {
    cleared.push('seat_preference');
  }

  // Bus type clearing
  if (
    /\b(any bus|any bus type|no bus type preference|all buses|clear bus type)\b/.test(text)
  ) {
    cleared.push('bus_type');
  }

  // Priority clearing
  if (
    /\b(no preference|clear preference|reset priority|any option)\b/.test(text)
  ) {
    cleared.push('priority');
  }

  return [...new Set(cleared)];
};

// =============================================================================
// CONTEXT MERGING & UPDATES
// =============================================================================

/**
 * Merges newly extracted NLU information into the existing TravelRequest.
 *
 * Rules:
 *   1. Only update fields that NLU actually extracted (non-null).
 *   2. Never overwrite an existing value with null unless explicitly cleared.
 *   3. Explicit corrections replace old values.
 *   4. Supports explicit clearing via options.cleared or detected clearing phrases.
 *   5. Pure function: never mutates original context, returns a new context object.
 *
 * @param {Object} context - Current AgentContext
 * @param {Object} nluResult - Parsed result from parseUserMessage() or partial TravelRequest
 * @param {Object} [options={}]
 * @param {string[]} [options.cleared=[]] - List of fields to explicitly clear to null
 * @returns {Object} New AgentContext with merged travelRequest
 */
export const mergeTravelRequest = (context = {}, nluResult = {}, options = {}) => {
  const nextCtx = createAgentContext(context);
  const currentReq = nextCtx.travelRequest;

  // Flatten NLU result if it came from parseUserMessage()
  let incoming = {};
  let rawText = '';

  if (nluResult) {
    rawText = nluResult.raw || (typeof nluResult === 'string' ? nluResult : '');

    if (nluResult.entities || nluResult.constraints) {
      const e = nluResult.entities || {};
      const c = nluResult.constraints || {};
      incoming = {
        source: e.source,
        destination: e.destination,
        date: e.date,
        passengers: e.passengers,
        departure_after: c.departure_after,
        departure_before: c.departure_before,
        arrival_before: c.arrival_before,
        max_price: c.max_price,
        min_price: c.min_price,
        bus_type: c.bus_type,
        seat_preference: c.seat_preference,
        priority: c.priority,
      };
    } else {
      // Direct partial object
      incoming = { ...nluResult };
    }
  }

  // 1. Determine explicitly cleared fields
  const detectedClear = detectExplicitClearing(rawText);
  const explicitClear = Array.isArray(options.cleared) ? options.cleared : [];
  const fieldsToClear = new Set([...detectedClear, ...explicitClear]);

  // Expand aliases (e.g. 'budget' -> 'max_price', 'min_price')
  if (fieldsToClear.has('budget')) {
    fieldsToClear.add('max_price');
    fieldsToClear.add('min_price');
  }

  // 2. Merge non-null incoming fields
  const travelKeys = [
    'source',
    'destination',
    'date',
    'departure_after',
    'departure_before',
    'arrival_before',
    'max_price',
    'min_price',
    'bus_type',
    'passengers',
    'seat_preference',
    'priority',
  ];

  for (const key of travelKeys) {
    if (fieldsToClear.has(key)) {
      currentReq[key] = null;
    } else if (incoming[key] !== undefined && incoming[key] !== null) {
      currentReq[key] = deepClone(incoming[key]);
    }
  }

  return nextCtx;
};

/**
 * Updates search context execution state (results, selected bus, slot).
 * Returns a new context object.
 *
 * @param {Object} context
 * @param {Object} update
 * @param {Array}  [update.results]
 * @param {Object} [update.selectedBus]
 * @param {Object} [update.selectedSlot]
 * @returns {Object} New AgentContext
 */
export const updateSearchContext = (context = {}, update = {}) => {
  const nextCtx = createAgentContext(context);

  if (update.results !== undefined) {
    nextCtx.search.results = Array.isArray(update.results) ? deepClone(update.results) : [];
  }
  if (update.selectedBus !== undefined) {
    nextCtx.search.selectedBus = update.selectedBus ? deepClone(update.selectedBus) : null;
  }
  if (update.selectedSlot !== undefined) {
    nextCtx.search.selectedSlot = update.selectedSlot ? deepClone(update.selectedSlot) : null;
  }

  return nextCtx;
};

/**
 * Updates seats execution state (available seats, selected seats).
 * Returns a new context object.
 *
 * @param {Object} context
 * @param {Object} update
 * @param {Array}  [update.available]
 * @param {Array}  [update.selected]
 * @returns {Object} New AgentContext
 */
export const updateSeatsContext = (context = {}, update = {}) => {
  const nextCtx = createAgentContext(context);

  if (update.available !== undefined) {
    nextCtx.seats.available = Array.isArray(update.available) ? deepClone(update.available) : [];
  }
  if (update.selected !== undefined) {
    nextCtx.seats.selected = Array.isArray(update.selected) ? deepClone(update.selected) : [];
  }

  return nextCtx;
};

/**
 * Updates conversation metadata (lastIntent, lastUserMessage).
 * Returns a new context object.
 *
 * @param {Object} context
 * @param {Object} update
 * @param {string} [update.intent]
 * @param {string} [update.message]
 * @returns {Object} New AgentContext
 */
export const updateConversation = (context = {}, update = {}) => {
  const nextCtx = createAgentContext(context);

  if (update.intent !== undefined) {
    nextCtx.conversation.lastIntent = update.intent || null;
  }
  if (update.message !== undefined) {
    nextCtx.conversation.lastUserMessage = update.message || null;
  }

  return nextCtx;
};

/**
 * Resets the travel request while keeping conversation and execution state clean.
 * Used when a completely new search is initiated.
 *
 * @param {Object} context
 * @returns {Object} New AgentContext with reset travelRequest and search
 */
export const resetTravelContext = (context = {}) => {
  const nextCtx = createAgentContext(context);
  nextCtx.travelRequest = {
    source: null,
    destination: null,
    date: null,
    departure_after: null,
    departure_before: null,
    arrival_before: null,
    max_price: null,
    min_price: null,
    bus_type: null,
    passengers: null,
    seat_preference: null,
    priority: null,
  };
  nextCtx.search = {
    results: [],
    selectedBus: null,
    selectedSlot: null,
  };
  nextCtx.seats = {
    available: [],
    selected: [],
  };
  return nextCtx;
};

// =============================================================================
// STALE SEARCH / ROUTE INVALIDATION CHECK
// =============================================================================

/**
 * Checks whether changes between old and new travel requests invalidate current search results.
 *
 * Route changes (source or destination) always invalidate cached results because
 * buses on Kanpur→Delhi cannot serve Lucknow→Delhi.
 * Date changes also require refreshing results.
 *
 * @param {Object} oldReq - Prior travelRequest
 * @param {Object} newReq - Updated travelRequest
 * @returns {{ routeChanged: boolean, dateChanged: boolean, shouldInvalidate: boolean }}
 */
export const shouldInvalidateSearch = (oldReq = {}, newReq = {}) => {
  const oldSrc = (oldReq.source || '').trim().toLowerCase();
  const newSrc = (newReq.source || '').trim().toLowerCase();
  const oldDst = (oldReq.destination || '').trim().toLowerCase();
  const newDst = (newReq.destination || '').trim().toLowerCase();

  const routeChanged = Boolean(
    (oldSrc && newSrc && oldSrc !== newSrc) ||
    (oldDst && newDst && oldDst !== newDst)
  );

  const oldDate = (oldReq.date || '').trim();
  const newDate = (newReq.date || '').trim();

  const dateChanged = Boolean(oldDate && newDate && oldDate !== newDate);

  const shouldInvalidate = routeChanged || dateChanged;

  return {
    routeChanged,
    dateChanged,
    shouldInvalidate,
  };
};
