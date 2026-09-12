/**
 * GoTicket Context Manager — Test Suite
 *
 * Self-contained test runner.
 * Run with:   node src/services/contextManager.test.js
 *
 * Covers 32+ comprehensive test cases across all dimensions:
 * 1. Basic Merging
 * 2. Follow-Up Requests
 * 3. Corrections
 * 4. Preservation
 * 5. Explicit Clearing
 * 6. Context Integrity & Immutability
 * 7. Stale-Result Handling
 * 8. Conversation Metadata
 */

// =============================================================================
// INLINE IMPLEMENTATION (for standalone zero-dependency Node.js execution)
// Mirrors contextManager.js exactly.
// =============================================================================

function deepClone(val) {
  if (val === null || typeof val !== 'object') return val;
  if (Array.isArray(val)) return val.map(deepClone);
  const copy = {};
  for (const key of Object.keys(val)) {
    copy[key] = deepClone(val[key]);
  }
  return copy;
}

function createAgentContext(initialState = {}) {
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

  if (!initialState || typeof initialState !== 'object') return base;
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
}

function buildNLUContext(context = {}) {
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
}

function detectExplicitClearing(raw = '') {
  if (!raw || typeof raw !== 'string') return [];
  const text = raw.toLowerCase();
  const cleared = [];
  if (/\b(don'?t care about (the )?budget|no budget|any budget|remove budget|without budget|no price limit|clear budget|any price)\b/.test(text)) {
    cleared.push('max_price', 'min_price');
  }
  if (/\b(no seat preference|any seat|clear seat preference|don'?t care about seat)\b/.test(text)) {
    cleared.push('seat_preference');
  }
  if (/\b(any bus|any bus type|no bus type preference|all buses|clear bus type)\b/.test(text)) {
    cleared.push('bus_type');
  }
  if (/\b(no preference|clear preference|reset priority|any option)\b/.test(text)) {
    cleared.push('priority');
  }
  return [...new Set(cleared)];
}

function mergeTravelRequest(context = {}, nluResult = {}, options = {}) {
  const nextCtx = createAgentContext(context);
  const currentReq = nextCtx.travelRequest;
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
      incoming = { ...nluResult };
    }
  }

  const detectedClear = detectExplicitClearing(rawText);
  const explicitClear = Array.isArray(options.cleared) ? options.cleared : [];
  const fieldsToClear = new Set([...detectedClear, ...explicitClear]);
  if (fieldsToClear.has('budget')) {
    fieldsToClear.add('max_price');
    fieldsToClear.add('min_price');
  }

  const travelKeys = [
    'source', 'destination', 'date',
    'departure_after', 'departure_before', 'arrival_before',
    'max_price', 'min_price', 'bus_type',
    'passengers', 'seat_preference', 'priority',
  ];

  for (const key of travelKeys) {
    if (fieldsToClear.has(key)) {
      currentReq[key] = null;
    } else if (incoming[key] !== undefined && incoming[key] !== null) {
      currentReq[key] = deepClone(incoming[key]);
    }
  }

  return nextCtx;
}

function updateSearchContext(context = {}, update = {}) {
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
}

function updateSeatsContext(context = {}, update = {}) {
  const nextCtx = createAgentContext(context);
  if (update.available !== undefined) {
    nextCtx.seats.available = Array.isArray(update.available) ? deepClone(update.available) : [];
  }
  if (update.selected !== undefined) {
    nextCtx.seats.selected = Array.isArray(update.selected) ? deepClone(update.selected) : [];
  }
  return nextCtx;
}

function updateConversation(context = {}, update = {}) {
  const nextCtx = createAgentContext(context);
  if (update.intent !== undefined) {
    nextCtx.conversation.lastIntent = update.intent || null;
  }
  if (update.message !== undefined) {
    nextCtx.conversation.lastUserMessage = update.message || null;
  }
  return nextCtx;
}

function resetTravelContext(context = {}) {
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
}

function shouldInvalidateSearch(oldReq = {}, newReq = {}) {
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
  return { routeChanged, dateChanged, shouldInvalidate };
}

// =============================================================================
// TEST HARNESS
// =============================================================================

let passed = 0;
let failed = 0;
let total = 0;
const failures = [];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function runTest(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`✅ PASS  [${total.toString().padStart(2, '0')}] ${name}`);
  } catch (err) {
    failed++;
    failures.push({ num: total, name, error: err.message });
    console.log(`❌ FAIL  [${total.toString().padStart(2, '0')}] ${name}`);
    console.log(`         ⚠ ${err.message}`);
  }
}

console.log('\n══════════════════════════════════════════════════════════════');
console.log('  GoTicket Context Manager — Test Suite');
console.log('══════════════════════════════════════════════════════════════\n');

