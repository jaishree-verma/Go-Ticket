// GoTicket Recommendation Engine
// Deterministic multi-criteria scoring algorithm for ranking bus search results

/**
 * Converts a time string (e.g., "09:30 PM", "21:30", "evening", "08:00 AM") into minutes from midnight.
 * 
 * @param {string} timeStr 
 * @returns {number|null} Minutes from midnight or null
 */

/**
 * Converts a time string (e.g., "09:30 PM", "21:30", "evening", "08:00 AM", "09:00") into minutes from midnight.
 * 
 * @param {string} timeStr 
 * @returns {number|null} Minutes from midnight or null
 */
export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const str = timeStr.toLowerCase().trim();

  // Named time windows
  if (str.includes('morning')) return 480;    // 8:00 AM
  if (str.includes('afternoon')) return 840;  // 2:00 PM
  if (str.includes('evening')) return 1140;   // 7:00 PM
  if (str.includes('night')) return 1260;     // 9:00 PM

  // Match 12-hour or 24-hour format e.g. "9 PM", "9:30 PM", "21:00", "09:00"
  const match12 = str.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const mins = match12[2] ? parseInt(match12[2], 10) : 0;
    const ampm = match12[3];

    if (ampm) {
      if (ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
      if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
    }
    return hours * 60 + mins;
  }

  return null;
};

/**
 * Parses duration string (e.g. "8h 45m", "9h 00m", "11h") into total minutes.
 * @param {string} durStr
 * @returns {number} Minutes
 */
export const parseDurationToMinutes = (durStr) => {
  if (!durStr) return 480;
  const match = durStr.match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/i);
  if (match && (match[1] || match[2])) {
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const mins = match[2] ? parseInt(match[2], 10) : 0;
    return hours * 60 + mins;
  }
  return (parseFloat(durStr) || 8) * 60;
};

/**
 * Ranks bus search results deterministically based on actual bus data and structured user travel goals.
 *
 * Considers:
 *   - Departure time preference (departure_after / preferredTime)
 *   - Arrival deadline (arrival_before)
 *   - Budget constraints (max_price)
 *   - Bus type (AC, Sleeper, Volvo)
 *   - Journey duration (fastest)
 *   - Seat availability
 *   - Customer rating
 *   - User priority ("price", "time", "comfort", "rating", "arrival")
 *
 * Returns structured explainability reasons and warnings based strictly on real bus data.
 *
 * @param {Array} buses - List of actual bus objects from search_buses tool
 * @param {Object} preferences - Query preferences and constraints
 * @returns {Object} Structured recommendation result
 */
