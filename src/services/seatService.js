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

    const alternatives = findAdjacentSeats(
      occupiedSeats.length > 0 ? getAvailableSeats(busId, date, slot).availableSeats : [],
      normalizedSeats.length
    );

    let alternativeText = '';
    if (alternatives && alternatives.length > 0) {
      alternativeText = ` However, ${alternatives.join(' and ')} are available and adjacent. Would you like me to select them?`;
    }

    return {
      success: false,
      atomicityHeld: false,
      unavailableSeats,
      invalidSeats,
      validAvailable,
      requestedSeats: normalizedSeats,
      suggestedAlternatives: alternatives,
      error: `${errorMsg}${alternativeText}`
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

// =============================================================================
// SEAT METADATA & LAYOUT MODEL (Step 3: Goal-Based & Interactive Seat Map)
// =============================================================================

/**
 * Returns detailed deterministic metadata for any seat S1..S40.
 * Layout aligns with SelectSeats.jsx: 8 rows of 5 seats (2 Left + Aisle + 3 Right).
 *
 * @param {string} seatId - e.g. "S1"
 * @param {string} [busType=''] - Optional bus type string (e.g. 'AC Sleeper 2+1')
 * @returns {Object} Seat metadata
 */
export const getSeatMetadata = (seatId = '', busType = '') => {
  const norm = (seatId || '').trim().toUpperCase();
  const num = parseInt(norm.replace('S', ''), 10);
  if (isNaN(num) || num < 1 || num > TOTAL_SEATS_COUNT) {
    return null;
  }

  // Row (1 to 8) and Column (1 to 5)
  const row = Math.floor((num - 1) / 5) + 1;
  const column = ((num - 1) % 5) + 1;

  // Position relative to bus length
  let position = 'middle';
  if (row <= 2) position = 'front';
  else if (row >= 7) position = 'back';

  // Side relative to aisle
  const side = column <= 2 ? 'left' : 'right';

  // Window vs Aisle
  const isWindow = column === 1 || column === 5;
  const isAisle = column === 2 || column === 3;
  const isMiddle = column === 4;

  // Sleeper vs Seater type and berth
  const isSleeper = busType.toLowerCase().includes('sleeper');
  const type = isSleeper ? 'sleeper' : 'seater';
  // Lower berth for odd rows, upper berth for even rows
  const berth = isSleeper ? (row % 2 === 1 ? 'lower' : 'upper') : null;

  return {
    id: norm,
    number: num,
    row,
    column,
    side,
    position,
    isWindow,
    isAisle,
    isMiddle,
    type,
    berth,
  };
};

/**
 * Generates the full 8-row x 5-seat layout grid with live statuses.
 * Reusable by both the interactive ChatSeatMap and manual UI.
 *
 * @param {string} busId 
 * @param {string} [date=''] 
 * @param {string} [slot=''] 
 * @param {Array<string>} [selectedSeats=[]] 
 * @param {Array<string>} [recommendedSeats=[]] 
 * @param {string} [busType='']
 * @returns {Object} Structured layout with rows, statistics, and metadata
 */
export const getBusSeatLayout = (
  busId,
  date = '',
  slot = '',
  selectedSeats = [],
  recommendedSeats = [],
  busType = ''
) => {
  const { availableSeats, occupiedSeats } = getAvailableSeats(busId, date, slot);
  const selectedNorm = selectedSeats.map((s) => s.toUpperCase());
  const recommendedNorm = recommendedSeats.map((s) => s.toUpperCase());

  const rows = [];
  let currentNum = 1;

  for (let r = 1; r <= 8; r++) {
    const left = [];
    const right = [];

    for (let c = 1; c <= 5; c++) {
      const seatId = `S${currentNum}`;
      const meta = getSeatMetadata(seatId, busType);

      let status = 'available';
      if (occupiedSeats.includes(seatId)) {
        status = 'occupied';
      } else if (selectedNorm.includes(seatId)) {
        status = 'selected';
      } else if (recommendedNorm.includes(seatId)) {
        status = 'recommended';
      }

      const seatObj = {
        ...meta,
        status,
        isSelected: status === 'selected',
        isOccupied: status === 'occupied',
        isRecommended: status === 'recommended',
      };

      if (c <= 2) {
        left.push(seatObj);
      } else {
        right.push(seatObj);
      }

      currentNum++;
    }

    rows.push({
      rowIndex: r,
      rowLabel: `Row ${r}`,
      left,
      right,
    });
  }

  return {
    busId,
    totalSeats: TOTAL_SEATS_COUNT,
    availableCount: availableSeats.length,
    occupiedCount: occupiedSeats.length,
    selectedCount: selectedNorm.length,
    rows,
  };
};

/**
 * Finds adjacent available seats in the layout (never across the aisle).
 * Supports counts of 2, 3, or more.
 *
 * @param {Array<string>} availableSeats - Currently available seat IDs
 * @param {number} [count=2] - Number of adjacent seats needed
 * @param {Object} [preference={}] - Optional preference (e.g. { window: true, front: true })
 * @returns {Array<string>|null} Array of adjacent seat IDs or null if none exist
 */
export const findAdjacentSeats = (availableSeats = [], count = 2, preference = {}) => {
  if (count <= 1) {
    return availableSeats.length > 0 ? [availableSeats[0]] : null;
  }

  const availSet = new Set(availableSeats.map((s) => s.toUpperCase()));
  const candidates = [];

  for (let r = 1; r <= 8; r++) {
    const base = (r - 1) * 5;

    // Left side pair: col 1 and col 2
    if (count === 2) {
      const left1 = `S${base + 1}`;
      const left2 = `S${base + 2}`;
      if (availSet.has(left1) && availSet.has(left2)) {
        candidates.push({
          seats: [left1, left2],
          row: r,
          hasWindow: true,
          position: r <= 2 ? 'front' : (r >= 7 ? 'back' : 'middle'),
        });
      }

      // Right side pair: col 3 & 4 or col 4 & 5
      const right1 = `S${base + 3}`;
      const right2 = `S${base + 4}`;
      const right3 = `S${base + 5}`;

      if (availSet.has(right1) && availSet.has(right2)) {
        candidates.push({
          seats: [right1, right2],
          row: r,
          hasWindow: false,
          position: r <= 2 ? 'front' : (r >= 7 ? 'back' : 'middle'),
        });
      }
      if (availSet.has(right2) && availSet.has(right3)) {
        candidates.push({
          seats: [right2, right3],
          row: r,
          hasWindow: true,
          position: r <= 2 ? 'front' : (r >= 7 ? 'back' : 'middle'),
        });
      }
    } else if (count === 3) {
      // Right side triplet: col 3, 4, 5
      const r1 = `S${base + 3}`;
      const r2 = `S${base + 4}`;
      const r3 = `S${base + 5}`;
      if (availSet.has(r1) && availSet.has(r2) && availSet.has(r3)) {
        candidates.push({
          seats: [r1, r2, r3],
          row: r,
          hasWindow: true,
          position: r <= 2 ? 'front' : (r >= 7 ? 'back' : 'middle'),
        });
      }
    }
  }

  if (candidates.length === 0) return null;

  // Score candidates based on preferences (e.g. front rows first, window seats)
  candidates.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.position === 'front') scoreA += 5;
    if (b.position === 'front') scoreB += 5;
    if (a.hasWindow) scoreA += 3;
    if (b.hasWindow) scoreB += 3;
    if (preference?.front && a.position === 'front') scoreA += 10;
    if (preference?.window && a.hasWindow) scoreA += 10;
    // Prefer lower row numbers (front of bus)
    return scoreB - scoreA || a.row - b.row;
  });

  return candidates[0].seats;
};

