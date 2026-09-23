/**
 * GoTicket Conversational Workflow Integration Test Suite
 *
 * Verifies all 12 conversational bus-booking scenarios specified in Section 17:
 *  TEST 1: "I want to travel from Kanpur to Lucknow." -> Ask date and passenger count.
 *  TEST 2: "I want to travel from Kanpur to Lucknow tomorrow." -> Ask passenger count.
 *  TEST 3: "I want 2 passengers from Kanpur to Lucknow tomorrow." -> Search buses immediately.
 *  TEST 4: "I want 2 sleeper seats from Kanpur to Lucknow tomorrow under 700." -> Search sleeper buses under 700.
 *  TEST 5: 2 passengers -> select 1 seat -> Remain in seat selection, show 1/2 seats selected.
 *  TEST 6: 2 passengers -> select 2 seats -> Proceed to passenger details.
 *  TEST 7: 2 passengers -> attempt 3 seats -> Reject 3rd seat, remain in seat selection.
 *  TEST 8: User confirms booking -> Proceed to /payment (PAYMENT_PENDING), do not auto-pay.
 *  TEST 9: User has not paid -> Booking not confirmed.
 *  TEST 10: Payment succeeds -> Confirmed and E-ticket available.
 *  TEST 11: Route/date changed -> Invalidate previous search and restart.
 *  TEST 12: "I want 2 seats under 700." -> Extract passengers=2, budget=700, ask missing route & date.
 *
 * Run with: node src/services/conversationalWorkflow.test.js
 */

