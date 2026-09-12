// GoTicket Travel Agent Orchestrator
// Master AI Travel Agent ("Tixie") — Multi-turn NLU, State Machine, Atomic Seat Validation & Confirmation Gate

import {
  search_buses,
  get_bus_details,
  check_seat_availability,
  hold_select_seats,
  create_booking,
  cancel_booking,
  get_booking_details
} from './agentTools.js';
import { rankBuses, findBestAndAlternativeBuses } from './recommendationEngine.js';
import { getPendingBooking, clearPendingBooking, getLastTicket } from './bookingService.js';
import { getBusSeatLayout, recommendSeats, findAdjacentSeats } from './seatService.js';
import { maskEmail, maskMobile } from './notificationService.js';
import authService from './authService.js';
// NLU Layer — Step 1: Natural Language Understanding Foundation
import { parseUserMessage } from './nluService.js';
import { INTENTS } from './intentDefinitions.js';
// Context Manager — Step 2: Multi-turn Context Management
import {
  buildAgentContextFromState,
  buildNLUContext,
  mergeTravelRequest,
  updateSearchContext,
  updateSeatsContext,
  updateConversation,
  resetTravelContext,
  shouldInvalidateSearch,
} from './contextManager.js';

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
export const processAgentMessage = async (userMessage = '', agentState = {}, options = {}) => {
  const q = userMessage.trim();
  const qLower = q.toLowerCase();

  const activeUser = options.user || agentState.user || (typeof authService !== 'undefined' ? authService.getCurrentUser() : null);

  // Context preservation & AgentContext initialization
  let params = { ...(agentState.params || {}) };
  let currentState = agentState.state || 'IDLE';
  let searchResults = agentState.searchResults || params.searchResults || [];
  let recommendation = agentState.recommendation || params.recommendation || null;
  let selectedBus = agentState.selectedBus || params.selectedBus || null;
  let selectedSlot = agentState.selectedSlot || params.selectedSlot || null;
  let selectedSeats = agentState.selectedSeats || params.selectedSeats || [];

  let agentCtx = buildAgentContextFromState({
    agentState,
    params,
    searchResults,
    selectedBus,
    selectedSlot,
    selectedSeats,
  });

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

  // CANCELLATION INTENT & CONFIRMATION WORKFLOW
  const cancelTicketMatch = q.match(/\b(?:cancel|abort)\s+(?:my\s+)?(?:booking|ticket)?\s*([A-Z0-9]{6,10})\b/i) ||
                            q.match(/\b([A-Z0-9]{6,10})\s+(?:cancel|abort)\b/i) ||
                            (qLower.includes('cancel') && q.match(/\b(GT[A-Z0-9]{6,8})\b/i));

  if (currentState === 'WAITING_FOR_CANCEL_CONFIRMATION') {
    const ticketIdToCancel = agentState.cancelTicketId;
    const CONFIRM_CANCEL = ['yes', 'yes cancel', 'yes, cancel', 'confirm', 'confirm cancellation', 'proceed', 'cancel it', 'yes do it'];
    const ABORT_CANCEL = ['no', "don't cancel", 'dont cancel', 'keep ticket', 'keep it', 'never mind', 'stop', 'back'];

    if (CONFIRM_CANCEL.some((p) => qLower === p || qLower.startsWith(p))) {
      statusTrace.push('Verifying authorization and processing cancellation...');
      const cancelRes = await cancel_booking({ ticketId: ticketIdToCancel, user: activeUser });
      if (!cancelRes.success) {
        return {
          agentState: { ...agentState, state: 'IDLE', cancelTicketId: null },
          statusTrace: ['Cancellation failed.'],
          text: `⚠️ **Cancellation Notice:**\n${cancelRes.error}`,
          chips: ['Find buses from Kanpur to Delhi tomorrow', 'Contact Support 📞']
        };
      }
      return {
        agentState: { state: 'IDLE', params: {}, agentCtx: resetTravelContext(agentCtx) },
        statusTrace: ['Ticket cancelled successfully.', 'Refund initiated.'],
        text: `✅ **Ticket ${ticketIdToCancel} has been successfully cancelled.**\n\nA full refund has been initiated to your original payment method (Demo Mode).\n\nFeel free to book another trip whenever you're ready!`,
        chips: ['Find buses from Kanpur to Delhi tomorrow', 'Search Kanpur to Lucknow']
      };
    }

    if (ABORT_CANCEL.some((p) => qLower === p || qLower.startsWith(p))) {
      return {
        agentState: { ...agentState, state: 'IDLE', cancelTicketId: null },
        statusTrace: [],
        text: `Cancellation aborted. Your ticket **${ticketIdToCancel}** remains active and confirmed. 🎫`,
        actionCard: {
          title: `View E-Ticket (${ticketIdToCancel})`,
          btnText: 'Open E-Ticket 🎫',
          navigateTo: '/eticket'
        },
        chips: ['Find buses from Kanpur to Delhi tomorrow', 'View E-Ticket']
      };
    }
  }

  if (cancelTicketMatch) {
    const rawId = cancelTicketMatch[1].toUpperCase();
    const ticketId = rawId.startsWith('GT') ? rawId : `GT${rawId}`;
    const checkRes = await get_booking_details({ ticketId });

    if (!checkRes.success || !checkRes.ticket) {
      return {
        agentState,
        statusTrace: [],
        text: `No active booking found for Ticket ID **${ticketId}**. Please verify your ticket number.`,
        chips: ['Find buses from Kanpur to Delhi tomorrow']
      };
    }

    const t = checkRes.ticket;
    if (t.status === 'CANCELLED') {
      return {
        agentState,
        statusTrace: [],
        text: `Ticket **${ticketId}** has already been cancelled.`,
        chips: ['Find buses from Kanpur to Delhi tomorrow']
      };
    }

    // Authorization check against activeUser
    if (activeUser) {
      const uEmail = (activeUser.email || '').toLowerCase().trim();
      const uMobile = (activeUser.mobile || '').replace(/\D/g, '');
      const uName = (activeUser.name || activeUser.fullName || '').toLowerCase().trim();

      const bEmail = (t.passenger?.email || '').toLowerCase().trim();
      const bMobile = (t.passenger?.mobile || '').replace(/\D/g, '');
      const bName = (t.passenger?.fullName || '').toLowerCase().trim();

      const isOwner =
        (uEmail && bEmail && uEmail === bEmail) ||
        (uMobile && bMobile && uMobile === bMobile) ||
        (uName && bName && (uName.includes(bName) || bName.includes(uName)));

      if (!isOwner) {
        return {
          agentState,
          statusTrace: [],
          text: `⚠️ **Unauthorized:** Ticket **${ticketId}** is registered to another passenger. You can only cancel bookings associated with your registered account.`,
          chips: ['Find buses from Kanpur to Delhi tomorrow']
        };
      }
    }

    return {
      agentState: { ...agentState, state: 'WAITING_FOR_CANCEL_CONFIRMATION', cancelTicketId: ticketId },
      statusTrace: ['Loaded ticket for cancellation.'],
      text: `📋 **Cancellation Request for Ticket ${ticketId}**\n\n` +
        `• **Bus:** ${t.name} (${t.type || ''})\n` +
        `• **Route:** ${t.route}\n` +
        `• **Date & Time:** ${t.date} at ${t.time}\n` +
        `• **Seats:** ${(t.seats || []).join(', ')}\n` +
        `• **Refundable Amount:** ₹${t.totalFare}\n\n` +
        `⚠️ **Are you sure you want to cancel this booking?** This action is irreversible.`,
      chips: ['Yes, confirm cancellation', 'Keep my ticket']
    };
  }

  // ALREADY CONFIRMED DUPLICATE PROTECTION
  if (currentState === 'CONFIRMED' && (qLower.includes('confirm') || qLower.includes('book'))) {
    const existingTicket = agentState.confirmedTicket || getLastTicket();
    if (existingTicket && existingTicket.ticketId) {
      return {
        agentState,
        statusTrace: [],
        text: `Your booking has already been confirmed! Your ticket ID is **${existingTicket.ticketId}**.\n\n🚌 **${existingTicket.name}** | 💺 Seats: ${(existingTicket.seats || []).join(', ')}\n\nYou can view your official digital ticket below:`,
        actionCard: {
          title: `View E-Ticket (${existingTicket.ticketId})`,
          btnText: 'View E-Ticket 🎫',
          navigateTo: '/eticket'
        },
        chips: ['View E-Ticket 🎫', 'Book another trip']
      };
    }
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

  // =========================================================================
  // NLU & Context Manager: Parse message and merge into structured context
  // The NLU layer never mutates params or agentState — the state machine
  // remains the sole authority for all state transitions.
  // =========================================================================
  const nluContext = buildNLUContext(agentCtx);
  const nlu = parseUserMessage(q, nluContext);

  const oldTravelReq = { ...agentCtx.travelRequest };
  agentCtx = mergeTravelRequest(agentCtx, nlu);
  agentCtx = updateConversation(agentCtx, { intent: nlu.intent, message: q });

  // Invalidate search if route or date changed
  const { shouldInvalidate } = shouldInvalidateSearch(
    oldTravelReq,
    agentCtx.travelRequest
  );

  if (shouldInvalidate && searchResults.length > 0) {
    searchResults = [];
    selectedBus = null;
    selectedSlot = null;
    recommendation = null;
    agentCtx = updateSearchContext(agentCtx, { results: [], selectedBus: null, selectedSlot: null });
  }

  // Persist updated agentCtx into agentState
  agentState = { ...agentState, agentCtx };

  // Check if query is a fresh search request
  // NLU intent takes priority; legacy keyword fallbacks preserved for safety
  const newlyExtracted = extractTravelParams(q); // kept for seat ID extraction & backward compat
  const isFreshSearch =
    nlu.intent === INTENTS.SEARCH_BUS ||
    nlu.intent === INTENTS.SEARCH_AND_RECOMMEND ||
    (nlu.entities.source && nlu.entities.destination) ||
    (shouldInvalidate && agentCtx.travelRequest.source && agentCtx.travelRequest.destination) ||
    (qLower.includes('search') && !qLower.includes('seat')) ||
    (qLower.includes('find bus') && !qLower.includes('seat'));

  // =========================================================================
  // 1.5 FILTER / REFINE EXISTING SEARCH RESULTS
  // Follow-up refinement on current results (e.g. "show cheaper ones", "only AC")
  // =========================================================================
  const isFilterIntent =
    !isFreshSearch &&
    searchResults.length > 0 &&
    (nlu.intent === INTENTS.FILTER_RESULTS ||
      qLower.includes('cheaper') ||
      qLower.includes('faster') ||
      qLower.includes('only ac') ||
      qLower.includes('only sleeper') ||
      (agentCtx.travelRequest.bus_type && agentCtx.travelRequest.bus_type !== oldTravelReq.bus_type) ||
      (agentCtx.travelRequest.priority && agentCtx.travelRequest.priority !== oldTravelReq.priority) ||
      (agentCtx.travelRequest.max_price && agentCtx.travelRequest.max_price !== oldTravelReq.max_price));

  if (isFilterIntent) {
    let filtered = [...searchResults];

    if (agentCtx.travelRequest.bus_type) {
      const bt = agentCtx.travelRequest.bus_type.toLowerCase();
      const typeMatches = filtered.filter((b) => b.busType && b.busType.toLowerCase().includes(bt));
      if (typeMatches.length > 0) {
        filtered = typeMatches;
      }
    }

    if (agentCtx.travelRequest.max_price) {
      const priceMatches = filtered.filter((b) => b.price <= agentCtx.travelRequest.max_price);
      if (priceMatches.length > 0) {
        filtered = priceMatches;
      }
    }

    if (agentCtx.travelRequest.priority === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (agentCtx.travelRequest.priority === 'time') {
      filtered.sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration));
    }

    const ranking = rankBuses(filtered, agentCtx.travelRequest);
    const topBus = ranking.bestBus || filtered[0];

    params = {
      ...params,
      searchResults: filtered,
      recommendation: ranking,
      selectedBus: topBus,
      selectedSlot: topBus?.slots?.[0] || { time: topBus?.departureTime || '08:30 PM', fare: `₹${topBus?.price || 680}`, status: 'available' }
    };
    agentCtx = updateSearchContext(agentCtx, { results: filtered, selectedBus: topBus, selectedSlot: params.selectedSlot });
    agentState = { ...agentState, agentCtx };

    const srcCity = params.source || agentCtx.travelRequest.source;
    const dstCity = params.destination || agentCtx.travelRequest.destination;
    let responseText = `Here are the filtered buses for **${srcCity} → ${dstCity}**:\n\n`;
    filtered.slice(0, 3).forEach((b, idx) => {
      const isTop = topBus && b.id === topBus.id;
      responseText += `${idx + 1}. **${b.operator} - ${b.busName}** (${b.busType}) ${isTop ? '⭐ *Recommended*' : ''}\n`;
      responseText += `   • Dep: **${b.departureTime}** → Arr: **${b.arrivalTime}** (${b.duration}) | Fare: **₹${b.price}** | Seats: **${b.availableSeats} open**\n`;
    });

    if (topBus && ranking.reasons && ranking.reasons.length > 0) {
      responseText += `\n💡 **Why ${topBus.busName}?** ${ranking.reasons.join('. ')}.\n`;
    }
    if (ranking.warnings && ranking.warnings.length > 0) {
      responseText += `\n⚠️ *Note:* ${ranking.warnings.join('. ')}.\n`;
    }

    responseText += `\nWhich bus would you like to select? (e.g. "Select the first one" or "Show available seats")`;

    return {
      agentState: {
        ...agentState,
        state: 'WAITING_FOR_BUS_SELECTION',
        params,
        searchResults: filtered,
        recommendation: ranking,
        selectedBus: topBus,
        agentCtx
      },
      statusTrace: ['Applied your filters to available buses.'],
      text: responseText,
      searchResults: filtered,
      recommendation: ranking,
      actionCard: {
        title: `Select Recommended Bus (${topBus ? topBus.busName : 'Bus'})`,
        btnText: 'Select Recommended Bus & Check Seats 🪑',
        chatQuery: 'Select the recommended one'
      },
      chips: [
        'Select the recommended one',
        'Select the cheapest one',
        'Show available seats'
      ]
    };
  }

  // =========================================================================
  // 1. ROUTE / BUS SEARCH INTENT
  // =========================================================================
  if (isFreshSearch || currentState === 'IDLE' || currentState === 'COLLECTING_INFORMATION') {
    // NLU and contextManager take priority over old extractTravelParams results
    const source = agentCtx.travelRequest.source || nlu.entities.source || newlyExtracted.source || params.source || null;
    const destination = agentCtx.travelRequest.destination || nlu.entities.destination || newlyExtracted.destination || params.destination || null;
    const date = agentCtx.travelRequest.date || nlu.entities.date || newlyExtracted.date || params.date || new Date().toISOString().split('T')[0];
    const preferredTime = agentCtx.travelRequest.departure_after || nlu.constraints.departure_after || newlyExtracted.preferredTime || params.preferredTime || null;

    params = {
      ...params,
      source,
      destination,
      date,
      preferredTime,
      bus_type: agentCtx.travelRequest.bus_type,
      max_price: agentCtx.travelRequest.max_price
    };

    if (!destination && !source) {
      return {
        agentState: { ...agentState, state: 'COLLECTING_INFORMATION', params, agentCtx },
        statusTrace: [],
        text: 'I can help you search and compare available buses! 🚌\n\nWhere would you like to travel from and to? (e.g. "Find buses from Kanpur to Delhi tomorrow")',
        chips: ['Find buses from Kanpur to Delhi tomorrow', 'Find buses from Kanpur to Delhi around 9 PM', 'Search Kanpur to Lucknow']
      };
    }

    if (destination && !source) {
      return {
        agentState: { ...agentState, state: 'COLLECTING_INFORMATION', params, agentCtx },
        statusTrace: [],
        text: `Sure, I can find buses heading to ${destination}! 📍\n\nWhere will you be traveling from?`,
        chips: [`From Kanpur to ${destination}`, `From Lucknow to ${destination}`, `From Jaipur to ${destination}`]
      };
    }

    if (source && !destination) {
      return {
        agentState: { ...agentState, state: 'COLLECTING_INFORMATION', params, agentCtx },
        statusTrace: [],
        text: `Got it! Starting from ${source}. 🚌\n\nWhere are you heading to?`,
        chips: [`To Delhi`, `To Lucknow`, `To Agra`]
      };
    }

    statusTrace.push('Understanding your travel request...');
    statusTrace.push('Searching available buses...');

    const toolResult = await search_buses({
      source,
      destination,
      date,
      preferredTime
    });
    statusTrace.push('Comparing the available options...');

    if (!toolResult.success || !toolResult.results || toolResult.results.length === 0) {
      return {
        agentState: { ...agentState, state: 'COLLECTING_INFORMATION', params, agentCtx },
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

    const decision = findBestAndAlternativeBuses(toolResult.results, agentCtx.travelRequest);
    const topBus = decision.bestBus;
    const ranking = {
      bestBus: topBus,
      score: decision.score,
      reasons: decision.reasons,
      warnings: decision.warnings,
      rankedBuses: decision.rankedBuses,
    };

    params = {
      ...params,
      searchResults: toolResult.results,
      recommendation: ranking,
      selectedBus: topBus,
      selectedSlot: topBus?.slots?.[0] || { time: topBus?.departureTime || '08:30 PM', fare: `₹${topBus?.price || 680}`, status: 'available' }
    };
    agentCtx = updateSearchContext(agentCtx, {
      results: toolResult.results,
      selectedBus: topBus,
      selectedSlot: params.selectedSlot
    });
    agentState = { ...agentState, agentCtx };

    let responseText = '';

    if (decision.hasExactMatches) {
      responseText = `I found **${decision.rankedBuses.length} bus(es)** for **${source} → ${destination}** on ${date}:\n\n`;
      decision.rankedBuses.slice(0, 3).forEach((item, idx) => {
        const b = item.bus;
        const isTop = topBus && b.id === topBus.id;
        responseText += `${idx + 1}. **${b.operator} - ${b.busName}** (${b.busType}) ${isTop ? '⭐ *Recommended*' : ''}\n`;
        responseText += `   • Dep: **${b.departureTime}** → Arr: **${b.arrivalTime}** (${b.duration}) | Fare: **₹${b.price}** | Seats: **${b.availableSeats} open**\n`;
      });

      if (topBus && decision.reasons && decision.reasons.length > 0) {
        responseText += `\n💡 **Why ${topBus.busName}?** ${decision.reasons.join('. ')}.\n`;
      }
      if (decision.warnings && decision.warnings.length > 0) {
        responseText += `\n⚠️ *Note:* ${decision.warnings.join('. ')}.\n`;
      }
      responseText += `\nWhich bus would you like to select? (e.g. "I want the recommended one", "Select the second one", or "Show available seats")`;
    } else {
      // Impossible / conflicting constraints handling
      responseText = `⚠️ **Goal Analysis:** ${decision.conflictSummary}.\n\nHere are the closest matching alternatives:\n\n`;
      decision.alternatives.forEach((alt, idx) => {
        const b = alt.bus;
        responseText += `${idx + 1}. **${b.operator} - ${b.busName}** (${b.busType}) | Fare: **₹${b.price}** | Dep: **${b.departureTime}** → Arr: **${b.arrivalTime}**\n`;
        responseText += `   👉 *Trade-off:* ${alt.tradeOffReason}\n\n`;
      });
      responseText += `Which option would you prefer to select? (e.g. "Select the first one" or "Show seats")`;
    }

    return {
      agentState: {
        ...agentState,
        state: 'WAITING_FOR_BUS_SELECTION',
        params,
        searchResults: toolResult.results,
        recommendation: ranking,
        selectedBus: topBus,
        agentCtx
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

    agentCtx = updateSearchContext(agentCtx, { selectedBus: busObj, selectedSlot: defaultSlot });
    agentCtx = updateSeatsContext(agentCtx, { available: seatData.availableSeats });
    agentState = { ...agentState, agentCtx };

    const openCount = seatData.availableSeats.length;

    // Step 3: Compute recommended seats & layout for interactive chatbot seat map
    const recSeatResult = recommendSeats({
      busId: busObj.id,
      busType: busObj.busType,
      seatPreference: agentCtx.travelRequest.seat_preference,
      passengers: agentCtx.travelRequest.passengers || 1,
      availableSeats: seatData.availableSeats,
    });
    const recommendedSeats = recSeatResult.recommendedSeats || [];
    const seatLayout = getBusSeatLayout(
      busObj.id,
      params.date,
      slotTime,
      params.selectedSeats || [],
      recommendedSeats,
      busObj.busType
    );

    let recReasonText = '';
    if (recommendedSeats.length > 0 && recSeatResult.reasons.length > 0) {
      recReasonText = `\n\n💡 **Tixie's Recommendation:** I recommend seat **${recommendedSeats.join(' and ')}** (${recSeatResult.reasons.join(', ')}).`;
    }

    return {
      agentState: {
        ...agentState,
        state: 'WAITING_FOR_SEAT_SELECTION',
        params,
        selectedBus: busObj,
        selectedSlot: defaultSlot,
        availableSeats: seatData.availableSeats,
        agentCtx
      },
      statusTrace: ['Bus selected.', 'Seats verified.'],
      text: `Selected **${busObj.operator} - ${busObj.busName}** (${busObj.busType}) for ${params.source} → ${params.destination}.\n` +
        `• Departure: **${busObj.departureTime}** | Fare: **₹${busObj.price}/seat**\n\n` +
        `💺 **Available Seats (${openCount}/${seatData.totalSeats}):**\n` +
        `Click any seat on the map below to select or change.${recReasonText}`,
      seatMap: {
        busId: busObj.id,
        busName: busObj.busName,
        operator: busObj.operator,
        fare: busObj.price,
        date: params.date,
        slotTime,
        totalSeats: seatData.totalSeats,
        availableSeats: seatData.availableSeats,
        occupiedSeats: seatData.occupiedSeats,
        selectedSeats: params.selectedSeats || [],
        recommendedSeats,
        rows: seatLayout.rows,
      },
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
      chips: recommendedSeats.length > 0
        ? [`Select ${recommendedSeats.join(' and ')}`, 'Show available seats', 'Select another bus']
        : ['Book S3 and S4', 'Select S5 and S6', 'Select another bus']
    };
  }

  // =========================================================================
  // 3. SEAT AVAILABILITY CHECK INTENT
  // =========================================================================
  const isSeatCheckIntent = qLower.includes('seat') && (qLower.includes('show') || qLower.includes('check') || qLower.includes('available') || qLower.includes('what') || qLower.includes('map'));

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

    // Step 3: Compute recommended seats & layout
    const recSeatResult = recommendSeats({
      busId: selectedBus.id,
      busType: selectedBus.busType,
      seatPreference: agentCtx.travelRequest.seat_preference,
      passengers: agentCtx.travelRequest.passengers || 1,
      availableSeats: seatData.availableSeats,
    });
    const recommendedSeats = recSeatResult.recommendedSeats || [];
    const seatLayout = getBusSeatLayout(
      selectedBus.id,
      params.date,
      slotTime,
      params.selectedSeats || [],
      recommendedSeats,
      selectedBus.busType
    );

    let recReasonText = '';
    if (recommendedSeats.length > 0 && recSeatResult.reasons.length > 0) {
      recReasonText = `\n\n💡 **Tixie's Recommendation:** I recommend seat **${recommendedSeats.join(' and ')}** (${recSeatResult.reasons.join(', ')}).`;
    }

    return {
      agentState: {
        ...agentState,
        state: 'WAITING_FOR_SEAT_SELECTION',
        params,
        availableSeats: seatData.availableSeats,
        agentCtx
      },
      statusTrace,
      text: `Checked seat map for **${selectedBus.busName}** (${slotTime}):\n\n` +
        `💺 **Available Seats (${openCount}/${seatData.totalSeats}):**\n` +
        `Click any seat below to select or deselect.${recReasonText}`,
      seatMap: {
        busId: selectedBus.id,
        busName: selectedBus.busName,
        operator: selectedBus.operator,
        fare: selectedBus.price,
        date: params.date,
        slotTime,
        totalSeats: seatData.totalSeats,
        availableSeats: seatData.availableSeats,
        occupiedSeats: seatData.occupiedSeats,
        selectedSeats: params.selectedSeats || [],
        recommendedSeats,
        rows: seatLayout.rows,
      },
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
      chips: recommendedSeats.length > 0
        ? [`Select ${recommendedSeats.join(' and ')}`, 'Choose best seats for 2 people', 'Select another bus']
        : ['Book S3 and S4', 'Select S5 and S6', 'Select another bus']
    };
  }

  // =========================================================================
  // 4. SEAT SELECTION & ATOMIC VALIDATION INTENT
  // =========================================================================
  const extractedSeats = extractSeatIDs(q);
  const isSeatSelectIntent = extractedSeats.length > 0 || (qLower.includes('seat') && (qLower.includes('choose') || qLower.includes('select') || qLower.includes('book') || qLower.includes('people') || qLower.includes('passenger') || qLower.includes('adjacent') || qLower.includes('together') || qLower.includes('window') || qLower.includes('lower') || qLower.includes('upper') || qLower.includes('recommend')));

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

    // Goal-based natural language seat preferences (adjacent, window, berth, etc.)
    if (targetSeats.length === 0) {
      const isAdjacentReq = qLower.includes('adjacent') || qLower.includes('together') || (agentCtx.travelRequest.seat_preference?.type === 'adjacent');
      const isWindowReq = qLower.includes('window') || (agentCtx.travelRequest.seat_preference?.type === 'window');

      const numMatch = q.match(/(\d+)\s*(?:people|passengers|seats)?/i);
      const countNeeded = numMatch ? parseInt(numMatch[1], 10) : (agentCtx.travelRequest.passengers || 2);

      const { availableSeats } = await check_seat_availability({
        busId: selectedBus.id,
        date: params.date,
        slot: slotTime
      });

      if (isAdjacentReq) {
        const found = findAdjacentSeats(availableSeats, countNeeded, { front: true });
        if (found) targetSeats = found;
      } else if (isWindowReq) {
        const rec = recommendSeats({
          busId: selectedBus.id,
          busType: selectedBus.busType,
          seatPreference: { type: 'window' },
          passengers: countNeeded,
          availableSeats
        });
        if (rec.recommendedSeats.length > 0) targetSeats = rec.recommendedSeats;
      }

      if (targetSeats.length === 0) {
        const rec = recommendSeats({
          busId: selectedBus.id,
          busType: selectedBus.busType,
          seatPreference: agentCtx.travelRequest.seat_preference,
          passengers: countNeeded,
          availableSeats
        });
        targetSeats = rec.recommendedSeats.slice(0, countNeeded);
      }
    }

    // ATOMIC TOOL CALL: hold_select_seats
    const holdResult = await hold_select_seats({
      busId: selectedBus.id,
      date: params.date,
      slot: slotTime,
      seats: targetSeats,
      farePerSeat
    });

    // ATOMICITY REJECTION HANDLER (with smart conflict recovery)
    if (!holdResult.success) {
      const altSeats = holdResult.suggestedAlternatives || [];
      const chips = [];
      if (altSeats.length > 0) {
        chips.push(`Select ${altSeats.join(' and ')}`);
      }
      chips.push('Show available seats', 'Select another bus');

      const layout = getBusSeatLayout(
        selectedBus.id,
        params.date,
        slotTime,
        [],
        altSeats,
        selectedBus.busType
      );

      return {
        agentState: {
          ...agentState,
          state: 'WAITING_FOR_SEAT_SELECTION',
          params,
          agentCtx
        },
        statusTrace,
        text: `⚠️ **Seat Selection Notice:**\n${holdResult.error}\n\n*No seats were committed due to atomic availability checks.*`,
        seatMap: {
          busId: selectedBus.id,
          busName: selectedBus.busName,
          operator: selectedBus.operator,
          fare: selectedBus.price,
          date: params.date,
          slotTime,
          totalSeats: 40,
          availableSeats: params.availableSeats || [],
          occupiedSeats: params.occupiedSeats || [],
          selectedSeats: [],
          recommendedSeats: altSeats,
          rows: layout.rows
        },
        chips
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

    agentCtx = updateSeatsContext(agentCtx, { selected: validatedSeats });
    agentState = { ...agentState, agentCtx };

    const successLayout = getBusSeatLayout(
      selectedBus.id,
      params.date,
      slotTime,
      validatedSeats,
      [],
      selectedBus.busType
    );

    // Check if user ALSO provided passenger details in this message or if activeUser is logged in
    let pd = { ...(agentState.passengerDetails || {}) };

    if (activeUser) {
      if (!pd.name && (activeUser.name || activeUser.fullName)) {
        pd.name = (activeUser.name || activeUser.fullName).trim();
      }
      if (!pd.email && activeUser.email) {
        pd.email = activeUser.email.toLowerCase().trim();
      }
      if (!pd.mobile && activeUser.mobile) {
        pd.mobile = activeUser.mobile.replace(/\D/g, '');
      }
    }

    // Check name from query
    const nameMatch = q.match(/(?:my name is|i['']?m|name is|passenger(?:'s)? name is|call me)\s+([A-Za-z][A-Za-z\s]{1,39})/i);
    if (nameMatch) pd.name = nameMatch[1].trim();

    // Check email from query
    const emailMatch = q.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) pd.email = emailMatch[0].toLowerCase();

    // Check mobile from query
    const cleaned = q.replace(/[\s\-().]/g, '');
    const mobileMatch = cleaned.match(/(?:\+91)?([6-9]\d{9})/);
    if (mobileMatch) pd.mobile = mobileMatch[1];

    const isNameValid = pd.name && pd.name.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(pd.name.trim());
    const isEmailValid = pd.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pd.email);
    const isMobileValid = pd.mobile && /^[6-9]\d{9}$/.test(pd.mobile.replace(/\D/g, ''));

    // If all passenger details already provided:
    if (isNameValid && isEmailValid && isMobileValid) {
      return buildBookingSummaryResponse({
        agentState,
        params,
        selectedBus,
        selectedSlot,
        selectedSeats: validatedSeats,
        pd,
        slotTime,
        statusTrace: ['Seats validated atomically.', 'Passenger info ready.']
      });
    }

    let firstPrompt = "Great, your seats are selected. What name should I use for the passenger?";
    if (isNameValid && !isEmailValid) {
      firstPrompt = `Thanks, **${pd.name}**! What email address should I use for the ticket?`;
    } else if (isNameValid && isEmailValid && !isMobileValid) {
      firstPrompt = "What 10-digit Indian mobile number should I use for ticket notifications?";
    }

    return {
      agentState: {
        ...agentState,
        state: 'COLLECTING_PASSENGER_INFO',
        params,
        selectedSeats: validatedSeats,
        passengerDetails: pd,
        totalFare: baseFare,
        agentCtx
      },
      statusTrace: ['Seats reserved atomically.'],
      text: `🎉 **Seats ${validatedSeats.join(', ')} validated successfully!**\n\n` +
        `• **Bus:** ${selectedBus.operator} - ${selectedBus.busName}\n` +
        `• **Route:** ${params.source} → ${params.destination} (${params.date} at ${slotTime})\n` +
        `• **Fare:** ₹${baseFare} (${validatedSeats.length} seat${validatedSeats.length > 1 ? 's' : ''})\n\n` +
        firstPrompt,
      seatMap: {
        busId: selectedBus.id,
        busName: selectedBus.busName,
        operator: selectedBus.operator,
        fare: selectedBus.price,
        date: params.date,
        slotTime,
        totalSeats: 40,
        availableSeats: params.availableSeats || [],
        occupiedSeats: params.occupiedSeats || [],
        selectedSeats: validatedSeats,
        recommendedSeats: [],
        rows: successLayout.rows
      },
      chips: isNameValid ? (isEmailValid ? ['9876543210', 'Cancel'] : ['Cancel']) : ['Anshika Verma', 'Rahul Sharma', 'Change seats', 'Cancel']
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
    if (activeUser) {
      if (!pd.name && (activeUser.name || activeUser.fullName)) {
        pd.name = (activeUser.name || activeUser.fullName).trim();
      }
      if (!pd.email && activeUser.email) {
        pd.email = activeUser.email.toLowerCase().trim();
      }
      if (!pd.mobile && activeUser.mobile) {
        pd.mobile = activeUser.mobile.replace(/\D/g, '');
      }
    }

    const slotTime = selectedSlot?.time || selectedBus?.departureTime || '08:30 PM';

    // Cancel / abort handler
    const CANCEL_PHRASES = ['cancel', 'abort', "don't book", 'dont book', 'not now', 'stop', 'never mind', 'no thanks'];
    const isCancelNow = qLower === 'no' || CANCEL_PHRASES.some((p) => qLower === p || qLower.startsWith(p));
    if (isCancelNow && currentState !== 'WAITING_FOR_CANCEL_CONFIRMATION') {
      return {
        agentState: { state: 'IDLE', params: {}, agentCtx: resetTravelContext(agentCtx) },
        statusTrace: [],
        text: "❌ Booking cancelled. No problem, I haven't charged or created any booking.\n\nFeel free to search for another trip anytime!",
        chips: ['Find buses from Kanpur to Delhi tomorrow', 'Search Kanpur to Lucknow', 'Search Delhi to Jaipur']
      };
    }

    // Change request handlers
    if (qLower.includes('change bus') || qLower.includes('different bus') || qLower.includes('another bus') || qLower.includes('second bus') || qLower.includes('cheaper bus') || qLower.includes('choose the other')) {
      const newlySelected = findSelectedBusFromQuery(q, searchResults, recommendation);
      if (newlySelected && newlySelected.id !== selectedBus?.id) {
        selectedBus = newlySelected;
        selectedSeats = [];
        params = { ...params, selectedBus: newlySelected, selectedSeats: [] };
        agentCtx = updateSearchContext(agentCtx, { selectedBus: newlySelected });
        agentCtx = updateSeatsContext(agentCtx, { selected: [] });

        const seatData = await check_seat_availability({
          busId: selectedBus.id,
          date: params.date,
          slot: selectedBus.departureTime
        });

        const recSeats = recommendSeats({
          busId: selectedBus.id,
          busType: selectedBus.busType,
          seatPreference: agentCtx.travelRequest.seat_preference,
          passengers: agentCtx.travelRequest.passengers || 1,
          availableSeats: seatData.availableSeats
        });

        const layout = getBusSeatLayout(
          selectedBus.id,
          params.date,
          selectedBus.departureTime,
          [],
          recSeats.recommendedSeats || [],
          selectedBus.busType
        );

        return {
          agentState: {
            ...agentState,
            state: 'WAITING_FOR_SEAT_SELECTION',
            params,
            selectedBus,
            selectedSeats: [],
            passengerDetails: pd,
            agentCtx
          },
          statusTrace: ['Updated bus selection.'],
          text: `Updated bus to **${selectedBus.busName}** (${selectedBus.operator}, ₹${selectedBus.price}).\n\nPrevious seat selection was reset for the new bus. Please choose your seats on the seat map below:`,
          seatMap: {
            busId: selectedBus.id,
            busName: selectedBus.busName,
            operator: selectedBus.operator,
            fare: selectedBus.price,
            date: params.date,
            slotTime: selectedBus.departureTime,
            totalSeats: seatData.totalSeats,
            availableSeats: seatData.availableSeats,
            occupiedSeats: seatData.occupiedSeats,
            selectedSeats: [],
            recommendedSeats: recSeats.recommendedSeats || [],
            rows: layout.rows
          },
          chips: recSeats.recommendedSeats?.length > 0
            ? [`Select ${recSeats.recommendedSeats.join(' and ')}`, 'Show available seats']
            : ['Show available seats', 'Select another bus']
        };
      }

      return {
        agentState: { ...agentState, state: 'WAITING_FOR_BUS_SELECTION', params, passengerDetails: pd },
        statusTrace: [],
        text: "Sure! Which bus would you like instead? You can say 'cheapest', 'fastest', or a bus name.",
        chips: ['Select the recommended one', 'Select the cheapest one', 'Select the fastest one']
      };
    }

    if (qLower.includes('change seat') || qLower.includes('different seat') || qLower.includes('another seat') || qLower.includes('change to s') || qLower.includes('choose seats')) {
      const explicitNewSeats = extractSeatIDs(q);
      if (explicitNewSeats.length > 0 && selectedBus) {
        const holdResult = await hold_select_seats({
          busId: selectedBus.id,
          date: params.date,
          slot: slotTime,
          seats: explicitNewSeats,
          farePerSeat: selectedBus.price || 599
        });

        if (!holdResult.success) {
          return {
            agentState: { ...agentState, state: 'WAITING_FOR_SEAT_SELECTION', params },
            statusTrace: [],
            text: `⚠️ **Seat Selection Notice:**\n${holdResult.error}\n\nWould you like to choose different seats?`,
            chips: ['Show available seats', 'Cancel']
          };
        }

        selectedSeats = holdResult.seats;
        params = { ...params, selectedSeats, baseFare: holdResult.totalFare, totalFare: holdResult.totalFare };
        agentCtx = updateSeatsContext(agentCtx, { selected: selectedSeats });

        if (pd.name && pd.email && pd.mobile) {
          return buildBookingSummaryResponse({
            agentState,
            params,
            selectedBus,
            selectedSlot,
            selectedSeats,
            pd,
            slotTime,
            statusTrace: [`Seats updated to ${selectedSeats.join(', ')}.`]
          });
        }
      }

      return {
        agentState: { ...agentState, state: 'WAITING_FOR_SEAT_SELECTION', params, passengerDetails: pd },
        statusTrace: [],
        text: "No problem! Which seats would you like instead? (e.g. S5 and S6)",
        chips: ['Book S5 and S6', 'Book S8 and S9', 'Show available seats']
      };
    }

    if (qLower.includes('change passenger') || qLower.includes('change name') || qLower.includes('different name') || qLower.includes('use another name') || qLower.includes('update name')) {
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
          statusTrace: [`Passenger name updated to ${pd.name}.`]
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

    if (qLower.includes('change email') || qLower.includes('different email') || qLower.includes('use another email') || qLower.includes('update email')) {
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

    if (qLower.includes('change phone') || qLower.includes('change mobile') || qLower.includes('different number') || qLower.includes('use another number') || qLower.includes('update phone') || qLower.includes('update mobile')) {
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
    const CASUAL_AFFIRMATIONS = ['okay', 'ok', 'looks good', 'continue', 'next', 'show me the ticket', 'cool', 'fine', 'sure', 'sounds good'];
    const isCasualAffirmation = CASUAL_AFFIRMATIONS.some((p) => qLower === p || qLower.startsWith(p + ' '));

    if (isCasualAffirmation && currentState === 'BOOKING_SUMMARY') {
      const fareToShow = agentState.totalFare || (selectedSeats.length * (selectedBus?.price || 0));
      return {
        agentState,
        statusTrace: [],
        text: 'To prevent accidental reservations, please explicitly confirm by typing **"Confirm booking"** or **"Yes, book it"**, or tap **Confirm Booking** below.',
        actionCard: {
          title: `Confirm Booking for ${selectedSeats.join(', ')} (₹${fareToShow})`,
          btnText: 'Confirm Booking ✅',
          chatQuery: 'Confirm booking'
        },
        chips: ['Confirm booking', 'Change details', 'Cancel']
      };
    }

    const EXPLICIT_CONFIRM_PHRASES = [
      'confirm', 'confirm booking', 'yes, confirm', 'yes confirm',
      'yes, book it', 'yes book it', 'book it', 'book now',
      'please confirm', 'confirm it', 'yes, please confirm'
    ];

    const isExplicitConfirm = EXPLICIT_CONFIRM_PHRASES.some((p) => {
      if (qLower === p) return true;
      const regex = new RegExp(`\\b${p.replace(',', '')}\\b`, 'i');
      return regex.test(qLower.replace(/[.,!]/g, ' '));
    });

    if (isExplicitConfirm && currentState === 'BOOKING_SUMMARY') {
      // 1. Check Authentication Gate
      if (!activeUser) {
        return {
          agentState: { ...agentState, state: 'BOOKING_SUMMARY', params },
          statusTrace: ['Authentication required before booking commitment.'],
          text: '⚠️ **Sign In Required:** Please sign in before I complete your booking. Your selected seats and details are saved.',
          actionCard: {
            title: 'Sign In to GoTicket',
            btnText: 'Sign In Now 👤',
            navigateTo: '/login',
            openAuth: true
          },
          chips: ['Sign In', 'Cancel']
        };
      }

      // 2. Validate Passenger Details
      if (!pd.name || !pd.email || !pd.mobile) {
        return {
          agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params },
          statusTrace: [],
          text: 'I still need complete passenger details before booking. What name should I use?',
          chips: []
        };
      }

      // 3. Duplicate / Idempotency Protection
      const idempotencyKey = `GT_BOOK_${selectedBus?.id}_${params.date}_${slotTime}_${selectedSeats.slice().sort().join('_')}_${pd.mobile}`;
      if (agentState.isBookingInProgress) {
        return {
          agentState,
          statusTrace: [],
          text: '⏳ Your booking is already being processed. Please wait a moment...',
          chips: []
        };
      }

      if (agentState.state === 'CONFIRMED' && agentState.confirmedTicket) {
        const existing = agentState.confirmedTicket;
        return {
          agentState,
          statusTrace: [],
          text: `Your booking has already been confirmed! Your ticket ID is **${existing.ticketId}**.\n\n🚌 **${existing.name}** | 💺 Seats: ${(existing.seats || []).join(', ')}`,
          actionCard: {
            title: `View E-Ticket (${existing.ticketId})`,
            btnText: 'View E-Ticket 🎫',
            navigateTo: '/eticket'
          },
          chips: ['View E-Ticket 🎫', 'Book another trip']
        };
      }

      statusTrace.push('Validating final seat availability...');
      statusTrace.push('Processing demo payment authorization...');
      statusTrace.push('Committing ticket with booking service...');

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

      const bookingResult = await create_booking({
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
        totalFare,
        idempotencyKey
      });

      if (!bookingResult.success) {
        if (bookingResult.seatValidationFailed) {
          const alt = bookingResult.suggestedAlternatives || [];
          const altText = alt.length > 0 ? ` I found **${alt.join(' and ')}** as available alternatives.` : '';
          return {
            agentState: { ...agentState, state: 'WAITING_FOR_SEAT_SELECTION', params, selectedSeats: [] },
            statusTrace: ['Atomic seat check rejected booking.'],
            text: `⚠️ **Seat Availability Notice:**\n${selectedSeats.join(', ')} is no longer available, so I haven't completed the booking.${altText}\n\nWould you like to select available seats?`,
            chips: alt.length > 0 ? [`Select ${alt.join(' and ')}`, 'Show available seats', 'Cancel'] : ['Show available seats', 'Select another bus']
          };
        }

        if (bookingResult.reconciliationRequired) {
          return {
            agentState: { ...agentState, state: 'RECONCILIATION_PENDING', params },
            statusTrace: ['Payment authorized; downstream booking synchronization pending.'],
            text: `⚠️ **Transaction Reconciliation Notice:**\n${bookingResult.error}\n\nReference: ${bookingResult.transactionId}`,
            chips: ['Contact Support 📞', 'Book another trip']
          };
        }

        return {
          agentState: { ...agentState, state: 'BOOKING_SUMMARY', params },
          statusTrace: ['Booking could not be created.'],
          text: `⚠️ **Booking could not be completed:**\n${bookingResult.error}\n\nWould you like to try again or change details?`,
          chips: ['Confirm booking', 'Change seats', 'Cancel']
        };
      }

      const ticket = bookingResult.ticket;
      const maskedEmail = maskEmail(pd.email);
      const maskedMobile = maskMobile(pd.mobile);

      return {
        agentState: {
          ...agentState,
          state: 'CONFIRMED',
          params,
          confirmedTicket: ticket,
          ticketId: ticket.ticketId,
          passengerDetails: pd,
          totalFare
        },
        statusTrace: ['Payment authorized (Demo).', 'Ticket confirmed.', 'Demo notifications prepared.'],
        text: `🎉 **Your booking is confirmed!**\n\n` +
          `Your ticket ID is **${ticket.ticketId}**.\n\n` +
          `🚌 **Bus:** ${ticket.name} (${ticket.type || 'AC'})\n` +
          `📍 **Route:** ${ticket.route}\n` +
          `📅 **Date:** ${ticket.date}  ⏰ **Departure:** ${ticket.time}\n` +
          `💺 **Seats:** ${(ticket.seats || []).join(', ')}\n` +
          `👤 **Passenger:** ${pd.name} (${maskedEmail} | ${maskedMobile})\n` +
          `💰 **Total Fare:** ₹${ticket.totalFare}\n\n` +
          `📩 *Demo notification prepared for ${maskedEmail} and ${maskedMobile}.*`,
        actionCard: {
          title: `Official E-Ticket (${ticket.ticketId})`,
          btnText: 'View E-Ticket 🎫',
          navigateTo: '/eticket'
        },
        chips: ['View E-Ticket 🎫', 'Book another trip']
      };
    }

    if (currentState === 'BOOKING_SUMMARY') {
      const fareToShow = agentState.totalFare || (selectedSeats.length * (selectedBus?.price || 0));
      return {
        agentState,
        statusTrace: [],
        text: 'Would you like me to confirm this booking?\n\n• Type **"Confirm booking"** or tap **[ Confirm Booking ]** below.\n• Type **"Change seats"**, **"Change passenger"**, or **"Cancel"** to abort.',
        actionCard: {
          title: `Confirm Booking for ${selectedSeats.join(', ')} (₹${fareToShow})`,
          btnText: 'Confirm Booking ✅',
          chatQuery: 'Confirm booking'
        },
        chips: ['Confirm booking', 'Change seats', 'Change passenger', 'Cancel']
      };
    }

    // =======================================================================
    // SEQUENTIAL PASSENGER EXTRACTION (ONE AT A TIME)
    // =======================================================================
    if (!pd.name) {
      const nameMatch = q.match(/(?:my name is|i['']?m|name is|call me)\s+([A-Za-z][A-Za-z\s]{1,39})/i) ||
                        q.match(/^([A-Za-z][A-Za-z\s]{1,39})$/);
      const candidateName = nameMatch ? nameMatch[1].trim() : q.trim();
      const reserved = ['yes', 'no', 'cancel', 'confirm', 'book', 'stop', 'done', 'help', 'hi', 'hello', 'okay', 'ok'];

      if (
        !candidateName ||
        candidateName.length < 3 ||
        !/^[a-zA-Z\s]+$/.test(candidateName) ||
        reserved.includes(candidateName.toLowerCase())
      ) {
        return {
          agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
          statusTrace: [],
          text: 'Please enter a valid passenger full name (at least 3 letters, e.g. "Anshika Verma").',
          chips: ['Anshika Verma', 'Rahul Sharma', 'Cancel']
        };
      }

      pd.name = candidateName;

      if (!pd.email) {
        return {
          agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
          statusTrace: ['Name received.'],
          text: `Thanks, **${pd.name}**! 👤\n\nWhat email address should I use for the ticket?`,
          chips: ['Cancel']
        };
      }
    }

    if (!pd.email) {
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const emailMatch = q.match(emailPattern);

      if (!emailMatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q.trim())) {
        return {
          agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
          statusTrace: [],
          text: 'Please provide a valid email address (e.g. anshika@example.com).',
          chips: ['Cancel']
        };
      }

      pd.email = emailMatch[0].toLowerCase();

      if (!pd.mobile) {
        return {
          agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
          statusTrace: ['Email received.'],
          text: `Got it! 📧\n\nWhat 10-digit Indian mobile number should I use for ticket notifications?`,
          chips: ['Cancel']
        };
      }
    }

    if (!pd.mobile) {
      const digits = q.replace(/\D/g, '');
      if (digits.length !== 10 || !/^[6-9]\d{9}$/.test(digits)) {
        return {
          agentState: { ...agentState, state: 'COLLECTING_PASSENGER_INFO', params, passengerDetails: pd },
          statusTrace: [],
          text: 'Please provide a valid 10-digit Indian mobile number starting with 6-9 (e.g. 9876543210).',
          chips: ['Cancel']
        };
      }

      pd.mobile = digits;
    }

    // ALL 3 ARE NOW PRESENT AND VALID
    if (pd.name && pd.email && pd.mobile) {
      return buildBookingSummaryResponse({
        agentState,
        params,
        selectedBus,
        selectedSlot,
        selectedSeats,
        pd,
        slotTime,
        statusTrace: ['All passenger details validated.']
      });
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

  const maskedEmail = maskEmail(pd.email);
  const maskedMobile = maskMobile(pd.mobile);

  const summaryText =
    `📋 **BOOKING SUMMARY**\n\n` +
    `📍 **${params.source} → ${params.destination}**\n` +
    `📅 **${params.date}**\n\n` +
    `🚌 **${selectedBus?.operator || ''} - ${selectedBus?.busName || ''}**\n` +
    `⏰ **Departure:** ${slotTime}\n` +
    (selectedBus?.arrivalTime ? `🏁 **Arrival:** ${selectedBus.arrivalTime}\n` : '') +
    `\n💺 **Seats:**\n${selectedSeats.join(', ')}\n\n` +
    `👤 **Passenger:**\n${pd.name}\n\n` +
    `📧 **Email:**\n${maskedEmail}\n\n` +
    `📱 **Mobile:**\n${maskedMobile}\n\n` +
    `💰 **Fare:**\n₹${totalFare}${discountAmount > 0 ? ` (Promo ${couponCode}: -₹${discountAmount})` : ''}\n\n` +
    `──────────────────────\n` +
    `Would you like me to confirm this booking?\n\n` +
    `• Tap **[ Confirm Booking ]** or type **"Confirm booking"**.\n` +
    `• To change details, type **"Change seats"**, **"Change passenger"**, or **"Cancel"**.`;

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
      chatQuery: 'Confirm booking'
    },
    chips: ['Confirm booking', 'Change seats', 'Change passenger', 'Cancel']
  };
}