// ── 1. Basic Merging ────────────────────────────────────────────────────────
console.log('── 1. Basic Merging ──────────────────────────────────────────');

runTest('1. Empty context + complete request', () => {
  const ctx = createAgentContext();
  const nlu = {
    entities: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-15', passengers: 2 },
    constraints: { departure_after: '21:00', max_price: 1500, bus_type: 'AC', priority: 'price' }
  };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.source === 'Kanpur', 'Source should be Kanpur');
  assert(updated.travelRequest.destination === 'Delhi', 'Destination should be Delhi');
  assert(updated.travelRequest.date === '2026-09-15', 'Date should be 2026-09-15');
  assert(updated.travelRequest.passengers === 2, 'Passengers should be 2');
  assert(updated.travelRequest.departure_after === '21:00', 'departure_after should be 21:00');
  assert(updated.travelRequest.max_price === 1500, 'max_price should be 1500');
  assert(updated.travelRequest.bus_type === 'AC', 'bus_type should be AC');
  assert(updated.travelRequest.priority === 'price', 'priority should be price');
});

runTest('2. Existing route + new date', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' }
  });
  const nlu = { entities: { source: null, destination: null, date: '2026-09-15' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.source === 'Kanpur', 'Source preserved');
  assert(updated.travelRequest.destination === 'Delhi', 'Destination preserved');
  assert(updated.travelRequest.date === '2026-09-15', 'Date updated');
});

runTest('3. Existing date + new budget', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' }
  });
  const nlu = { constraints: { max_price: 1200 } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.source === 'Kanpur', 'Source preserved');
  assert(updated.travelRequest.date === '2026-09-13', 'Date preserved');
  assert(updated.travelRequest.max_price === 1200, 'Budget updated to 1200');
});

runTest('4. Existing bus type + new priority', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', bus_type: 'AC' }
  });
  const nlu = { constraints: { priority: 'time' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.bus_type === 'AC', 'bus_type preserved');
  assert(updated.travelRequest.priority === 'time', 'priority updated to time');
});

// ── 2. Follow-Up Requests ───────────────────────────────────────────────────
console.log('\n── 2. Follow-Up Requests ─────────────────────────────────────');

runTest('5. Follow-up: "Show cheaper ones" sets priority: price', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' }
  });
  const nlu = { constraints: { priority: 'price' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.source === 'Kanpur', 'Source preserved');
  assert(updated.travelRequest.priority === 'price', 'Priority set to price');
});

runTest('6. Follow-up: "Show faster ones" sets priority: time', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13', priority: 'price' }
  });
  const nlu = { constraints: { priority: 'time' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.source === 'Kanpur', 'Source preserved');
  assert(updated.travelRequest.priority === 'time', 'Priority switched to time');
});

runTest('7. Follow-up: "Only AC" adds bus_type constraint', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' }
  });
  const nlu = { constraints: { bus_type: 'AC' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.bus_type === 'AC', 'bus_type set to AC');
  assert(updated.travelRequest.source === 'Kanpur', 'Source preserved');
});

runTest('8. Follow-up: "Only sleeper" updates bus_type', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', bus_type: 'AC' }
  });
  const nlu = { constraints: { bus_type: 'Sleeper' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.bus_type === 'Sleeper', 'bus_type updated to Sleeper');
});

runTest('9. Follow-up: "What about Monday?" updates date only', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13', bus_type: 'AC' }
  });
  const nlu = { entities: { date: '2026-09-15' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.date === '2026-09-15', 'date updated to Monday');
  assert(updated.travelRequest.source === 'Kanpur', 'source preserved');
  assert(updated.travelRequest.bus_type === 'AC', 'bus_type preserved');
});

runTest('10. Follow-up: "Show something under 1500" adds max_price', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' }
  });
  const nlu = { constraints: { max_price: 1500 } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.max_price === 1500, 'max_price added');
  assert(updated.travelRequest.source === 'Kanpur', 'source preserved');
});

// ── 3. Corrections ─────────────────────────────────────────────────────────
console.log('\n── 3. Corrections ───────────────────────────────────────────');

runTest('11. Correction: Kanpur → Delhi then Lucknow → Delhi', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' }
  });
  const nlu = { entities: { source: 'Lucknow', destination: 'Delhi' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.source === 'Lucknow', 'Source corrected to Lucknow');
  assert(updated.travelRequest.destination === 'Delhi', 'Destination preserved as Delhi');
  assert(updated.travelRequest.date === '2026-09-13', 'Date preserved');
});

runTest('12. Correction: Budget 1500 then 2000', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', max_price: 1500 }
  });
  const nlu = { constraints: { max_price: 2000 } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.max_price === 2000, 'max_price replaced by 2000');
});

