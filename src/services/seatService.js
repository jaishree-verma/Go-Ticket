// GoTicket Seat Service — Shared Single Source of Truth for Seat Management
// Reused by both SelectSeats.jsx manual UI and agentTools.js for seat checking & validation

export const TOTAL_SEATS_COUNT = 40;

// Default mock occupied/sold seats for demonstration across buses
export const DEFAULT_SOLD_SEATS = ['S2', 'S7', 'S12', 'S18', 'S24', 'S31'];

/**
 * Generates array of all seat labels from S1 to S40
 * @returns {Array<string>}
 */
export const getAllSeats = () => {
  const seats = [];
  for (let i = 1; i <= TOTAL_SEATS_COUNT; i++) {
    seats.push(`S${i}`);
  }
  return seats;
};

/**
 * Retrieves seat availability status for a specific bus, date, and time slot.
 * 
 * @param {string} busId 
 * @param {string} date 
 * @param {string} slot 
 * @returns {Object} { totalSeats: 40, availableSeats: [...], occupiedSeats: [...] }
 */
export const getAvailableSeats = (busId, date = '', slot = '') => {
  const all = getAllSeats();
  const occupied = [...DEFAULT_SOLD_SEATS];
  const available = all.filter((s) => !occupied.includes(s));

  return {
    busId,
    date,
    slot,
    totalSeats: TOTAL_SEATS_COUNT,
    availableSeats: available,
    occupiedSeats: occupied
  };
};

/**
 * Validates requested seats ATOMICALLY.
 * If ANY requested seat is unavailable or invalid, no seats are held.
 * 
 * @param {string} busId 
 * @param {string} date 
 * @param {string} slot 
 * @param {Array<string>} requestedSeats 
 * @param {number} [farePerSeat=599]
 * @returns {Object} Validation result
 */
export const validateAndHoldSeats = (busId, date = '', slot = '', requestedSeats = [], farePerSeat = 599) => {
  const { occupiedSeats } = getAvailableSeats(busId, date, slot);

  if (!requestedSeats || requestedSeats.length === 0) {
    return {
      success: false,
      atomicityHeld: false,
      error: 'No seats were requested.',
      seats: []
    };
  }

  // Normalize seat IDs e.g. "s3" -> "S3"
  const normalizedSeats = requestedSeats.map((s) => s.trim().toUpperCase());
  const invalidSeats = [];
  const unavailableSeats = [];
  const validAvailable = [];

  normalizedSeats.forEach((seat) => {
    // Check format (must be S1..S40)
    const seatNum = parseInt(seat.replace('S', ''), 10);
    if (!seat.startsWith('S') || isNaN(seatNum) || seatNum < 1 || seatNum > TOTAL_SEATS_COUNT) {
      invalidSeats.push(seat);
    } else if (occupiedSeats.includes(seat)) {
      unavailableSeats.push(seat);
    } else {
      validAvailable.push(seat);
    }
  });

  // ATOMIC CHECK: If any seat is invalid or unavailable, fail the entire selection atomically
  if (invalidSeats.length > 0 || unavailableSeats.length > 0) {
    let errorMsg = '';
    if (unavailableSeats.length > 0 && validAvailable.length > 0) {
      errorMsg = `${unavailableSeats.join(', ')} ${
        unavailableSeats.length === 1 ? 'is' : 'are'
      } unavailable, but ${validAvailable.join(', ')} ${
        validAvailable.length === 1 ? 'is' : 'are'
      } available. Please choose another seat for ${unavailableSeats.join(', ')}.`;
    } else if (unavailableSeats.length > 0) {
      errorMsg = `${unavailableSeats.join(', ')} ${
        unavailableSeats.length === 1 ? 'is' : 'are'
      } unavailable. Please select from open seats.`;
    } else if (invalidSeats.length > 0) {
      errorMsg = `Seat ${invalidSeats.join(', ')} is not a valid seat label (valid seats are S1 to S40).`;
    }

    return {
      success: false,
      atomicityHeld: false,
      unavailableSeats,
      invalidSeats,
      validAvailable,
      requestedSeats: normalizedSeats,
      error: errorMsg
    };
  }

  // Success: All requested seats are valid & available
  const count = normalizedSeats.length;
  const totalFare = count * farePerSeat;

  return {
    success: true,
    atomicityHeld: true,
    busId,
    date,
    slot,
    seats: normalizedSeats,
    seatCount: count,
    farePerSeat,
    totalFare,
    message: `Seats ${normalizedSeats.join(', ')} are available and verified for your trip.`
  };
};
