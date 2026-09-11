// GoTicket Booking Service — Single Source of Truth for Booking & Ticket Logic
// Manages: Pending Booking Preparation (Tixie Handoff) & Final Booking Commit (Payment Page)

/**
 * Generates a GoTicket ticket ID in the format GT + 6 random alphanumeric chars.
 * @returns {string} e.g. "GT7AX9KP"
 */
export const generateTicketId = () =>
  'GT' + Math.random().toString(36).substring(2, 8).toUpperCase();

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
        aadhaar: passenger.aadhaar || '123456789012',
        gender: passenger.gender || 'Male',
        age: passenger.age || 25
      },
      passengers: [{
        fullName: passenger.fullName.trim(),
        mobile: passenger.mobile,
        email: passenger.email.toLowerCase(),
        aadhaar: passenger.aadhaar || '123456789012',
        gender: passenger.gender || 'Male',
        age: passenger.age || 25
      }],
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('pendingBooking', JSON.stringify(pendingBooking));
    return { success: true, pendingBooking };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to prepare booking context.' };
  }
};

/**
 * Finalizes a booking after successful payment and persists the final ticket to localStorage['lastTicket'].
 * Clears the pending booking from localStorage.
 *
 * @param {Object} opts
 * @param {Object} opts.bookingData     - Pending or manual booking data
 * @param {string} [opts.paymentMethod] - 'upi' | 'card' | 'netbanking' | 'agent'
 * @param {Array}  [opts.passengers]    - Array of passenger objects
 * @param {string} [opts.ticketId]      - Optional pre-generated ticket ID
 * @returns {{ success: boolean, ticketId: string, ticket: Object }}
 */
export const finalizeBooking = ({
  bookingData = {},
  paymentMethod = 'upi',
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
    name:          bookingData.name        || bookingData.busName || (bookingData.busDetails?.busName || ''),
    label:         bookingData.name        || bookingData.busName || (bookingData.busDetails?.busName || ''),
    id:            bookingData.id          || (bookingData.busDetails?.id || ''),
    type:          bookingData.type        || bookingData.busType || (bookingData.busDetails?.busType || ''),
    route:         bookingData.route       || `${bookingData.source || ''} => ${bookingData.destination || ''}`,
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

  localStorage.setItem('lastTicket', JSON.stringify(ticket));
  localStorage.removeItem('pendingBooking');

  return { success: true, ticketId: generatedId, ticket };
};

/**
 * Creates a booking directly (convenience wrapper around finalizeBooking).
 * Reused for programmatic / test scenarios.
 */
export const createAgentBooking = ({
  busDetails,
  slot,
  seats,
  boarding = {},
  dropping = {},
  passenger,
  totalFare
}) => {
  const prep = preparePendingBooking({
    busDetails,
    slot,
    seats,
    boarding,
    dropping,
    passenger,
    totalFare
  });

  if (!prep.success) {
    return prep;
  }

  return finalizeBooking({
    bookingData: prep.pendingBooking,
    paymentMethod: 'agent'
  });
};

/**
 * Retrieves the pending booking context from localStorage.
 * @returns {Object|null}
 */
export const getPendingBooking = () => {
  try {
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
    localStorage.removeItem('pendingBooking');
  } catch {}
};

/**
 * Retrieves the last booking ticket from localStorage.
 * @returns {Object|null}
 */
export const getLastTicket = () => {
  try {
    const raw = localStorage.getItem('lastTicket');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