runTest('13. Correction: AC then Non-AC', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', bus_type: 'AC' }
  });
  const nlu = { constraints: { bus_type: 'Non-AC' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.bus_type === 'Non-AC', 'bus_type updated to Non-AC');
});

runTest('14. Correction: Tomorrow then Monday date', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' }
  });
  const nlu = { entities: { date: '2026-09-15' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.date === '2026-09-15', 'date replaced with Monday');
});

// ── 4. Preservation ────────────────────────────────────────────────────────
console.log('\n── 4. Preservation ──────────────────────────────────────────');

runTest('15. Missing source must remain missing (null)', () => {
  const ctx = createAgentContext();
  const nlu = { entities: { destination: 'Delhi' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.source === null, 'source must remain null');
  assert(updated.travelRequest.destination === 'Delhi', 'destination set');
});

runTest('16. Missing destination must remain missing (null)', () => {
  const ctx = createAgentContext();
  const nlu = { entities: { source: 'Kanpur' } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.destination === null, 'destination must remain null');
  assert(updated.travelRequest.source === 'Kanpur', 'source set');
});

runTest('17. Existing route preserved during price filter', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' }
  });
  const nlu = { entities: { source: null, destination: null }, constraints: { max_price: 1000 } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.source === 'Kanpur', 'Source not overwritten by null');
  assert(updated.travelRequest.destination === 'Delhi', 'Destination not overwritten by null');
  assert(updated.travelRequest.max_price === 1000, 'max_price added');
});

runTest('18. Existing date preserved during seat request', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' }
  });
  const nlu = { constraints: { seat_preference: { type: 'window', count: null } } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.date === '2026-09-13', 'Date preserved');
  assert(updated.travelRequest.seat_preference.type === 'window', 'seat_preference saved');
});

runTest('19. Existing bus selection preserved when appropriate', () => {
  const bus = { id: 'BUS1', busName: 'GoRide Express' };
  const ctx = createAgentContext({
    search: { selectedBus: bus }
  });
  const nlu = { constraints: { seat_preference: { type: 'aisle', count: null } } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.search.selectedBus.id === 'BUS1', 'selectedBus preserved');
});

// ── 5. Explicit Clearing ───────────────────────────────────────────────────
console.log('\n── 5. Explicit Clearing ─────────────────────────────────────');

runTest('20. Remove budget via detected phrase "don\'t care about the budget anymore"', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', max_price: 1500 }
  });
  const nlu = { raw: "i don't care about the budget anymore" };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.max_price === null, 'max_price cleared');
  assert(updated.travelRequest.source === 'Kanpur', 'source preserved');
});

runTest('21. Clear preference via detected phrase "no preference"', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', priority: 'price' }
  });
  const nlu = { raw: 'no preference' };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(updated.travelRequest.priority === null, 'priority cleared');
  assert(updated.travelRequest.source === 'Kanpur', 'source preserved');
});

runTest('22. Clear optional constraint via options.cleared', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', bus_type: 'AC' }
  });
  const updated = mergeTravelRequest(ctx, {}, { cleared: ['bus_type'] });
  assert(updated.travelRequest.bus_type === null, 'bus_type cleared via options');
  assert(updated.travelRequest.source === 'Kanpur', 'source preserved');
});

// ── 6. Context Integrity & Immutability ────────────────────────────────────
console.log('\n── 6. Context Integrity & Immutability ──────────────────────');

runTest('23. Original context not mutated by merge', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', max_price: 1000 }
  });
  const nlu = { constraints: { max_price: 2000 } };
  const updated = mergeTravelRequest(ctx, nlu);
  assert(ctx.travelRequest.max_price === 1000, 'Original ctx.max_price unchanged');
  assert(updated.travelRequest.max_price === 2000, 'Updated ctx.max_price is 2000');
});

runTest('24. Nested state not accidentally mutated', () => {
  const initialPref = { type: 'window', count: 1 };
  const ctx = createAgentContext({
    travelRequest: { seat_preference: initialPref }
  });
  const updated = mergeTravelRequest(ctx, {
    constraints: { seat_preference: { type: 'aisle', count: 2 } }
  });
  assert(initialPref.type === 'window', 'Initial nested preference object untouched');
  assert(updated.travelRequest.seat_preference.type === 'aisle', 'Updated nested preference changed');
});

runTest('25. Search results preserved across updates', () => {
  const ctx = createAgentContext({
    search: { results: [{ id: 'B1' }, { id: 'B2' }] }
  });
  const updated = mergeTravelRequest(ctx, { constraints: { bus_type: 'AC' } });
  assert(updated.search.results.length === 2, 'Search results preserved');
});