/**
 * Recommends optimal seats based on user preferences and live bus availability.
 * Generates structured, explainable reasons based on real layout data.
 *
 * @param {Object} options
 * @param {string} [options.busId]
 * @param {string} [options.busType='']
 * @param {Object} [options.seatPreference=null] - { type: 'window'|'aisle'|'front'|'back'|'lower'|'upper'|'adjacent' }
 * @param {number} [options.passengers=1]
 * @param {Array<string>} [options.availableSeats=[]]
 * @returns {Object} { recommendedSeats: Array<string>, reasons: Array<string> }
 */
export const recommendSeats = ({
  busId,
  busType = '',
  seatPreference = null,
  passengers = 1,
  availableSeats = [],
} = {}) => {
  const openSeats = availableSeats && availableSeats.length > 0
    ? availableSeats
    : getAvailableSeats(busId).availableSeats;

  const countNeeded = Math.max(1, passengers || 1);
  const reasons = [];

  // Multi-passenger: prioritize adjacent seats
  if (countNeeded > 1 || (seatPreference && seatPreference.type === 'adjacent')) {
    const adjacent = findAdjacentSeats(openSeats, countNeeded, seatPreference);
    if (adjacent) {
      const metaFirst = getSeatMetadata(adjacent[0], busType);
      reasons.push(`${adjacent.join(' and ')} are adjacent seats in Row ${metaFirst?.row || 1}`);
      if (adjacent.some((s) => getSeatMetadata(s, busType)?.isWindow)) {
        reasons.push('Includes a window seat');
      }
      if (metaFirst?.position === 'front') {
        reasons.push('Convenient front-row location for easy boarding');
      }
      return {
        recommendedSeats: adjacent,
        reasons,
      };
    }
  }

  // Single passenger or fallback: score individual open seats
  const prefType = seatPreference?.type?.toLowerCase() || '';

  const scored = openSeats.map((seatId) => {
    const meta = getSeatMetadata(seatId, busType);
    let score = 10;
    const itemReasons = [];

    if (meta.position === 'front') {
      score += 4;
      itemReasons.push('Front-row seat for a smooth journey');
    }
    if (meta.isWindow) {
      score += 3;
      itemReasons.push('Window seat with scenic views');
    }

    if (prefType === 'window' && meta.isWindow) {
      score += 15;
      itemReasons.push('Matches your window seat preference');
    } else if (prefType === 'aisle' && meta.isAisle) {
      score += 15;
      itemReasons.push('Matches your aisle seat preference');
    } else if (prefType === 'front' && meta.position === 'front') {
      score += 15;
      itemReasons.push('Matches your front seat preference');
    } else if (prefType === 'lower' && meta.berth === 'lower') {
      score += 15;
      itemReasons.push('Lower berth for comfortable resting');
    } else if (prefType === 'upper' && meta.berth === 'upper') {
      score += 15;
      itemReasons.push('Upper berth with quiet privacy');
    }

    return {
      seatId,
      score,
      meta,
      reasons: itemReasons,
    };
  });

  scored.sort((a, b) => b.score - a.score || a.meta.number - b.meta.number);

  const topPick = scored.slice(0, countNeeded);
  const pickIds = topPick.map((p) => p.seatId);

  if (topPick.length > 0 && topPick[0].reasons.length > 0) {
    reasons.push(...topPick[0].reasons);
  }

  return {
    recommendedSeats: pickIds,
    reasons: reasons.length > 0 ? reasons : ['Optimal seating near the front with quick access'],
  };
};
