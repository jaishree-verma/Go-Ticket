// GoTicket Travel Agent Orchestrator
// Master AI Travel Agent ("Tixie") — Multi-turn NLU, State Machine, Atomic Seat Validation & Confirmation Gate

import { search_buses, get_bus_details, check_seat_availability, hold_select_seats, prepare_booking } from './agentTools.js';
import { rankBuses } from './recommendationEngine.js';
import { getPendingBooking, clearPendingBooking, getLastTicket } from './bookingService.js';

// Known cities for NLU parsing
const CITIES = [
  'Kanpur', 'Delhi', 'Lucknow', 'Agra', 'Jaipur', 'Mumbai',
  'Pune', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Kolkata', 'Dehradun', 'Chandigarh', 'Ahmedabad', 'Surat',
  'Varanasi', 'Goa', 'Bhopal', 'Indore', 'Patna', 'Ranchi'
];

/**
 * Normalizes city name matching
 */
const matchCity = (text) => {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const c of CITIES) {
    if (lower.includes(c.toLowerCase())) {
      return c === 'Bengaluru' ? 'Bangalore' : c;
    }
  }
  return null;
};

/**
 * Extracts seat IDs (e.g., "S3", "S4", "seat 3", "seats 3 and 4", "s12", "S-5") from natural language text
 * 
 * @param {string} text 
 * @returns {Array<string>} Array of normalized seat labels e.g. ["S3", "S4"]
 */
export const extractSeatIDs = (text = '') => {
  if (!text) return [];
  // Match S1..S40 format e.g. "S3", "S-4", "s12"
  const sMatches = text.match(/\bS[-_\s]?\d{1,2}\b/gi) || [];
  const normalizedS = sMatches.map((s) => s.replace(/[-_\s]/g, '').toUpperCase());

  // Match "seat 3", "seats 3 and 4", "seat 3, 4", "seat3"
  const seatWordMatches = text.match(/\bseats?\s*(\d{1,2}(?:\s*(?:and|,|&)\s*\d{1,2})*)\b/gi) || [];
  const fromSeatWords = [];
  seatWordMatches.forEach((m) => {
    const nums = m.match(/\d{1,2}/g) || [];
    nums.forEach((n) => {
      const num = parseInt(n, 10);
      if (num >= 1 && num <= 40) {
        fromSeatWords.push(`S${num}`);
      }
    });
  });

  return [...new Set([...normalizedS, ...fromSeatWords])];
};

/**
 * Extracts travel parameters from natural language text.
 */
export const extractTravelParams = (text = '') => {
  const q = text.toLowerCase();
  let source = null;
  let destination = null;
  let date = null;
  let preferredTime = null;
  let isArrivalConstraint = false;

  // 1. Source and Destination Extraction
  const fromToMatch = q.match(/from\s+([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\s+|$|\b(tomorrow|today|on|at|around|before|after)\b)/i);
  if (fromToMatch) {
    source = matchCity(fromToMatch[1]);
    destination = matchCity(fromToMatch[2]);
  } else {
    const toMatch = q.match(/([a-z]+)\s*(?:to|->|→|-)\s*([a-z]+)/i);
    if (toMatch) {
      source = matchCity(toMatch[1]);
      destination = matchCity(toMatch[2]);
    } else {
      const toOnlyMatch = q.match(/to\s+([a-z]+)/i);
      if (toOnlyMatch) {
        destination = matchCity(toOnlyMatch[1]);
      }
      const fromOnlyMatch = q.match(/from\s+([a-z]+)/i);
      if (fromOnlyMatch) {
        source = matchCity(fromOnlyMatch[1]);
      }
    }
  }

  // 2. Date Extraction
  const today = new Date();

  if (q.includes('day after tomorrow')) {
    const d = new Date(today);
    d.setDate(d.getDate() + 2);
    date = d.toISOString().split('T')[0];
  } else if (q.includes('tomorrow')) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    date = d.toISOString().split('T')[0];
  } else if (q.includes('today')) {
    date = today.toISOString().split('T')[0];
  } else {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < days.length; i++) {
      if (q.includes(days[i])) {
        const d = new Date(today);
        const currentDay = d.getDay();
        let targetDay = i;
        let diff = targetDay - currentDay;
        if (diff <= 0) diff += 7;
        d.setDate(d.getDate() + diff);
        date = d.toISOString().split('T')[0];
        break;
      }
    }
  }

  // 3. Time & Constraint Extraction
  if (q.includes('before') || q.includes('reach by') || q.includes('arrive by')) {
    isArrivalConstraint = true;
  }

  const timeMatch = q.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (timeMatch && (q.includes('at') || q.includes('around') || q.includes('pm') || q.includes('am'))) {
    preferredTime = timeMatch[1].toUpperCase();
  } else if (q.includes('morning')) {
    preferredTime = '08:00 AM';
  } else if (q.includes('afternoon')) {
    preferredTime = '02:00 PM';
  } else if (q.includes('evening')) {
    preferredTime = '07:00 PM';
  } else if (q.includes('night')) {
    preferredTime = '09:00 PM';
  }

  return {
    source,
    destination,
    date,
    preferredTime,
    isArrivalConstraint
  };
};

/**
 * Helper to match user bus selection intent against active search results
 */
