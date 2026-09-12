// GoTicket Booking Service — Single Source of Truth for Booking & Ticket Operations
// Manages: Pending Booking Preparation, Commit, Retrieval, Cancellation, and Idempotency Protection.

// In-memory idempotency cache for active session
const _idempotencyCache = new Map();

/**
 * Generates a GoTicket ticket ID in the format GT + 6 random alphanumeric chars.
 * @returns {string} e.g. "GT7AX9KP"
 */
export const generateTicketId = () =>
  'GT' + Math.random().toString(36).substring(2, 8).toUpperCase();

/**
 * Idempotency Helpers
 */
export const recordIdempotencyKey = (key, ticket) => {
  if (!key) return;
  _idempotencyCache.set(key, ticket);
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('idempotencyRecords') || '{}');
      stored[key] = { ticketId: ticket.ticketId, timestamp: Date.now() };
      localStorage.setItem('idempotencyRecords', JSON.stringify(stored));
    }
  } catch (e) {}
};

export const getBookingByIdempotencyKey = (key) => {
  if (!key) return null;
  if (_idempotencyCache.has(key)) {
    return _idempotencyCache.get(key);
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('idempotencyRecords') || '{}');
      if (stored[key]) {
        return getBooking(stored[key].ticketId);
      }
    }
  } catch (e) {}
  return null;
};

/**
 * Persists an updated booking ticket to both `lastTicket` and `userBookings` in localStorage.
 * @param {Object} ticket
 */
export const saveBooking = (ticket) => {
  if (!ticket || !ticket.ticketId) return;
  try {
    if (typeof localStorage !== 'undefined') {
      // Update lastTicket if it's the current one
      const last = getLastTicket();
      if (last && last.ticketId === ticket.ticketId) {
        localStorage.setItem('lastTicket', JSON.stringify(ticket));
      } else if (!last) {
        localStorage.setItem('lastTicket', JSON.stringify(ticket));
      }

      // Update userBookings list
      const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const idx = bookings.findIndex((b) => b.ticketId === ticket.ticketId);
      if (idx >= 0) {
        bookings[idx] = ticket;
      } else {
        bookings.push(ticket);
      }
      localStorage.setItem('userBookings', JSON.stringify(bookings));
    }
  } catch (e) {}
};

/**
 * Prepares a pending booking context from agent-collected data and saves to localStorage.
 * Does NOT create a finalized ticket or process payment.
 *
 * @param {Object} opts
 * @param {Object} opts.busDetails      - The selected bus object from mockBuses
 * @param {string} opts.slot            - Departure slot time e.g. "08:30 PM"
 * @param {string[]} opts.seats         - Validated seat labels e.g. ["S3","S4"]
 * @param {number} [opts.farePerSeat]   - Fare per seat in INR
 * @param {Object} [opts.boarding]      - Boarding point object (optional)
 * @param {Object} [opts.dropping]      - Dropping point object (optional)
 * @param {Object} opts.passenger       - { fullName, email, mobile }
 * @param {string} [opts.date]          - Travel date (YYYY-MM-DD)
 * @param {string} [opts.source]        - Source city
 * @param {string} [opts.destination]   - Destination city
 * @param {string} [opts.appliedCoupon] - Applied coupon code
 * @param {number} [opts.discountAmount]- Discount amount in INR
 * @param {number} [opts.totalFare]     - Total fare in INR
 * @returns {{ success: boolean, pendingBooking?: Object, error?: string }}
 */