runTest('26. Selected bus preserved in search update', () => {
  const ctx = createAgentContext();
  const updated = updateSearchContext(ctx, {
    selectedBus: { id: 'BUS10' }
  });
  assert(updated.search.selectedBus.id === 'BUS10', 'selectedBus updated');
  assert(ctx.search.selectedBus === null, 'original context unmutated');
});

runTest('27. Selected seats preserved in seats update', () => {
  const ctx = createAgentContext();
  const updated = updateSeatsContext(ctx, {
    selected: ['S3', 'S4'],
    available: ['S1', 'S2', 'S5']
  });
  assert(updated.seats.selected.length === 2, 'Selected seats updated');
  assert(ctx.seats.selected.length === 0, 'Original seats unmutated');
});

// ── 7. Stale-Result Handling ───────────────────────────────────────────────
console.log('\n── 7. Stale-Result Handling ─────────────────────────────────');

runTest('28. Route change invalidates stale search context', () => {
  const oldReq = { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' };
  const newReq = { source: 'Lucknow', destination: 'Delhi', date: '2026-09-13' };
  const result = shouldInvalidateSearch(oldReq, newReq);
  assert(result.routeChanged === true, 'Route marked changed');
  assert(result.shouldInvalidate === true, 'Search marked shouldInvalidate');
});

runTest('29. Date change invalidates stale search context', () => {
  const oldReq = { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' };
  const newReq = { source: 'Kanpur', destination: 'Delhi', date: '2026-09-15' };
  const result = shouldInvalidateSearch(oldReq, newReq);
  assert(result.routeChanged === false, 'Route unchanged');
  assert(result.dateChanged === true, 'Date marked changed');
  assert(result.shouldInvalidate === true, 'Search marked shouldInvalidate');
});

runTest('30. Same route and date preserves valid search results', () => {
  const oldReq = { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' };
  const newReq = { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' };
  const result = shouldInvalidateSearch(oldReq, newReq);
  assert(result.routeChanged === false, 'Route not changed');
  assert(result.dateChanged === false, 'Date not changed');
  assert(result.shouldInvalidate === false, 'Search should NOT be invalidated');
});

// ── 8. Conversation Metadata & Reset ───────────────────────────────────────
console.log('\n── 8. Conversation Metadata & Reset ─────────────────────────');

runTest('31. lastIntent updated', () => {
  const ctx = createAgentContext();
  const updated = updateConversation(ctx, { intent: 'FILTER_RESULTS' });
  assert(updated.conversation.lastIntent === 'FILTER_RESULTS', 'lastIntent updated');
  assert(ctx.conversation.lastIntent === null, 'original untouched');
});

runTest('32. lastUserMessage updated', () => {
  const ctx = createAgentContext();
  const updated = updateConversation(ctx, { message: 'Show me cheaper ones' });
  assert(updated.conversation.lastUserMessage === 'Show me cheaper ones', 'lastUserMessage updated');
});

runTest('33. resetTravelContext cleans travelRequest and search, preserves conversation', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', date: '2026-09-13' },
    conversation: { lastIntent: 'SEARCH_BUS', lastUserMessage: 'Hi' },
    search: { results: [{ id: 'B1' }] }
  });
  const reset = resetTravelContext(ctx);
  assert(reset.travelRequest.source === null, 'source reset to null');
  assert(reset.search.results.length === 0, 'search results reset');
  assert(reset.conversation.lastIntent === 'SEARCH_BUS', 'conversation history kept');
});

runTest('34. buildNLUContext constructs accurate read-only snapshot', () => {
  const ctx = createAgentContext({
    travelRequest: { source: 'Kanpur', destination: 'Delhi', max_price: 1500, departure_after: '21:00' },
    search: { selectedBus: { id: 'B1' } }
  });
  const nluCtx = buildNLUContext(ctx);
  assert(nluCtx.source === 'Kanpur', 'NLU context source matches');
  assert(nluCtx.destination === 'Delhi', 'NLU context destination matches');
  assert(nluCtx.preferredTime === '21:00', 'preferredTime maps to departure_after');
  assert(nluCtx.constraints.max_price === 1500, 'constraints.max_price matches');
  assert(nluCtx.selectedBus.id === 'B1', 'selectedBus matches');
});

// =============================================================================
// SUMMARY
// =============================================================================

console.log('\n══════════════════════════════════════════════════════════════');
console.log(`  Results: ${passed} PASSED / ${failed} FAILED / ${total} TOTAL`);
if (failures.length > 0) {
  console.log('\n  Failed Tests:');
  failures.forEach(f => {
    console.log(`    [${f.num}] ${f.name}`);
    console.log(`         ✗ ${f.error}`);
  });
}
console.log('══════════════════════════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('  All Context Manager tests passed! ✅\n');
}