const findSelectedBusFromQuery = (queryText, searchResults = [], recommendation = null) => {
  if (!searchResults || searchResults.length === 0) return null;
  const q = queryText.toLowerCase();

  // 1. "Recommended" / "Best" / "That one" / "Suggested"
  if (q.includes('recommend') || q.includes('best') || q.includes('that one') || q.includes('suggested')) {
    return recommendation?.bestBus || searchResults[0];
  }

  // 2. "First one" / "1st" / "option 1" / "bus 1"
  if (q.includes('first') || q.includes('1st') || q.includes('option 1') || q.includes('bus 1')) {
    return searchResults[0];
  }

  // 3. "Second one" / "2nd" / "option 2" / "bus 2"
  if (q.includes('second') || q.includes('2nd') || q.includes('option 2') || q.includes('bus 2')) {
    return searchResults[1] || searchResults[0];
  }

  // 4. "Third one" / "3rd" / "option 3" / "bus 3"
  if (q.includes('third') || q.includes('3rd') || q.includes('option 3') || q.includes('bus 3')) {
    return searchResults[2] || searchResults[searchResults.length - 1];
  }

  // 5. "Fourth one" / "4th" / "option 4" / "bus 4"
  if (q.includes('fourth') || q.includes('4th') || q.includes('option 4') || q.includes('bus 4')) {
    return searchResults[3] || searchResults[searchResults.length - 1];
  }

  // 6. "Cheapest" / "lowest fare"
  if (q.includes('cheap') || q.includes('lowest fare') || q.includes('least price') || q.includes('low price')) {
    return [...searchResults].sort((a, b) => a.price - b.price)[0];
  }

  // 7. "Fastest" / "Quickest"
  if (q.includes('fast') || q.includes('quick') || q.includes('shortest') || q.includes('earliest arrival')) {
    return [...searchResults].sort((a, b) => (parseFloat(a.duration) || 9) - (parseFloat(b.duration) || 9))[0];
  }

  // 8. "Latest" / "last one"
  if (q.includes('latest') || q.includes('last one') || q.includes('last bus')) {
    return searchResults[searchResults.length - 1];
  }

  // 9. Match by bus name or operator name e.g. "GoRide", "SwiftLine", "Janrath", "Volvo"
  for (const bus of searchResults) {
    if (
      q.includes(bus.operator.toLowerCase()) ||
      q.includes(bus.busName.toLowerCase()) ||
      q.includes(bus.id.toLowerCase())
    ) {
      return bus;
    }
  }

  return searchResults[0];
};

/**
 * Main Agent Message Processor
 * Manages Conversation State, Bus Selection, Seat Availability & Confirmation Gate
 * 
 * @param {string} userMessage - Natural language input from user
 * @param {Object} agentState - Conversation context state
 * @returns {Promise<Object>} Agent response object
 */