export const preparePendingBooking = ({
  busDetails,
  slot,
  seats = [],
  farePerSeat = 0,
  boarding = {},
  dropping = {},
  passenger,
  date = '',
  source = '',
  destination = '',
  appliedCoupon = null,
  discountAmount = 0,
  totalFare
}) => {
  try {
    if (!busDetails || !busDetails.id) {
      return { success: false, error: 'Bus details are missing or invalid.' };
    }
    if (!seats || seats.length === 0) {
      return { success: false, error: 'No seats provided for booking.' };
    }
    if (!passenger || !passenger.fullName || !passenger.email || !passenger.mobile) {
      return { success: false, error: 'Passenger name, email, and mobile are required.' };
    }

    const price = farePerSeat || busDetails.price || 0;
    const baseFare = price * seats.length;
    const calculatedTotal = typeof totalFare === 'number' ? totalFare : Math.max(0, baseFare - (discountAmount || 0));

    const pendingBooking = {
      busDetails,
      name: busDetails.busName || busDetails.name || '',
      label: busDetails.busName || busDetails.name || '',
      id: busDetails.id,
      type: busDetails.busType || '',
      route: `${source || busDetails.source || ''} to ${destination || busDetails.destination || ''}`,
      source: source || busDetails.source || '',
      destination: destination || busDetails.destination || '',
      date: date || busDetails.date || '',
      time: slot || busDetails.departureTime || '',
      slot: slot || busDetails.departureTime || '',
      fare: `₹${price}`,
      price,
      seats,
      boarding,
      dropping,
      baseFare,
      appliedCoupon: appliedCoupon || null,
      discountAmount: discountAmount || 0,
      totalFare: calculatedTotal,
      passenger: {
        fullName: passenger.fullName.trim(),
        mobile: passenger.mobile,
        email: passenger.email.toLowerCase(),
        aadhaar: passenger.aadhaar || '••••••••9012',
        gender: passenger.gender || 'Male',
        age: passenger.age || 25
      },
      passengers: [{
        fullName: passenger.fullName.trim(),
        mobile: passenger.mobile,
        email: passenger.email.toLowerCase(),
        aadhaar: passenger.aadhaar || '••••••••9012',
        gender: passenger.gender || 'Male',
        age: passenger.age || 25
      }],
      createdAt: new Date().toISOString()
    };

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pendingBooking', JSON.stringify(pendingBooking));
      }
    } catch (e) {}

    return { success: true, pendingBooking };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to prepare booking context.' };
  }
};

/**
 * Finalizes a booking after successful confirmation/payment and persists the final ticket.
 * Clears the pending booking from localStorage.
 *
 * @param {Object} opts
 * @param {Object} opts.bookingData     - Pending or manual booking data
 * @param {string} [opts.paymentMethod] - 'upi' | 'card' | 'demo' | 'agent'
 * @param {Array}  [opts.passengers]    - Array of passenger objects
 * @param {string} [opts.ticketId]      - Optional pre-generated ticket ID
 * @returns {{ success: boolean, ticketId: string, ticket: Object }}
 */
