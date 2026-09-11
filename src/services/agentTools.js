// GoTicket Agent Tools Abstraction (Phase 1, Phase 2 & Phase 3 Tools)
// Interface between Travel Agent and application business logic

import { searchBuses } from './busService.js';
import { MOCK_BUSES } from '../data/mockBuses.js';
import { getAvailableSeats, validateAndHoldSeats } from './seatService.js';
import { createAgentBooking, preparePendingBooking } from './bookingService.js';

/**
 * Tool: search_buses
 * Searches for buses using the existing busService application logic.
 * 
 * @param {Object} params
 * @param {string} params.source - Departure city
 * @param {string} params.destination - Destination city
 * @param {string} [params.date] - Travel date (YYYY-MM-DD)
 * @param {string} [params.preferredTime] - Optional departure time preference (e.g., "09:00 PM", "21:00", "evening")
 * @returns {Promise<Object>} Structured tool result object containing actual bus data
 */
export const search_buses = async ({
  source = '',
  destination = '',
  date = '',
  preferredTime = null
}) => {
  try {
    const cleanSource = source.trim();
    const cleanDestination = destination.trim();

    if (!cleanSource || !cleanDestination) {
      return {
        success: false,
        tool: 'search_buses',
        error: 'Both source and destination cities are required.',
        query: { source: cleanSource, destination: cleanDestination, date, preferredTime },
        results: []
      };
    }

    if (cleanSource.toLowerCase() === cleanDestination.toLowerCase()) {
      return {
        success: false,
        tool: 'search_buses',
        error: 'Departure and destination cities cannot be the same city.',
        query: { source: cleanSource, destination: cleanDestination, date, preferredTime },
        results: []
      };
    }

    const buses = await searchBuses({
      source: cleanSource,
      destination: cleanDestination,
      date,
      preferredTime
    });

    return {
      success: true,
      tool: 'search_buses',
      query: {
        source: cleanSource,
        destination: cleanDestination,
        date: date || new Date().toISOString().split('T')[0],
        preferredTime
      },
      results: buses || []
    };
  } catch (err) {
    return {
      success: false,
      tool: 'search_buses',
      error: err.message || 'Failed to search buses. Please try again.',
      query: { source, destination, date, preferredTime },
      results: []
    };
  }
};

/**
 * Tool: get_bus_details
 * Retrieves detailed metadata for a specific bus by busId.
 * 
 * @param {Object} params
 * @param {string} params.busId
 * @returns {Promise<Object>}
 */
export const get_bus_details = async ({ busId }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!busId) {
        return resolve({
          success: false,
          tool: 'get_bus_details',
          error: 'busId is required.',
          bus: null
        });
      }

      const cleanId = busId.trim().toUpperCase();
      const bus = MOCK_BUSES.find(
        (b) => b.id.toUpperCase() === cleanId || b.busName.toLowerCase().includes(busId.toLowerCase())
      );

      if (!bus) {
        return resolve({
          success: false,
          tool: 'get_bus_details',
          error: `Bus with ID or name "${busId}" was not found.`,
          bus: null
        });
      }

      resolve({
        success: true,
        tool: 'get_bus_details',
        bus
      });
    }, 200);
  });
};

/**
 * Tool: check_seat_availability
 * Returns available and occupied seats for a specific bus and slot using seatService.
 * 
 * @param {Object} params
 * @param {string} params.busId
 * @param {string} [params.date]
 * @param {string} [params.slot]
 * @returns {Promise<Object>}
 */
export const check_seat_availability = async ({ busId, date = '', slot = '' }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!busId) {
        return resolve({
          success: false,
          tool: 'check_seat_availability',
          error: 'busId is required to check seats.',
          availableSeats: [],
          occupiedSeats: []
        });
      }

      const seatInfo = getAvailableSeats(busId, date, slot);

      resolve({
        success: true,
        tool: 'check_seat_availability',
        ...seatInfo
      });
    }, 300);
  });
};

/**
 * Tool: hold_select_seats
 * ATOMICALLY validates seat selection for a bus trip.
 * If ANY requested seat is unavailable, atomic hold fails without committing partial seats.
 * 
 * @param {Object} params
 * @param {string} params.busId
 * @param {string} [params.date]
 * @param {string} [params.slot]
 * @param {Array<string>} params.seats - Requested seat labels e.g. ["S3", "S4"]
 * @param {number} [params.farePerSeat=599]
 * @returns {Promise<Object>}
 */