export const processAgentMessage = async (userMessage = '', agentState = {}) => {
  const q = userMessage.trim();
  const qLower = q.toLowerCase();

  // Context preservation
  let params = { ...(agentState.params || {}) };
  let currentState = agentState.state || 'IDLE';
  let searchResults = agentState.searchResults || params.searchResults || [];
  let recommendation = agentState.recommendation || params.recommendation || null;
  let selectedBus = agentState.selectedBus || params.selectedBus || null;
  let selectedSlot = agentState.selectedSlot || params.selectedSlot || null;
  let selectedSeats = agentState.selectedSeats || params.selectedSeats || [];

  const statusTrace = [];

  // =========================================================================
  // 0. DUPLICATE & CONFIRMATION GUARDS
  // =========================================================================
  if (currentState === 'BOOKING') {
    return {
      agentState,
      statusTrace: [],
      text: '⏳ Your booking is already being processed. Please wait a moment...',
      chips: []
    };
  }

  if (currentState === 'PAYMENT_PENDING') {
    const lastTicket = getLastTicket();
    if (lastTicket && lastTicket.ticketId) {
      return {
        agentState: { ...agentState, state: 'CONFIRMED', ticketId: lastTicket.ticketId },
        statusTrace: [],
        text: `Your payment was completed and ticket **${lastTicket.ticketId}** is confirmed! Tap below to view your E-Ticket.`,
        actionCard: {
          title: `E-Ticket — ${lastTicket.ticketId}`,
          btnText: 'Open E-Ticket 🎫',
          navigateTo: '/eticket'
        },
        chips: ['Book another trip', 'View E-Ticket']
      };
    }

    const pending = getPendingBooking() || agentState.pendingBooking;
    if (qLower.includes('cancel') || qLower === 'no' || qLower.includes('abort')) {
      clearPendingBooking();
      return {
        agentState: { state: 'IDLE', params: {} },
        statusTrace: [],
        text: "❌ Booking cancelled. No payment was charged.\n\nFeel free to start a fresh search whenever you're ready!",
        chips: ['Find buses from Kanpur to Delhi tomorrow', 'Search Kanpur to Lucknow']
      };
    }

    if (qLower.includes('change seat') || qLower.includes('different seat')) {
      clearPendingBooking();
      return {
        agentState: { ...agentState, state: 'WAITING_FOR_SEAT_SELECTION', params, passengerDetails: agentState.passengerDetails || params.passengerDetails },
        statusTrace: [],
        text: "No problem! Which seats would you like instead? (e.g. S5 and S6)",
        chips: ['Book S5 and S6', 'Book S8 and S9', 'Show available seats']
      };
    }

    const fareToShow = agentState.totalFare || params.totalFare || (selectedSeats.length * (selectedBus?.price || 0));
    return {
      agentState,
      statusTrace: [],
      text: `Your booking details are confirmed and awaiting payment.\n\n• **Bus:** ${selectedBus?.operator || ''} - ${selectedBus?.busName || ''}\n• **Seats:** ${selectedSeats.join(', ')}\n• **Amount:** ₹${fareToShow}\n\nPlease proceed to the Payment Page to finalize your ticket.`,
      actionCard: {
        title: `Proceed to Payment (₹${fareToShow})`,
        btnText: 'Proceed to Payment 💳',
        navigateTo: '/payment',
        state: {
          bookingData: pending || {
            busDetails: selectedBus,
            seats: selectedSeats,
            passenger: agentState.passengerDetails || params.passengerDetails,
            totalFare: fareToShow
          }
        }
      },
      chips: ['Proceed to Payment 💳', 'Change seats', 'Cancel']
    };
  }

  if (currentState === 'CONFIRMED') {
    const tId = agentState.ticketId || '';
    if (qLower.includes('ticket') || qLower.includes('eticket') || qLower.includes('view') || qLower.includes('open')) {
      return {
        agentState,
        statusTrace: [],
        text: `Your ticket **${tId}** is confirmed! Tap below to view your E-Ticket.`,
        actionCard: {
          title: `E-Ticket — ${tId}`,
          btnText: 'Open E-Ticket 🎫',
          navigateTo: '/eticket'
        },
        chips: ['Book another trip']
      };
    }
    if (qLower.includes('another') || qLower.includes('new') || qLower.includes('again') || qLower.includes('search')) {
      return {
        agentState: { state: 'IDLE', params: {} },
        statusTrace: [],
        text: 'Starting a fresh search! Where would you like to travel? (e.g. "Find buses from Kanpur to Delhi tomorrow")',
        chips: ['Find buses from Kanpur to Delhi tomorrow', 'Search Kanpur to Lucknow', 'Search Delhi to Jaipur']
      };
    }
    return {
      agentState,
      statusTrace: [],
      text: `Your booking is confirmed ✅\n\n🎫 Ticket: **${tId}**\n\nWhat would you like to do next?`,
      actionCard: {
        title: `E-Ticket — ${tId}`,
        btnText: 'Open E-Ticket 🎫',
        navigateTo: '/eticket'
      },
      chips: ['Book another trip', 'View E-Ticket']
    };
  }

  // Check if query is a fresh search request
  const newlyExtracted = extractTravelParams(q);
  const isFreshSearch = (newlyExtracted.source && newlyExtracted.destination) || (qLower.includes('search') && !qLower.includes('seat')) || (qLower.includes('find bus') && !qLower.includes('seat'));

  // =========================================================================
  // 1. ROUTE / BUS SEARCH INTENT
  // =========================================================================
  if (isFreshSearch || currentState === 'IDLE' || currentState === 'COLLECTING_INFORMATION') {
    const source = newlyExtracted.source || params.source || null;
    const destination = newlyExtracted.destination || params.destination || null;
    const date = newlyExtracted.date || params.date || new Date().toISOString().split('T')[0];
    const preferredTime = newlyExtracted.preferredTime || params.preferredTime || null;

    params = { source, destination, date, preferredTime };

    if (!destination && !source) {
      return {
        agentState: { ...agentState, state: 'COLLECTING_INFORMATION', params },
        statusTrace: [],
        text: 'I can help you search and compare available buses! 🚌\n\nWhere would you like to travel from and to? (e.g. "Find buses from Kanpur to Delhi tomorrow")',
        chips: ['Find buses from Kanpur to Delhi tomorrow', 'Find buses from Kanpur to Delhi around 9 PM', 'Search Kanpur to Lucknow']
      };
    }

    if (destination && !source) {
      return {
        agentState: { ...agentState, state: 'COLLECTING_INFORMATION', params },
        statusTrace: [],
        text: `Sure, I can find buses heading to ${destination}! 📍\n\nWhere will you be traveling from?`,
        chips: [`From Kanpur to ${destination}`, `From Lucknow to ${destination}`, `From Jaipur to ${destination}`]
      };
    }

    if (source && !destination) {
      return {
        agentState: { ...agentState, state: 'COLLECTING_INFORMATION', params },
        statusTrace: [],
        text: `Got it! Starting from ${source}. 🚌\n\nWhere are you heading to?`,
        chips: [`To Delhi`, `To Lucknow`, `To Agra`]
      };
    }

    statusTrace.push('Understanding your travel request...');
    statusTrace.push('Searching available buses...');

    const toolResult = await search_buses({ source, destination, date, preferredTime });
    statusTrace.push('Comparing the available options...');

    if (!toolResult.success || !toolResult.results || toolResult.results.length === 0) {
      return {
        agentState: { ...agentState, state: 'COLLECTING_INFORMATION', params },
        statusTrace,
        text: `I couldn't find any buses operating for **${source} → ${destination}** on ${date}.\n\nTry searching another date or route!`,
        actionCard: {
          title: `Modify Search (${source} → ${destination})`,
          btnText: 'View Available Bus Routes',
          routeState: { from: source, to: destination, date }
        },
        chips: ['Try Tomorrow', 'Search Kanpur to Delhi', 'Search Delhi to Kanpur']
      };
    }

    const ranking = rankBuses(toolResult.results, { preferredTime });
    const topBus = ranking.bestBus;

    params = {
      ...params,
      searchResults: toolResult.results,
      recommendation: ranking,
      selectedBus: topBus,
      selectedSlot: topBus?.slots?.[0] || { time: topBus?.departureTime || '08:30 PM', fare: `₹${topBus?.price || 680}`, status: 'available' }
    };

    let responseText = `I found **${toolResult.results.length} bus(es)** for **${source} → ${destination}** on ${date}:\n\n`;
    toolResult.results.slice(0, 3).forEach((b, idx) => {
      const isTop = topBus && b.id === topBus.id;
      responseText += `${idx + 1}. **${b.operator} - ${b.busName}** (${b.busType}) ${isTop ? '⭐ *Recommended*' : ''}\n`;
      responseText += `   • Dep: **${b.departureTime}** → Arr: **${b.arrivalTime}** (${b.duration}) | Fare: **₹${b.price}** | Seats: **${b.availableSeats} open**\n`;
    });

    if (topBus && ranking.reasons && ranking.reasons.length > 0) {
      responseText += `\n💡 **Why ${topBus.busName}?** ${ranking.reasons.join(', ')}.\n`;
    }
    responseText += `\nWhich bus would you like to select? (e.g. "I want the recommended one", "Select the second one", or "Cheapest")`;

    return {
      agentState: {
        ...agentState,
        state: 'WAITING_FOR_BUS_SELECTION',
        params,
        searchResults: toolResult.results,
        recommendation: ranking,
        selectedBus: topBus
      },
      statusTrace,
      text: responseText,
      searchResults: toolResult.results,
      recommendation: ranking,
      actionCard: {
        title: `Select Recommended Bus (${topBus ? topBus.busName : 'Bus'})`,
        btnText: 'Select Recommended Bus & Check Seats 🪑',
        chatQuery: 'Select the recommended one'
      },
      chips: [
        'Select the recommended one',
        'I want the second one',
        'Select the cheapest one',
        'Show available seats'
      ]
    };
  }

  // =========================================================================
  // 2. BUS SELECTION INTENT
  // =========================================================================
  const isBusSelectIntent = qLower.includes('select') || qLower.includes('choose') || qLower.includes('pick') || qLower.includes('want the') || qLower.includes('first') || qLower.includes('second') || qLower.includes('third') || qLower.includes('goride') || qLower.includes('swiftline') || qLower.includes('janrath') || qLower.includes('volvo');

  if (isBusSelectIntent && searchResults.length > 0 && !qLower.includes('seat')) {
    statusTrace.push('Selecting your bus...');
    const matchedBus = findSelectedBusFromQuery(q, searchResults, recommendation);

    if (!matchedBus) {
      return {
        agentState,
        statusTrace,
        text: `Which bus would you like to select? Here are the available options:\n` +
          searchResults.map((b, i) => `${i + 1}. **${b.operator} - ${b.busName}** (₹${b.price}, ${b.departureTime})`).join('\n'),
        chips: searchResults.map((b) => `Select ${b.busName}`)
      };
    }

    const busDetailsResult = await get_bus_details({ busId: matchedBus.id });
    const busObj = busDetailsResult.success ? busDetailsResult.bus : matchedBus;
    const defaultSlot = busObj.slots?.[0] || { time: busObj.departureTime, fare: `₹${busObj.price}`, status: 'available' };

    params = {
      ...params,
      selectedBus: busObj,
      selectedSlot: defaultSlot
    };

    // Also auto-fetch seat availability
    const slotTime = defaultSlot?.time || busObj.departureTime || '08:30 PM';
    const seatData = await check_seat_availability({
      busId: busObj.id,
      date: params.date,
      slot: slotTime
    });

    params.availableSeats = seatData.availableSeats;
    params.occupiedSeats = seatData.occupiedSeats;

    const openCount = seatData.availableSeats.length;
    const previewSeats = seatData.availableSeats.slice(0, 12).join(', ');

    return {
      agentState: {
        ...agentState,
        state: 'WAITING_FOR_SEAT_SELECTION',
        params,
        selectedBus: busObj,
        selectedSlot: defaultSlot,
        availableSeats: seatData.availableSeats
      },
      statusTrace: ['Bus selected.', 'Seats verified.'],
      text: `Selected **${busObj.operator} - ${busObj.busName}** (${busObj.busType}) for ${params.source} → ${params.destination}.\n` +
        `• Departure: **${busObj.departureTime}** | Fare: **₹${busObj.price}/seat**\n\n` +
        `💺 **Available Seats (${openCount}/${seatData.totalSeats}):**\n${previewSeats}...\n` +
        `*Occupied Seats:* ${seatData.occupiedSeats.join(', ')}\n\n` +
        `Which seats would you like to book? (e.g. "Book S3 and S4" or "Select S5")`,
      actionCard: {
        title: `Seat Map (${busObj.busName})`,
        btnText: 'Open Interactive Seat Map 🗺️',
        routeState: {
          from: params.source,
          to: params.destination,
          date: params.date,
          route: `${params.source} → ${params.destination}`,
          selectedBus: busObj,
          selectedSlot: defaultSlot
        }
      },
      chips: ['Book S3 and S4', 'Select S5 and S6', 'Book S1', 'Select another bus']
    };
  }

  // =========================================================================
  // 3. SEAT AVAILABILITY CHECK INTENT
  // =========================================================================
  const isSeatCheckIntent = qLower.includes('seat') && (qLower.includes('show') || qLower.includes('check') || qLower.includes('available') || qLower.includes('what'));

  if (isSeatCheckIntent || currentState === 'BUS_SELECTED') {
    if (!selectedBus) {
      return {
        agentState,
        statusTrace,
        text: 'Please select a bus first so I can check seat availability for you.',
        chips: searchResults.length > 0
          ? searchResults.map((b) => `Select ${b.busName}`)
          : ['Find buses from Kanpur to Delhi tomorrow']
      };
    }

    statusTrace.push('Checking available seats...');
    const slotTime = selectedSlot?.time || selectedBus.departureTime || '08:30 PM';

    const seatData = await check_seat_availability({
      busId: selectedBus.id,
      date: params.date,
      slot: slotTime
    });

    params = {
      ...params,
      availableSeats: seatData.availableSeats,
      occupiedSeats: seatData.occupiedSeats
    };

    const openCount = seatData.availableSeats.length;
    const previewSeats = seatData.availableSeats.slice(0, 16).join(', ');

    return {
      agentState: {
        ...agentState,
        state: 'WAITING_FOR_SEAT_SELECTION',
        params,
        availableSeats: seatData.availableSeats
      },
      statusTrace,
      text: `Checked seat map for **${selectedBus.busName}** (${slotTime}):\n\n` +
        `💺 **Available Seats (${openCount}/${seatData.totalSeats}):**\n${previewSeats}...\n\n` +
        `*Occupied Seats:* ${seatData.occupiedSeats.join(', ')}.\n\n` +
        `Which seat numbers would you like to select? (e.g. "Book S3 and S4" or "Select S5")`,
      actionCard: {
        title: `Interactive Seat Map (${selectedBus.busName})`,
        btnText: 'Open Interactive Seat Map 🗺️',
        routeState: {
          from: params.source,
          to: params.destination,
          date: params.date,
          route: `${params.source} → ${params.destination}`,
          selectedBus,
          selectedSlot: selectedSlot || { time: slotTime, fare: `₹${selectedBus.price}` }
        }
      },
      chips: [
        'Book S3 and S4',
        'Select S5 and S6',
        'Choose best seats for 2 people',
        'Select another bus'
      ]
    };
  }

  // =========================================================================
  // 4. SEAT SELECTION & ATOMIC VALIDATION INTENT
  // =========================================================================
  const extractedSeats = extractSeatIDs(q);
  const isSeatSelectIntent = extractedSeats.length > 0 || (qLower.includes('seat') && (qLower.includes('choose') || qLower.includes('select') || qLower.includes('book') || qLower.includes('people') || qLower.includes('passenger')));

  if (isSeatSelectIntent && (currentState === 'WAITING_FOR_SEAT_SELECTION' || currentState === 'WAITING_FOR_BUS_SELECTION' || currentState === 'BUS_SELECTED' || currentState === 'BOOKING_SUMMARY')) {
    if (!selectedBus) {
      return {
        agentState,
        statusTrace,
        text: 'Please select a bus first before choosing seats.',
        chips: ['Find buses from Kanpur to Delhi tomorrow']
      };
    }

    statusTrace.push('Validating seat selection...');
    const slotTime = selectedSlot?.time || selectedBus.departureTime || '08:30 PM';
    const farePerSeat = selectedBus.price || 599;

    let targetSeats = extractedSeats;

    if (targetSeats.length === 0) {
      const numMatch = q.match(/(\d+)\s*(?:people|passengers|seats)?/i);
      const countNeeded = numMatch ? parseInt(numMatch[1], 10) : 2;

      const { availableSeats } = await check_seat_availability({
        busId: selectedBus.id,
        date: params.date,
        slot: slotTime
      });

      targetSeats = availableSeats.slice(0, countNeeded);
    }

    // ATOMIC TOOL CALL: hold_select_seats
    const holdResult = await hold_select_seats({
      busId: selectedBus.id,
      date: params.date,
      slot: slotTime,
      seats: targetSeats,
      farePerSeat
    });

    // ATOMICITY REJECTION HANDLER
    if (!holdResult.success) {
      return {
        agentState: {
          ...agentState,
          state: 'WAITING_FOR_SEAT_SELECTION',
          params
        },
        statusTrace,
        text: `⚠️ **Seat Validation Notice:**\n${holdResult.error}\n\n*No seats were committed due to atomic availability checks. Please choose from open seats.*`,
        chips: [
          'Book S3 and S4',
          'Select S5 and S6',
          'Show available seats'
        ]
      };
    }

    // ATOMIC SUCCESS
    const validatedSeats = holdResult.seats;
    const baseFare = holdResult.totalFare;

    params = {
      ...params,
      selectedSeats: validatedSeats,
      baseFare,
      totalFare: baseFare
    };

    // Check if user ALSO provided passenger details in this message
    let pd = { ...(agentState.passengerDetails || {}) };
    
    // Check name
    const nameMatch = q.match(/(?:my name is|i['']?m|name is|passenger(?:'s)? name is|call me)\s+([A-Za-z][A-Za-z\s]{1,39})/i);
    if (nameMatch) pd.name = nameMatch[1].trim();

    // Check email
    const emailMatch = q.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) pd.email = emailMatch[0].toLowerCase();

    // Check mobile
    const cleaned = q.replace(/[\s\-().]/g, '');
    const mobileMatch = cleaned.match(/(?:\+91)?([6-9]\d{9})/);
    if (mobileMatch) pd.mobile = mobileMatch[1];

    // If all passenger details already provided:
    if (pd.name && pd.email && pd.mobile) {
      return buildBookingSummaryResponse({
        agentState,
        params,
        selectedBus,
        selectedSlot,
        selectedSeats: validatedSeats,
        pd,
        slotTime,
        statusTrace: ['Seats validated atomically.', 'Passenger info parsed.']
      });
    }

    // Otherwise prompt for passenger info
    return {
      agentState: {
        ...agentState,
        state: 'COLLECTING_PASSENGER_INFO',
        params,
        selectedSeats: validatedSeats,
        passengerDetails: pd,
        totalFare: baseFare
      },
      statusTrace: ['Seats reserved atomically.'],
      text: `🎉 **Seats ${validatedSeats.join(', ')} validated successfully!**\n\n` +
        `• **Bus:** ${selectedBus.operator} - ${selectedBus.busName}\n` +
        `• **Route:** ${params.source} → ${params.destination} (${params.date} at ${slotTime})\n` +
        `• **Fare:** ₹${baseFare} (${validatedSeats.length} seat${validatedSeats.length > 1 ? 's' : ''})\n\n` +
        `To complete your booking, what is the passenger's **full name**?`,
      chips: ['Anshika Verma', 'Rahul Sharma', 'Cancel']
    };
  }

  // =========================================================================
  // 5. PASSENGER INFO COLLECTION & MODIFICATIONS
  // =========================================================================
  if (
    currentState === 'WAITING_FOR_BOOKING_CONFIRMATION' ||
    currentState === 'COLLECTING_PASSENGER_INFO' ||
    currentState === 'BOOKING_SUMMARY'
  ) {
    let pd = { ...(agentState.passengerDetails || {}) };
    const slotTime = selectedSlot?.time || selectedBus?.departureTime || '08:30 PM';

    // Cancel / abort handler
    const CANCEL_PHRASES = ['cancel', 'abort', "don't book", 'dont book', 'not now', 'stop', 'never mind', 'no thanks'];
    const isCancelNow = qLower === 'no' || CANCEL_PHRASES.some((p) => qLower === p || qLower.startsWith(p));
    if (isCancelNow) {
      return {
        agentState: { state: 'IDLE', params: {} },
        statusTrace: [],
        text: "❌ Booking cancelled. No problem, I haven't charged or created any booking.\n\nFeel free to search for another trip anytime!",
        chips: ['Find buses from Kanpur to Delhi tomorrow', 'Search Kanpur to Lucknow', 'Search Delhi to Jaipur']
      };
    }

    // Change request handlers
    if (qLower.includes('change seat') || qLower.includes('different seat') || qLower.includes('another seat')) {
      return {
        agentState: { ...agentState, state: 'WAITING_FOR_SEAT_SELECTION', params, passengerDetails: pd },
        statusTrace: [],
        text: "No problem! Which seats would you like instead? (e.g. S5 and S6)",
        chips: ['Book S5 and S6', 'Book S8 and S9', 'Show available seats']
      };
    }

    if (qLower.includes('change bus') || qLower.includes('different bus') || qLower.includes('another bus')) {
      return {
        agentState: { ...agentState, state: 'WAITING_FOR_BUS_SELECTION', params, passengerDetails: pd },
        statusTrace: [],
        text: "Sure! Which bus would you like instead? You can say 'cheapest', 'fastest', or a bus name.",
        chips: ['Select the recommended one', 'Select the cheapest one', 'Select the fastest one']
      };
    }

    if (qLower.includes('change passenger') || qLower.includes('change name') || qLower.includes('different name') || qLower.includes('update name')) {
      const nameMatch = q.match(/(?:to|is)\s+([A-Za-z][A-Za-z\s]{1,39})/i);
      if (nameMatch && !nameMatch[1].toLowerCase().includes('change')) {
        pd = { ...pd, name: nameMatch[1].trim() };
        return buildBookingSummaryResponse({
          agentState,
          params,
          selectedBus,
          selectedSlot,
          selectedSeats,
          pd,
          slotTime,
          statusTrace: ['Passenger name updated.']
        });
      }
      pd = { ...pd, name: undefined };
      return {
        agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
        statusTrace: [],
        text: "Sure, what name should I use for the passenger?",
        chips: []
      };
    }

    if (qLower.includes('change email') || qLower.includes('different email') || qLower.includes('update email')) {
      const emailMatch = q.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        pd = { ...pd, email: emailMatch[0].toLowerCase() };
        return buildBookingSummaryResponse({
          agentState,
          params,
          selectedBus,
          selectedSlot,
          selectedSeats,
          pd,
          slotTime,
          statusTrace: ['Passenger email updated.']
        });
      }
      pd = { ...pd, email: undefined };
      return {
        agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
        statusTrace: [],
        text: "Sure, what's the new email address?",
        chips: []
      };
    }

    if (qLower.includes('change phone') || qLower.includes('change mobile') || qLower.includes('different number') || qLower.includes('update phone') || qLower.includes('update mobile')) {
      const cleaned = q.replace(/[\s\-().]/g, '');
      const mobileMatch = cleaned.match(/(?:\+91)?([6-9]\d{9})/);
      if (mobileMatch) {
        pd = { ...pd, mobile: mobileMatch[1] };
        return buildBookingSummaryResponse({
          agentState,
          params,
          selectedBus,
          selectedSlot,
          selectedSeats,
          pd,
          slotTime,
          statusTrace: ['Passenger mobile updated.']
        });
      }
      pd = { ...pd, mobile: undefined };
      return {
        agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
        statusTrace: [],
        text: "Sure, what's the new 10-digit mobile number?",
        chips: []
      };
    }

    // =======================================================================
    // 6. CONFIRMATION GATE (Strict Explicit Confirmation Check)
    // =======================================================================
    const CONFIRM_PHRASES = [
      'confirm', 'yes', 'yes confirm', 'yes, confirm', 'yes please',
      'yes book it', 'yes, book it', 'book it', 'confirm booking',
      'go ahead', 'proceed', 'proceed with booking', 'i want to book it',
      'please book it', 'do it', 'confirm it', 'yes do it'
    ];

    const isConfirmIntent = CONFIRM_PHRASES.some((p) => {
      if (qLower === p) return true;
      const regex = new RegExp(`\\b${p.replace(',', '')}\\b`, 'i');
      return regex.test(qLower.replace(/[.,!]/g, ' '));
    });

    if (isConfirmIntent && currentState === 'BOOKING_SUMMARY') {
      if (!pd.name || !pd.email || !pd.mobile) {
        return {
          agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params },
          statusTrace: [],
          text: 'I still need passenger details before booking. What name should I use?',
          chips: []
        };
      }

      statusTrace.push('Validating seat availability...');
      statusTrace.push('Preparing booking details for payment...');

      const farePerSeat = selectedBus?.price || 0;
      const baseFare = selectedSeats.length * farePerSeat;

      let discountAmount = 0;
      let couponCode = null;
      try {
        const storedCoupon = localStorage.getItem('appliedCoupon');
        if (storedCoupon) {
          const c = JSON.parse(storedCoupon);
          if (c?.code) {
            couponCode = c.code;
            discountAmount = c.code === 'FIRSTGO' ? 150 : (c.code === 'GTWEEKEND' ? 200 : 50);
          }
        }
      } catch (e) {}

      const totalFare = Math.max(0, baseFare - discountAmount);

      const passengerForBooking = {
        fullName: pd.name,
        email: pd.email,
        mobile: pd.mobile
      };

      const prepResult = await prepare_booking({
        busDetails: selectedBus,
        slot: slotTime,
        seats: selectedSeats,
        farePerSeat,
        passenger: passengerForBooking,
        date: params.date || '',
        source: params.source,
        destination: params.destination,
        appliedCoupon: couponCode,
        discountAmount,
        totalFare
      });

      if (!prepResult.success) {
        return {
          agentState: { ...agentState, state: 'BOOKING_SUMMARY', params },
          statusTrace,
          text: `⚠️ **Booking could not be prepared:**\n${prepResult.error}\n\nWould you like to choose different seats or try again?`,
          chips: ['Show available seats', 'Select another bus', 'Cancel']
        };
      }

      const emailParts = pd.email.split('@');
      const maskedEmail = emailParts[0].slice(0, 2) + '***@' + emailParts[1];
      const maskedMobile = '•'.repeat(pd.mobile.length - 4) + pd.mobile.slice(-4);

      const confirmedHandoffText =
        `✅ **Your booking details are confirmed!**\n\n` +
        `🚌 **Bus:** ${selectedBus?.operator || ''} - ${selectedBus?.busName || ''} (${selectedBus?.busType || ''})\n` +
        `📍 **Route:** ${params.source} → ${params.destination}\n` +
        `📅 **Date:** ${params.date}  ⏰ **Departure:** ${slotTime}\n` +
        `💺 **Seats:** ${selectedSeats.join(', ')}\n` +
        `👤 **Passenger:** ${pd.name} (${maskedEmail} | ${maskedMobile})\n` +
        `💰 **Total Payable:** ₹${totalFare}\n\n` +
        `👉 **Please complete the payment on the Payment Page to finalize your ticket.**`;

      return {
        agentState: {
          ...agentState,
          state: 'PAYMENT_PENDING',
          params,
          passengerDetails: pd,
          pendingBooking: prepResult.pendingBooking,
          totalFare
        },
        statusTrace: ['Booking details confirmed.', 'Ready for payment handoff.'],
        text: confirmedHandoffText,
        pendingBooking: prepResult.pendingBooking,
        actionCard: {
          title: `Proceed to Payment (₹${totalFare})`,
          btnText: 'Proceed to Payment 💳',
          navigateTo: '/payment',
          state: {
            bookingData: prepResult.pendingBooking
          }
        },
        chips: ['Proceed to Payment 💳', 'Change seats', 'Cancel']
      };
    }

    // If user says "maybe", "not sure", "how much", etc. in BOOKING_SUMMARY:
    if (currentState === 'BOOKING_SUMMARY') {
      return {
        agentState,
        statusTrace: [],
        text: 'Would you like me to confirm this booking?\n\n• Type **"Yes, confirm"** or tap **Confirm Booking** to finalize.\n• Type **"Change seat"**, **"Change passenger"**, or **"Cancel"** to abort.',
        chips: ['Yes, confirm', 'Change seats', 'Change passenger', 'Cancel']
      };
    }

    // =======================================================================
    // MULTI-FIELD & SEQUENTIAL PASSENGER EXTRACTION
    // =======================================================================
    // 1. Extract Name if not set
    if (!pd.name) {
      const namePatterns = [
        /(?:my name is|i['']?m|name is|passenger(?:'s)? name is|call me)\s+([A-Za-z][A-Za-z\s]{1,39})/i,
        /^([A-Za-z][A-Za-z\s]{1,39})$/
      ];
      for (const pattern of namePatterns) {
        const m = q.match(pattern);
        if (m) {
          const val = m[1].trim();
          if (!['yes', 'no', 'cancel', 'confirm', 'book', 'stop', 'done'].includes(val.toLowerCase())) {
            pd.name = val;
            break;
          }
        }
      }
    }

    // 2. Extract Email if not set
    if (!pd.email) {
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const emailMatch = q.match(emailPattern);
      if (emailMatch) {
        pd.email = emailMatch[0].toLowerCase();
      }
    }

    // 3. Extract Mobile if not set
    if (!pd.mobile) {
      const cleaned = q.replace(/[\s\-().]/g, '');
      const mobilePattern = /(?:\+91)?([6-9]\d{9})/;
      const mobileMatch = cleaned.match(mobilePattern);
      if (mobileMatch) {
        pd.mobile = mobileMatch[1];
      }
    }

    // Check if ALL 3 fields are now satisfied:
    if (pd.name && pd.email && pd.mobile) {
      const slotTime = selectedSlot?.time || selectedBus?.departureTime || '08:30 PM';
      return buildBookingSummaryResponse({
        agentState,
        params,
        selectedBus,
        selectedSlot,
        selectedSeats,
        pd,
        slotTime,
        statusTrace: ['All passenger information collected.']
      });
    }

    // If still missing name:
    if (!pd.name) {
      return {
        agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
        statusTrace: ['Collecting passenger information...'],
        text: 'What name should I use for the passenger? (e.g. "Anshika Verma")',
        chips: ['Anshika Verma', 'Rahul Sharma', 'Cancel']
      };
    }

    // If still missing email:
    if (!pd.email) {
      const hasAt = q.includes('@');
      const textPrompt = hasAt
        ? "That doesn't look like a valid email address (e.g. anshika@example.com). Please try again."
        : `Thanks, **${pd.name}**! 👤\n\nWhat email address should I send the ticket to?`;
      return {
        agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
        statusTrace: ['Name received.'],
        text: textPrompt,
        chips: []
      };
    }

    // If still missing mobile:
    if (!pd.mobile) {
      const hasDigits = /\d/.test(q);
      const textPrompt = hasDigits
        ? "Please provide a valid 10-digit Indian mobile number (e.g. 9876543210)."
        : `Got it! 📧\n\nWhat 10-digit mobile number should I use for ticket notifications?`;
      return {
        agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
        statusTrace: ['Email received.'],
        text: textPrompt,
        chips: ['9876543210', '9123456789']
      };
    }
  }

  // DEFAULT FALLBACK
  return {
    agentState,
    statusTrace: [],
    text: `Hi there! How can I assist your trip today?\n\nTry: _"Find me a bus from Kanpur to Delhi tomorrow evening."_`,
    chips: [
      'Find buses from Kanpur to Delhi tomorrow',
      'Select the recommended one',
      'Show available seats',
      'Contact Me for Direct Booking 📞'
    ]
  };
};

/**
 * Builds standard, transparent Final Booking Summary response
 */
function buildBookingSummaryResponse({ agentState, params, selectedBus, selectedSlot, selectedSeats, pd, slotTime, statusTrace = [] }) {
  const farePerSeat = selectedBus?.price || 0;
  const baseFare = selectedSeats.length * farePerSeat;

  let discountAmount = 0;
  let couponCode = null;
  try {
    const storedCoupon = localStorage.getItem('appliedCoupon');
    if (storedCoupon) {
      const c = JSON.parse(storedCoupon);
      if (c?.code) {
        couponCode = c.code;
        discountAmount = c.code === 'FIRSTGO' ? 150 : (c.code === 'GTWEEKEND' ? 200 : 50);
      }
    }
  } catch (e) {}

  const totalFare = Math.max(0, baseFare - discountAmount);

  const emailParts = pd.email.split('@');
  const maskedEmail = emailParts[0].slice(0, 2) + '***@' + emailParts[1];
  const maskedMobile = '•'.repeat(pd.mobile.length - 4) + pd.mobile.slice(-4);

  let fareText = `• **Base Fare:** ₹${baseFare}`;
  if (discountAmount > 0) {
    fareText += `\n• **Discount (${couponCode}):** -₹${discountAmount}`;
  }
  fareText += `\n• **Total Amount:** ₹${totalFare}`;

  const summaryText =
    `📋 **Booking Summary**\n\n` +
    `🚌 **Bus:** ${selectedBus?.operator || ''} — ${selectedBus?.busName || ''} (${selectedBus?.busType || ''})\n` +
    `📍 **Route:** ${params.source} → ${params.destination}\n` +
    `📅 **Date:** ${params.date}  ⏰ **Departure:** ${slotTime}\n` +
    `💺 **Seats:** ${selectedSeats.join(', ')} (${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''})\n\n` +
    `👤 **Passenger Details:**\n` +
    `• **Name:** ${pd.name}\n` +
    `• **Email:** ${maskedEmail}\n` +
    `• **Mobile:** ${maskedMobile}\n\n` +
    `💰 **Fare Details:**\n` +
    `${fareText}\n\n` +
    `──────────────────────\n` +
    `Would you like me to confirm this booking?\n\n` +
    `• Tap **"Confirm Booking"** or type **"Yes, confirm"**.\n` +
    `• To change details, type **"Change seat"** or **"Cancel"**.`;

  return {
    agentState: {
      ...agentState,
      state: 'BOOKING_SUMMARY',
      params,
      selectedSeats,
      passengerDetails: pd,
      totalFare
    },
    statusTrace: [...statusTrace, 'Ready for final confirmation.'],
    text: summaryText,
    actionCard: {
      title: `Confirm Booking for ${selectedSeats.join(', ')} (₹${totalFare})`,
      btnText: 'Confirm Booking ✅',
      chatQuery: 'Yes, confirm'
    },
    chips: ['Yes, confirm', 'Change seats', 'Change passenger', 'Cancel']
  };
}