export const finalizeBooking = ({
  bookingData = {},
  paymentMethod = 'demo',
  passengers = null,
  ticketId = null
}) => {
  const generatedId = ticketId || generateTicketId();
  const primaryPax = (passengers && passengers[0]) || bookingData.passenger || {};
  const allPax = passengers && passengers.length > 0 ? passengers : (bookingData.passengers || [primaryPax]);

  const price = bookingData.price || (bookingData.fare ? parseInt(String(bookingData.fare).replace(/[^\d]/g, ''), 10) : 0);
  const seats = bookingData.seats || [];
  const baseFare = bookingData.baseFare || (price * (seats.length || 1));
  const discountAmount = bookingData.discountAmount || 0;
  const totalFare = typeof bookingData.totalFare === 'number'
    ? bookingData.totalFare
    : Math.max(0, baseFare - discountAmount);

  const ticket = {
    ticketId: generatedId,
    status: 'CONFIRMED',
    name:          bookingData.name        || bookingData.busName || (bookingData.busDetails?.busName || ''),
    label:         bookingData.name        || bookingData.busName || (bookingData.busDetails?.busName || ''),
    id:            bookingData.id          || (bookingData.busDetails?.id || ''),
    type:          bookingData.type        || bookingData.busType || (bookingData.busDetails?.busType || ''),
    route:         bookingData.route       || `${bookingData.source || ''} => ${bookingData.destination || ''}`,
    source:        bookingData.source      || '',
    destination:   bookingData.destination || '',
    date:          bookingData.date        || '',
    time:          bookingData.time        || bookingData.slot    || (bookingData.busDetails?.departureTime || ''),
    fare:          price,
    seats,
    boarding:      bookingData.boarding    || {},
    dropping:      bookingData.dropping    || {},
    totalFare,
    appliedCoupon: bookingData.appliedCoupon || null,
    discountAmount,
    paymentMethod,
    passenger: {
      fullName: primaryPax.fullName ? primaryPax.fullName.trim() : '',
      mobile:   primaryPax.mobile || '',
      email:    primaryPax.email ? primaryPax.email.toLowerCase() : '',
      aadhaar:  primaryPax.aadhaar ? primaryPax.aadhaar.replace(/\d(?=\d{4})/g, '•') : '••••••••9012',
      gender:   primaryPax.gender || 'Male',
      age:      parseInt(primaryPax.age, 10) || 25
    },
    passengers: allPax.map((p) => ({
      fullName: p.fullName ? p.fullName.trim() : '',
      mobile:   p.mobile || '',
      email:    p.email ? p.email.toLowerCase() : '',
      aadhaar:  p.aadhaar ? p.aadhaar.replace(/\d(?=\d{4})/g, '•') : '••••••••9012',
      gender:   p.gender || 'Male',
      age:      parseInt(p.age, 10) || 25
    })),
    bookedAt: new Date().toISOString()
  };

  saveBooking(ticket);

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pendingBooking');
    }
  } catch (e) {}

  return { success: true, ticketId: generatedId, ticket };
};

/**
 * Creates a finalized booking directly with idempotency and validation.
 * Primary operation used by travelAgent and agentTools.
 *
 * @param {Object} opts
 * @returns {{ success: boolean, ticketId?: string, ticket?: Object, isDuplicate?: boolean, error?: string }}
 */
export const createBooking = ({
  busDetails,
  slot,
  seats,
  passenger,
  totalFare,
  date = '',
  source = '',
  destination = '',
  boarding = {},
  dropping = {},
  appliedCoupon = null,
  discountAmount = 0,
  paymentMethod = 'demo',
  paymentDetails = {},
  idempotencyKey = null
}) => {
  // Idempotency check to prevent duplicate ticket generation
  if (idempotencyKey) {
    const existing = getBookingByIdempotencyKey(idempotencyKey);
    if (existing) {
      return {
        success: true,
        isDuplicate: true,
        ticketId: existing.ticketId,
        ticket: existing
      };
    }
  }

  const prep = preparePendingBooking({
    busDetails,
    slot,
    seats,
    farePerSeat: busDetails?.price || 0,
    boarding,
    dropping,
    passenger,
    date: date || busDetails?.date || '',
    source: source || busDetails?.source || '',
    destination: destination || busDetails?.destination || '',
    appliedCoupon,
    discountAmount,
    totalFare
  });

  if (!prep.success) {
    return prep;
  }

  const finalRes = finalizeBooking({
    bookingData: prep.pendingBooking,
    paymentMethod,
    passengers: [passenger]
  });

  if (finalRes.success) {
    finalRes.ticket.paymentDetails = paymentDetails;
    if (idempotencyKey) {
      finalRes.ticket.idempotencyKey = idempotencyKey;
      recordIdempotencyKey(idempotencyKey, finalRes.ticket);
    }
    saveBooking(finalRes.ticket);
  }

  return finalRes;
};

/**
 * Convenience wrapper around createBooking (backwards compatible).
 */
export const createAgentBooking = ({
  busDetails,
  slot,
  seats,
  boarding = {},
  dropping = {},
  passenger,
  totalFare,
  date = '',
  source = '',
  destination = '',
  idempotencyKey = null
}) => {
  return createBooking({
    busDetails,
    slot,
    seats,
    boarding,
    dropping,
    passenger,
    totalFare,
    date,
    source,
    destination,
    paymentMethod: 'agent',
    idempotencyKey
  });
};