export const rankBuses = (buses = [], preferences = {}) => {
  if (!buses || buses.length === 0) {
    return {
      bestBus: null,
      score: 0,
      rankedBuses: [],
      reasons: [],
      warnings: [],
    };
  }

  const prefMinutes = parseTimeToMinutes(preferences.departure_after || preferences.preferredTime);
  const arrivalDeadline = parseTimeToMinutes(preferences.arrival_before);
  const maxPriceCap = preferences.max_price || preferences.maxPrice || null;
  const targetBusType = (preferences.bus_type || preferences.busType || '').toLowerCase();
  const priority = (preferences.priority || '').toLowerCase();

  // Find price and duration range for normalization
  const prices = buses.map((b) => b.price || 500);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const durList = buses.map((b) => parseDurationToMinutes(b.duration));
  const minDur = Math.min(...durList);
  const maxDur = Math.max(...durList);

  const ratedBuses = buses.map((bus) => {
    const reasons = [];
    const warnings = [];

    // 1. Time Match Score (Departure)
    let timeScore = 0.8;
    if (prefMinutes !== null && bus.departureTime) {
      const busMinutes = parseTimeToMinutes(bus.departureTime);
      if (busMinutes !== null) {
        const diffMinutes = Math.abs(busMinutes - prefMinutes);
        timeScore = Math.max(0, 1 - diffMinutes / 360);
        if (diffMinutes <= 30) {
          reasons.push(`Departs within 30 mins of requested time (${bus.departureTime})`);
        } else if (diffMinutes <= 90) {
          reasons.push(`Departs close to requested time at ${bus.departureTime}`);
        }
      }
    } else {
      reasons.push(`Departs at ${bus.departureTime}`);
    }

    // 2. Price Score
    let priceScore = 0.8;
    if (maxPrice > minPrice) {
      priceScore = 1 - (bus.price - minPrice) / (maxPrice - minPrice);
    } else {
      priceScore = 1.0;
    }

    if (maxPriceCap !== null) {
      if (bus.price <= maxPriceCap) {
        priceScore = Math.min(1.0, priceScore + 0.15);
        reasons.push(`Within your ₹${maxPriceCap} budget (₹${bus.price})`);
      } else {
        priceScore = Math.max(0.1, priceScore - 0.4);
        warnings.push(`Exceeds your ₹${maxPriceCap} budget by ₹${bus.price - maxPriceCap}`);
      }
    } else if (bus.price === minPrice) {
      reasons.push(`Lowest fare option at ₹${bus.price}`);
    } else {
      reasons.push(`Competitive fare of ₹${bus.price}`);
    }

    // 3. Arrival Deadline Fit
    let arrivalScore = 0.8;
    if (arrivalDeadline !== null && bus.arrivalTime) {
      const busArrivalMin = parseTimeToMinutes(bus.arrivalTime);
      if (busArrivalMin !== null) {
        // Compare arrival to deadline
        if (busArrivalMin <= arrivalDeadline) {
          const bufferMins = arrivalDeadline - busArrivalMin;
          arrivalScore = 1.0;
          if (bufferMins >= 30 && bufferMins <= 180) {
            const hrs = Math.floor(bufferMins / 60);
            const mins = bufferMins % 60;
            const bufferText = hrs > 0 ? `${hrs}h ${mins > 0 ? mins + 'm' : ''}` : `${mins} mins`;
            reasons.push(`Reaches at ${bus.arrivalTime} with a comfortable ${bufferText} buffer before your deadline`);
          } else {
            reasons.push(`Reaches at ${bus.arrivalTime}, well ahead of your requested deadline`);
          }
        } else {
          arrivalScore = 0.15;
          const lateMins = busArrivalMin - arrivalDeadline;
          warnings.push(`Arrives at ${bus.arrivalTime}, missing deadline by ${lateMins} mins`);
        }
      }
    }
    // 4. Duration Score (Fastest)
    const busDur = parseDurationToMinutes(bus.duration);
    let durationScore = 0.8;
    if (maxDur > minDur) {
      durationScore = 1 - (busDur - minDur) / (maxDur - minDur);
    } else {
      durationScore = 1.0;
    }
    reasons.push(`Journey duration of ${bus.duration}`);

    // 5. Seat Availability Score
    const seats = bus.availableSeats || 10;
    const seatScore = Math.min(1.0, seats / 30);
    if (seats >= 15) {
      reasons.push(`High seat availability (${seats} seats open)`);
    } else {
      reasons.push(`${seats} seats left`);
    }

    // 6. Rating Score
    const numRating = parseFloat(bus.rating) || 4.5;
    const ratingScore = numRating / 5.0;
    if (numRating >= 4.7) {
      reasons.push(`Top customer rating of ${bus.rating}`);
    }

    // 7. Bus Type Fit
    let typeScore = 0.8;
    if (targetBusType && bus.busType) {
      if (bus.busType.toLowerCase().includes(targetBusType)) {
        typeScore = 1.0;
        reasons.push(`Matches your ${preferences.bus_type} preference`);
      } else {
        typeScore = 0.4;
      }
    }

    // Dynamic Weights Calculation based on user priority and goals
    let wTime = 0.20;
    let wPrice = 0.25;
    let wArrival = 0.20;
    let wDuration = 0.15;
    let wSeats = 0.10;
    let wRating = 0.10;

    if (priority === 'price') {
      wPrice = 0.45;
      wDuration = 0.15;
      wTime = 0.15;
      wArrival = 0.10;
      wSeats = 0.10;
      wRating = 0.05;
    } else if (priority === 'time') {
      wDuration = 0.40;
      wArrival = 0.25;
      wPrice = 0.15;
      wTime = 0.10;
      wSeats = 0.05;
      wRating = 0.05;
    } else if (arrivalDeadline !== null) {
      wArrival = 0.40;
      wPrice = 0.20;
      wTime = 0.15;
      wDuration = 0.10;
      wSeats = 0.10;
      wRating = 0.05;
    } else if (priority === 'comfort') {
      wRating = 0.30;
      wPrice = 0.15;
      wDuration = 0.15;
      wTime = 0.15;
      wSeats = 0.15;
      wArrival = 0.10;
    }

    const totalScore = (
      timeScore * wTime +
      priceScore * wPrice +
      arrivalScore * wArrival +
      durationScore * wDuration +
      seatScore * wSeats +
      ratingScore * wRating +
      typeScore * 0.05
    );

    return {
      bus,
      busId: bus.id,
      score: parseFloat(totalScore.toFixed(2)),
      reasons: [...new Set(reasons)],
      warnings: [...new Set(warnings)],
      satisfiesArrival: arrivalDeadline !== null ? (parseTimeToMinutes(bus.arrivalTime) <= arrivalDeadline) : true,
      satisfiesPrice: maxPriceCap !== null ? (bus.price <= maxPriceCap) : true,
      satisfiesType: targetBusType ? bus.busType.toLowerCase().includes(targetBusType) : true,
    };
  });

  // Sort descending by total score
  ratedBuses.sort((a, b) => b.score - a.score);

  const topMatch = ratedBuses[0];

  return {
    bestBus: topMatch.bus,
    score: topMatch.score,
    reasons: topMatch.reasons,
    warnings: topMatch.warnings,
    rankedBuses: ratedBuses,
  };
};