// =============================================================================
// 1. GLOBAL LOCALSTORAGE POLYFILL FOR NODE.JS (Initialized before any imports)
// =============================================================================
const _storage = {};
global.localStorage = {
  getItem: (k) => (_storage[k] !== undefined ? _storage[k] : null),
  setItem: (k, v) => { _storage[k] = String(v); },
  removeItem: (k) => { delete _storage[k]; },
  clear: () => { Object.keys(_storage).forEach((k) => delete _storage[k]); }
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32mPASS\x1b[0m [${String(totalTests).padStart(2, '0')}] ${message}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31mFAIL\x1b[0m [${String(totalTests).padStart(2, '0')}] ${message}`);
  }
}

async function runAllWorkflowTests() {
  // Dynamically import after localStorage polyfill is in place
  const { processAgentMessage } = await import('./travelAgent.js');

  console.log('\n' + '═'.repeat(68));
  console.log('  GoTicket Conversational Workflow — 12 Critical Integration Tests');
  console.log('═'.repeat(68) + '\n');

  // ---------------------------------------------------------------------------
  // TEST 1: "I want to travel from Kanpur to Lucknow."
  // Route only -> Ask date and passenger count
  // ---------------------------------------------------------------------------
  console.log('── TEST 1: Missing Date & Passengers ───────────────────────────────');
  {
    global.localStorage.clear();
    const res = await processAgentMessage('I want to travel from Kanpur to Lucknow.');
    
    assert(
      res.agentState.state === 'COLLECTING_INFORMATION',
      'TEST 1: State is COLLECTING_INFORMATION'
    );
    assert(
      res.agentState.params.source === 'Kanpur' && res.agentState.params.destination === 'Lucknow',
      'TEST 1: Source (Kanpur) and Destination (Lucknow) correctly captured'
    );
    assert(
      !res.agentState.params.date,
      'TEST 1: Date is null/missing'
    );
    assert(
      !res.agentState.params.passengers,
      'TEST 1: Passengers count is null/missing'
    );
    const lowerText = res.text.toLowerCase();
    assert(
      lowerText.includes('date') && (lowerText.includes('passenger') || lowerText.includes('how many')),
      'TEST 1: Agent asks specifically for missing date and passenger count'
    );
    assert(
      !res.searchResults || res.searchResults.length === 0,
      'TEST 1: Buses are NOT searched before mandatory parameters are collected'
    );
  }

  // ---------------------------------------------------------------------------
  // TEST 2: "I want to travel from Kanpur to Lucknow tomorrow."
  // Route + Date -> Ask passenger count
  // ---------------------------------------------------------------------------
  console.log('\n── TEST 2: Missing Passengers Only ─────────────────────────────────');
  {
    global.localStorage.clear();
    const res = await processAgentMessage('I want to travel from Kanpur to Lucknow tomorrow.');

    assert(
      res.agentState.state === 'COLLECTING_INFORMATION',
      'TEST 2: State is COLLECTING_INFORMATION'
    );
    assert(
      Boolean(res.agentState.params.date),
      'TEST 2: Date is captured'
    );
    assert(
      !res.agentState.params.passengers,
      'TEST 2: Passengers is null/missing'
    );
    const lowerText = res.text.toLowerCase();
    assert(
      lowerText.includes('passenger') || lowerText.includes('how many'),
      'TEST 2: Agent prompts specifically for passenger count'
    );
    assert(
      !lowerText.includes('where would you like to travel') && !lowerText.includes('tell me your travel date'),
      'TEST 2: Agent does NOT re-ask for route or date'
    );
  }

  // ---------------------------------------------------------------------------
  // TEST 3: "I want 2 passengers from Kanpur to Lucknow tomorrow."
  // All 4 mandatory parameters -> Search immediately
  // ---------------------------------------------------------------------------
  console.log('\n── TEST 3: All 4 Mandatory Parameters Present ───────────────────────');
  {
    global.localStorage.clear();
    const res = await processAgentMessage('I want 2 passengers from Kanpur to Lucknow tomorrow.');

    assert(
      res.agentState.params.source === 'Kanpur' && res.agentState.params.destination === 'Lucknow',
      'TEST 3: Route Kanpur -> Lucknow extracted'
    );
    assert(
      res.agentState.params.passengers === 2,
      'TEST 3: Passengers extracted as 2'
    );
    assert(
      Boolean(res.agentState.params.date),
      'TEST 3: Date extracted'
    );
    assert(
      res.agentState.state === 'WAITING_FOR_BUS_SELECTION',
      'TEST 3: Agent automatically executes search -> WAITING_FOR_BUS_SELECTION'
    );
    assert(
      res.searchResults && res.searchResults.length > 0,
      `TEST 3: Bus results found (${res.searchResults?.length || 0} buses returned)`
    );
  }

  // ---------------------------------------------------------------------------
  // TEST 4: "I want 2 sleeper seats from Kanpur to Lucknow tomorrow under 700."
  // All mandatory + filters (busType=Sleeper, budget=700)
  // ---------------------------------------------------------------------------
  console.log('\n── TEST 4: Mandatory + Optional Filters (Sleeper Under 700) ────────');
  {
    global.localStorage.clear();
    const res = await processAgentMessage('I want 2 sleeper seats from Kanpur to Lucknow tomorrow under 700.');

    assert(
      res.agentState.params.passengers === 2,
      'TEST 4: Passengers count = 2'
    );
    const busTypeVal = res.agentState.params.bus_type || res.agentState.params.busType;
    assert(
      busTypeVal === 'Sleeper',
      'TEST 4: Bus type filter = Sleeper'
    );
    const budgetVal = res.agentState.params.max_price || res.agentState.params.budget;
    assert(
      budgetVal === 700,
      'TEST 4: Budget filter = 700'
    );
    assert(
      res.searchResults && res.searchResults.length > 0,
      'TEST 4: Buses returned matching route'
    );
    const matchingBus = res.searchResults.find(b => b.price <= 700 && /sleeper/i.test(b.busType));
    assert(
      Boolean(matchingBus),
      `TEST 4: Found matching sleeper bus under ₹700 (${matchingBus?.busName}, ₹${matchingBus?.price})`
    );
    assert(
      res.agentState.params.recommendation?.bestBus?.id === matchingBus.id,
      'TEST 4: Best bus recommended matches sleeper and budget criteria'
    );
  }

  // ---------------------------------------------------------------------------
  // TEST 5, 6, 7: Seat Selection Count Ratio Enforcement
  // 2 passengers -> select 1 seat (reject advance, show 1/2)
  // 2 passengers -> select 3 seats (reject 3rd seat)
  // 2 passengers -> select 2 seats (advance to passenger details)
  // ---------------------------------------------------------------------------
  console.log('\n── TEST 5, 6, 7: Passenger-to-Seat Ratio Enforcement ───────────────');
  {
    global.localStorage.clear();
    // Step A: Search for 2 passengers
    let step = await processAgentMessage('Find buses from Kanpur to Lucknow tomorrow for 2 passengers');
    assert(step.searchResults && step.searchResults.length > 0, 'Setup: Buses found for 2 passengers');

    // Step B: Select Bus 1
    step = await processAgentMessage('Select bus 1', step.agentState);
    assert(
      step.agentState.state === 'WAITING_FOR_SEAT_SELECTION',
      'Setup: In WAITING_FOR_SEAT_SELECTION after bus choice'
    );

    // TEST 5: User selects 1 seat (S1) when 2 are required
    const test5Res = await processAgentMessage('Select S1', step.agentState);
    assert(
      test5Res.agentState.state === 'WAITING_FOR_SEAT_SELECTION',
      'TEST 5: State remains in WAITING_FOR_SEAT_SELECTION when 1/2 seats selected'
    );
    assert(
      test5Res.agentState.params.selectedSeats?.length === 1 && test5Res.agentState.params.selectedSeats[0] === 'S1',
      'TEST 5: Seat S1 is held in pending selection'
    );
    assert(
      test5Res.text.includes('1/2') || test5Res.text.includes('1 more seat'),
      'TEST 5: Text indicates 1/2 seats selected and asks for 1 more seat'
    );
    assert(
      test5Res.seatMap && test5Res.seatMap.passengers === 2,
      'TEST 5: seatMap payload carries passengers = 2 for UI button/counter'
    );

    // TEST 7: User attempts to select 3 seats (S1, S3, S4) when 2 are required
    const test7Res = await processAgentMessage('Select S1, S3 and S4', step.agentState);
    assert(
      test7Res.agentState.state === 'WAITING_FOR_SEAT_SELECTION',
      'TEST 7: State remains in WAITING_FOR_SEAT_SELECTION when > 2 seats attempted'
    );
    assert(
      test7Res.text.includes('Limit') || test7Res.text.includes('exceeds') || test7Res.text.includes('exactly 2 seat'),
      'TEST 7: Agent rejects 3 seats with seat limit warning'
    );

    // TEST 6: User selects exactly 2 seats (S1 and S3)
    const test6Res = await processAgentMessage('Select S1 and S3', step.agentState);
    assert(
      test6Res.agentState.state === 'COLLECTING_PASSENGER_INFO',
      'TEST 6: State advances to COLLECTING_PASSENGER_INFO when exactly 2 seats are selected'
    );
    assert(
      test6Res.agentState.params.selectedSeats?.length === 2,
      'TEST 6: Exactly 2 seats (S1, S3) are validated and held'
    );
    assert(
      test6Res.text.toLowerCase().includes('name') || test6Res.text.toLowerCase().includes('passenger'),
      'TEST 6: Agent asks for passenger details'
    );
  }

  // ---------------------------------------------------------------------------
  // TEST 8 & 9: Manual Payment Boundary & Confirmation Gate
  // Casual affirmations do not confirm -> Explicit action confirms -> PAYMENT_PENDING
  // ---------------------------------------------------------------------------
  console.log('\n── TEST 8 & 9: Manual Payment Boundary & Confirmation Gate ──────────');
  {
    global.localStorage.clear();
    const mockUser = {
      name: 'Amit Sharma',
      email: 'amit.sharma@example.com',
      mobile: '9876543210'
    };
    global.localStorage.setItem('currentUser', JSON.stringify(mockUser));

    // Start fresh flow with 1 passenger
    let step = await processAgentMessage('Find buses from Kanpur to Lucknow tomorrow for 1 passenger', {}, { user: mockUser });
    step = await processAgentMessage('Select bus 1', step.agentState, { user: mockUser });
    step = await processAgentMessage('Select S1', step.agentState, { user: mockUser });

    // Enter passenger name
    step = await processAgentMessage('Amit Sharma', step.agentState, { user: mockUser });
    // Enter email
    step = await processAgentMessage('amit.sharma@example.com', step.agentState, { user: mockUser });
    // Enter phone
    step = await processAgentMessage('9876543210', step.agentState, { user: mockUser });

    assert(
      step.agentState.state === 'BOOKING_SUMMARY',
      'Setup: State reached BOOKING_SUMMARY with complete summary'
    );

    // Casual affirmation check: "okay", "sure", "fine" must NOT finalize booking
    const casualRes = await processAgentMessage('okay', step.agentState, { user: mockUser });
    assert(
      casualRes.agentState.state === 'BOOKING_SUMMARY',
      'Gate: Casual "okay" does NOT finalize booking'
    );

    // TEST 8: Explicit Confirmation -> Must navigate to /payment, state = PAYMENT_PENDING
    const confirmRes = await processAgentMessage('Confirm Booking', step.agentState, { user: mockUser });
    assert(
      confirmRes.agentState.state === 'PAYMENT_PENDING',
      'TEST 8: State is PAYMENT_PENDING (payment is manual)'
    );
    assert(
      Boolean(confirmRes.actionCard && confirmRes.actionCard.navigateTo === '/payment'),
      'TEST 8: ActionCard routes to /payment'
    );
    assert(
      Boolean(global.localStorage.getItem('pendingBooking')),
      'TEST 8: pendingBooking record is persisted to localStorage for PaymentPage'
    );
    assert(
      !global.localStorage.getItem('lastTicket'),
      'TEST 8: lastTicket is NOT created prior to user payment'
    );

    // TEST 9: User has not paid yet -> booking is NOT confirmed
    const unpaidCheck = await processAgentMessage('Is my booking confirmed?', confirmRes.agentState, { user: mockUser });
    assert(
      unpaidCheck.agentState.state === 'PAYMENT_PENDING',
      'TEST 9: State remains PAYMENT_PENDING while unpaid'
    );
    assert(
      !global.localStorage.getItem('lastTicket'),
      'TEST 9: Booking remains unconfirmed until payment simulation completes'
    );
    assert(
      unpaidCheck.text.includes('/payment') || unpaidCheck.text.includes('Payment') || unpaidCheck.text.includes('awaiting payment'),
      'TEST 9: Agent directs user to complete payment'
    );
  }

  // ---------------------------------------------------------------------------
  // TEST 10: Payment Simulation Completion
  // ---------------------------------------------------------------------------
  console.log('\n── TEST 10: Payment Succeeded -> Ticket Confirmed ───────────────────');
  {
    global.localStorage.clear();
    const mockUser = {
      name: 'Amit Sharma',
      email: 'amit.sharma@example.com',
      mobile: '9876543210'
    };
    global.localStorage.setItem('currentUser', JSON.stringify(mockUser));

    let step = await processAgentMessage('Find buses from Kanpur to Lucknow tomorrow for 1 passenger', {}, { user: mockUser });
    step = await processAgentMessage('Select bus 1', step.agentState, { user: mockUser });
    step = await processAgentMessage('Select S1', step.agentState, { user: mockUser });
    step = await processAgentMessage('Amit Sharma', step.agentState, { user: mockUser });
    step = await processAgentMessage('amit.sharma@example.com', step.agentState, { user: mockUser });
    step = await processAgentMessage('9876543210', step.agentState, { user: mockUser });
    step = await processAgentMessage('Confirm Booking', step.agentState, { user: mockUser });

    // Simulate successful payment done on /payment page:
    const mockTicket = {
      ticketId: 'GT123456',
      busId: 'UP78KL1122',
      busName: 'Awadh Sleeper Liner',
      source: 'Kanpur',
      destination: 'Lucknow',
      date: 'Tomorrow',
      slotTime: '07:30 PM',
      selectedSeats: ['S1'],
      passengerDetails: mockUser,
      totalFare: 450,
      paymentStatus: 'PAID',
      bookedAt: new Date().toISOString()
    };
    global.localStorage.setItem('lastTicket', JSON.stringify(mockTicket));

    // Agent checks status after payment
    const paidRes = await processAgentMessage('I have completed the payment', step.agentState, { user: mockUser });
    assert(
      paidRes.agentState.state === 'CONFIRMED',
      'TEST 10: State transitions to CONFIRMED after payment verification'
    );
    assert(
      paidRes.text.includes('GT123456') || paidRes.text.includes('confirmed'),
      'TEST 10: Response contains confirmed ticket ID'
    );
    assert(
      Boolean(paidRes.actionCard && (paidRes.actionCard.navigateTo === '/eticket' || paidRes.actionCard.navigateTo === '/e-ticket')),
      'TEST 10: Action card provides link to /eticket'
    );
  }

  // ---------------------------------------------------------------------------
  // TEST 11: Route / Date Search Invalidation
  // ---------------------------------------------------------------------------
  console.log('\n── TEST 11: Route / Date Search Invalidation ────────────────────────');
  {
    global.localStorage.clear();
    // User was searching Kanpur -> Lucknow with seats selected
    let step = await processAgentMessage('Find buses from Kanpur to Lucknow tomorrow for 2 passengers');
    step = await processAgentMessage('Select bus 1', step.agentState);
    step = await processAgentMessage('Select S1 and S3', step.agentState);

    assert(
      step.agentState.params.selectedSeats?.length === 2,
      'Setup: S1 and S3 selected for Kanpur -> Lucknow'
    );

    // User changes route: "Actually I want to travel from Kanpur to Delhi tomorrow"
    const changeRes = await processAgentMessage('Actually I want to travel from Kanpur to Delhi tomorrow', step.agentState);

    assert(
      changeRes.agentState.params.destination === 'Delhi',
      'TEST 11: New destination updated to Delhi'
    );
    assert(
      !changeRes.agentState.params.selectedSeats || changeRes.agentState.params.selectedSeats.length === 0,
      'TEST 11: Previous selected seats are invalidated and cleared'
    );
    assert(
      changeRes.agentState.selectedBus?.destination === 'Delhi',
      'TEST 11: Previous selected bus for Lucknow is replaced by new Delhi bus'
    );
    assert(
      changeRes.agentState.state === 'WAITING_FOR_BUS_SELECTION',
      'TEST 11: Agent restarts search for new route -> WAITING_FOR_BUS_SELECTION'
    );
  }

  // ---------------------------------------------------------------------------
  // TEST 12: "I want 2 seats under 700."
  // Passengers=2, budget=700 -> Ask missing route and date without re-asking passengers
  // ---------------------------------------------------------------------------
  console.log('\n── TEST 12: Partial Goal Query ("2 seats under 700") ─────────────────');
  {
    global.localStorage.clear();
    const res = await processAgentMessage('I want 2 seats under 700.');

    assert(
      res.agentState.params.passengers === 2,
      'TEST 12: Extracted passengers = 2'
    );
    const budgetVal = res.agentState.params.max_price || res.agentState.params.budget;
    assert(
      budgetVal === 700,
      'TEST 12: Extracted budget = 700'
    );
    assert(
      !res.agentState.params.source || !res.agentState.params.destination,
      'TEST 12: Route is missing'
    );
    assert(
      !res.agentState.params.date,
      'TEST 12: Date is missing'
    );
    assert(
      res.agentState.state === 'COLLECTING_INFORMATION',
      'TEST 12: State is COLLECTING_INFORMATION'
    );
    const lowerText = res.text.toLowerCase();
    assert(
      (lowerText.includes('where') || lowerText.includes('route') || lowerText.includes('travel')) &&
      !lowerText.includes('how many passenger'),
      'TEST 12: Asks for missing route/date and does NOT re-ask for passenger count'
    );
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n' + '═'.repeat(68));
  console.log(`  Results: ${passedTests} PASSED / ${failedTests} FAILED / ${totalTests} TOTAL`);
  console.log('═'.repeat(68) + '\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllWorkflowTests().catch((err) => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