/**
 * Retrieves a booking record by ticket ID.
 * Checks `lastTicket` and `userBookings` storage.
 *
 * @param {string} ticketId
 * @returns {Object|null}
 */
export const getBooking = (ticketId) => {
  if (!ticketId) return null;
  const cleanId = ticketId.trim().toUpperCase();
  try {
    const last = getLastTicket();
    if (last && last.ticketId === cleanId) return last;

    if (typeof localStorage !== 'undefined') {
      const all = JSON.parse(localStorage.getItem('userBookings') || '[]');
      const found = all.find((b) => b.ticketId === cleanId);
      if (found) return found;
    }
  } catch (e) {}
  return null;
};

/**
 * Cancels a booking by ticket ID, verifying that the requesting user owns the ticket.
 *
 * @param {string} ticketId - GTXXXXXX
 * @param {Object} [user=null] - Authenticated user object { email, mobile, name }
 * @returns {{ success: boolean, ticketId?: string, cancelledTicket?: Object, message?: string, error?: string }}
 */
export const cancelBooking = (ticketId, user = null) => {
  if (!ticketId) {
    return { success: false, error: 'Ticket ID is required for cancellation.' };
  }

  const cleanId = ticketId.trim().toUpperCase();
  const booking = getBooking(cleanId);

  if (!booking) {
    return { success: false, error: `No active booking found for Ticket ID "${ticketId}".` };
  }

  if (booking.status === 'CANCELLED') {
    return { success: false, error: `Ticket ${cleanId} has already been cancelled.` };
  }

  // Security Authorization: Verify authenticated user owns this ticket
  if (user) {
    const userEmail = (user.email || '').toLowerCase().trim();
    const userMobile = (user.mobile || '').replace(/\D/g, '');
    const userName = (user.name || user.fullName || '').toLowerCase().trim();

    const bookingEmail = (booking.passenger?.email || '').toLowerCase().trim();
    const bookingMobile = (booking.passenger?.mobile || '').replace(/\D/g, '');
    const bookingName = (booking.passenger?.fullName || '').toLowerCase().trim();

    const isAuthorized =
      (userEmail && bookingEmail && userEmail === bookingEmail) ||
      (userMobile && bookingMobile && userMobile === bookingMobile) ||
      (userName && bookingName && (userName.includes(bookingName) || bookingName.includes(userName)));

    if (!isAuthorized) {
      return {
        success: false,
        error: `Unauthorized: Ticket ${cleanId} is registered to another passenger. You can only cancel bookings associated with your registered account.`
      };
    }
  }

  // Mark as cancelled and timestamp
  booking.status = 'CANCELLED';
  booking.cancelledAt = new Date().toISOString();

  // Save updated ticket in store
  saveBooking(booking);

  return {
    success: true,
    ticketId: cleanId,
    cancelledTicket: booking,
    message: `Ticket ${cleanId} (${booking.route || 'journey'}) has been successfully cancelled.`
  };
};

/**
 * Retrieves the pending booking context from localStorage.
 * @returns {Object|null}
 */
export const getPendingBooking = () => {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem('pendingBooking');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Clears the pending booking from localStorage.
 */
export const clearPendingBooking = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pendingBooking');
    }
  } catch {}
};

/**
 * Retrieves the last booking ticket from localStorage.
 * @returns {Object|null}
 */
export const getLastTicket = () => {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem('lastTicket');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const bookingService = {
  generateTicketId,
  createBooking,
  createAgentBooking,
  getBooking,
  cancelBooking,
  preparePendingBooking,
  finalizeBooking,
  getPendingBooking,
  clearPendingBooking,
  getLastTicket,
  saveBooking,
  recordIdempotencyKey,
  getBookingByIdempotencyKey
};

export default bookingService;