export const hold_select_seats = async ({ busId, date = '', slot = '', seats = [], farePerSeat = 599 }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!busId) {
        return resolve({
          success: false,
          tool: 'hold_select_seats',
          error: 'busId is required to select seats.',
          seats: []
        });
      }

      const result = validateAndHoldSeats(busId, date, slot, seats, farePerSeat);

      resolve({
        tool: 'hold_select_seats',
        ...result
      });
    }, 300);
  });
};

/**
 * Tool: prepare_booking
 * Atomic seat check + prepares pending booking context via bookingService.
 * Called ONLY after explicit user confirmation in Tixie.
 * Does NOT create a finalized ticket or process payment.
 *
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export const prepare_booking = async ({
  busDetails,
  slot,
  seats = [],
  farePerSeat = 0,
  passenger,
  date = '',
  source = '',
  destination = '',
  appliedCoupon = null,
  discountAmount = 0,
  totalFare
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!busDetails || !busDetails.id) {
        return resolve({ success: false, tool: 'prepare_booking', error: 'Bus details are required.' });
      }
      if (!seats || seats.length === 0) {
        return resolve({ success: false, tool: 'prepare_booking', error: 'At least one seat must be selected.' });
      }
      if (!passenger || !passenger.fullName || !passenger.email || !passenger.mobile) {
        return resolve({ success: false, tool: 'prepare_booking', error: 'Passenger fullName, email, and mobile are required.' });
      }

      // Final atomic seat availability check
      const finalCheck = validateAndHoldSeats(
        busDetails.id,
        date,
        slot,
        seats,
        farePerSeat || busDetails.price || 0
      );

      if (!finalCheck.success) {
        return resolve({
          success: false,
          tool: 'prepare_booking',
          error: `Seat availability changed: ${finalCheck.error}. Booking could not be prepared.`
        });
      }

      const enrichedBus = { ...busDetails, date: date || busDetails.date || '' };

      const result = preparePendingBooking({
        busDetails: enrichedBus,
        slot,
        seats: finalCheck.seats,
        farePerSeat: farePerSeat || busDetails.price || 0,
        passenger,
        date,
        source: source || busDetails.source,
        destination: destination || busDetails.destination,
        appliedCoupon,
        discountAmount,
        totalFare: typeof totalFare === 'number' ? totalFare : finalCheck.totalFare
      });

      resolve({ tool: 'prepare_booking', ...result });
    }, 200);
  });
};

/**
 * Tool: create_booking
 * FINAL atomic seat check + actual booking creation via bookingService.
 * Called when committing booking directly.
 *
 * @param {Object} params
 * @returns {Promise<Object>}
 */
export const create_booking = async ({
  busDetails,
  slot,
  seats = [],
  farePerSeat = 0,
  passenger,
  date = ''
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!busDetails || !busDetails.id) {
        return resolve({ success: false, tool: 'create_booking', error: 'Bus details are required.' });
      }
      if (!seats || seats.length === 0) {
        return resolve({ success: false, tool: 'create_booking', error: 'At least one seat must be selected.' });
      }
      if (!passenger || !passenger.fullName || !passenger.email || !passenger.mobile) {
        return resolve({ success: false, tool: 'create_booking', error: 'Passenger fullName, email, and mobile are required.' });
      }

      // Final atomic seat availability check before committing booking
      const finalCheck = validateAndHoldSeats(
        busDetails.id,
        date,
        slot,
        seats,
        farePerSeat || busDetails.price || 0
      );

      if (!finalCheck.success) {
        return resolve({
          success: false,
          tool: 'create_booking',
          error: `Seat availability changed: ${finalCheck.error}. Booking was not created.`
        });
      }

      // Enrich busDetails with date for the ticket record
      const enrichedBus = { ...busDetails, date: date || busDetails.date || '' };

      const result = createAgentBooking({
        busDetails: enrichedBus,
        slot,
        seats: finalCheck.seats,
        boarding: {},
        dropping: {},
        passenger,
        totalFare: finalCheck.totalFare
      });

      resolve({ tool: 'create_booking', ...result });
    }, 500);
  });
};