/**
 * Multi-criteria decision engine that evaluates strict constraints,
 * identifies impossible/no-match goal combinations, and provides close trade-off alternatives.
 *
 * @param {Array} buses - Available buses for route
 * @param {Object} travelRequest - Structured travelRequest from Context Manager
 * @returns {Object} Decision result with exact matches or trade-off alternatives
 */
export const findBestAndAlternativeBuses = (buses = [], travelRequest = {}) => {
  if (!buses || buses.length === 0) {
    return {
      hasExactMatches: false,
      bestBus: null,
      rankedBuses: [],
      alternatives: [],
      explanation: 'No buses found operating for this route.',
    };
  }

  const arrivalDeadline = parseTimeToMinutes(travelRequest.arrival_before);
  const maxPrice = travelRequest.max_price || null;
  const busType = (travelRequest.bus_type || '').toLowerCase();

  // First check if strict constraints exist
  const hasStrictArrival = arrivalDeadline !== null;
  const hasStrictBudget = maxPrice !== null;
  const hasStrictType = Boolean(busType);

  // Filter exact matches
  const exactMatches = buses.filter((bus) => {
    let ok = true;
    if (hasStrictBudget && bus.price > maxPrice) ok = false;
    if (hasStrictArrival) {
      const arrMin = parseTimeToMinutes(bus.arrivalTime);
      if (arrMin === null || arrMin > arrivalDeadline) ok = false;
    }
    if (hasStrictType) {
      if (!bus.busType || !bus.busType.toLowerCase().includes(busType)) ok = false;
    }
    return ok;
  });

  // Case A: Exact matches found
  if (exactMatches.length > 0) {
    const ranking = rankBuses(exactMatches, travelRequest);
    return {
      hasExactMatches: true,
      bestBus: ranking.bestBus,
      score: ranking.score,
      reasons: ranking.reasons,
      warnings: ranking.warnings,
      rankedBuses: ranking.rankedBuses,
      alternatives: [],
    };
  }

  // Case B: No exact match satisfies all constraints simultaneously
  // Provide explainable trade-off alternatives based on actual bus data
  const fullRanking = rankBuses(buses, travelRequest);
  const alternatives = [];

  // 1. Closest budget alternative (lowest price)
  const budgetSorted = [...buses].sort((a, b) => a.price - b.price);
  const lowestFareBus = budgetSorted[0];

  if (hasStrictBudget && lowestFareBus) {
    alternatives.push({
      bus: lowestFareBus,
      tradeOffReason: `Closest to your budget at ₹${lowestFareBus.price} (arrives at ${lowestFareBus.arrivalTime})`,
      category: 'budget',
    });
  }

  // 2. Closest arrival alternative (satisfies arrival or earliest arrival)
  if (hasStrictArrival) {
    const arrivalSorted = [...buses].sort((a, b) => {
      const tA = parseTimeToMinutes(a.arrivalTime) || 9999;
      const tB = parseTimeToMinutes(b.arrivalTime) || 9999;
      return tA - tB;
    });
    const earliestBus = arrivalSorted[0];
    if (earliestBus && (!lowestFareBus || earliestBus.id !== lowestFareBus.id)) {
      alternatives.push({
        bus: earliestBus,
        tradeOffReason: `Arrives early at ${earliestBus.arrivalTime} (fare: ₹${earliestBus.price})`,
        category: 'arrival',
      });
    }
  }

  // Fallback alternative if only one found
  if (alternatives.length < 2 && fullRanking.rankedBuses.length > 1) {
    const alt = fullRanking.rankedBuses[1].bus;
    if (!alternatives.some((a) => a.bus.id === alt.id)) {
      alternatives.push({
        bus: alt,
        tradeOffReason: `Highly rated alternative (${alt.rating}) at ₹${alt.price}`,
        category: 'rating',
      });
    }
  }

  // Build clear, natural explanation of the constraint conflict
  let conflictSummary = "I couldn't find a bus that satisfies all your criteria simultaneously";
  if (hasStrictBudget && hasStrictArrival) {
    conflictSummary = `I couldn't find a bus matching both your ₹${maxPrice} budget and ${travelRequest.arrival_before} arrival deadline`;
  } else if (hasStrictBudget) {
    conflictSummary = `I couldn't find any buses under your requested budget of ₹${maxPrice}`;
  } else if (hasStrictArrival) {
    conflictSummary = `I couldn't find any buses reaching before ${travelRequest.arrival_before}`;
  }

  return {
    hasExactMatches: false,
    bestBus: alternatives.length > 0 ? alternatives[0].bus : fullRanking.bestBus,
    score: fullRanking.score,
    reasons: alternatives.length > 0 ? [alternatives[0].tradeOffReason] : fullRanking.reasons,
    warnings: fullRanking.warnings,
    rankedBuses: fullRanking.rankedBuses,
    alternatives,
    conflictSummary,
  };
};
