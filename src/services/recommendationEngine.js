// GoTicket Recommendation Engine
// Deterministic multi-criteria scoring algorithm for ranking bus search results

/**
 * Converts a time string (e.g., "09:30 PM", "21:30", "evening", "08:00 AM") into minutes from midnight.
 * 
 * @param {string} timeStr 
 * @returns {number|null} Minutes from midnight or null
 */

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const str = timeStr.toLowerCase().trim();

  // Named time windows
  if (str.includes('morning')) return 480;    // 8:00 AM
  if (str.includes('afternoon')) return 840;  // 2:00 PM
  if (str.includes('evening')) return 1140;   // 7:00 PM
  if (str.includes('night')) return 1260;     // 9:00 PM

  // Match 12-hour or 24-hour format e.g. "9 PM", "9:30 PM", "21:00"
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
 * Ranks bus search results deterministically based on actual bus data.
 * 
 * Scoring Weights:
 * - Time match: 30%
 * - Price: 25%
 * - Arrival fit / Duration: 20%
 * - Available seats: 15%
 * - Rating: 10%
 * 
 * @param {Array} buses - List of actual bus objects from search_buses tool
 * @param {Object} preferences - Query preferences (preferredTime, maxPrice, etc.)
 * @returns {Object} Structured recommendation result
 */
export const rankBuses = (buses = [], preferences = {}) => {
  if (!buses || buses.length === 0) {
    return {
      bestBus: null,
      score: 0,
      rankedBuses: [],
      reasons: []
    };
  }

  const prefMinutes = parseTimeToMinutes(preferences.preferredTime);

  // Find price and rating range for normalization
  const prices = buses.map((b) => b.price || 500);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const ratedBuses = buses.map((bus) => {
    let timeScore = 0.8; // Default good score if no preference
    const reasons = [];

    // 1. Time Match Score (30%)
    if (prefMinutes !== null && bus.departureTime) {
      const busMinutes = parseTimeToMinutes(bus.departureTime);
      if (busMinutes !== null) {
        const diffMinutes = Math.abs(busMinutes - prefMinutes);
        // Score drops as difference increases (max diff considered 360 mins = 6 hrs)
        timeScore = Math.max(0, 1 - diffMinutes / 360);

        if (diffMinutes <= 30) {
          reasons.push(`Leaves within 30 minutes of your requested time (${bus.departureTime})`);
        } else if (diffMinutes <= 90) {
          reasons.push(`Departs close to your requested time at ${bus.departureTime}`);
        }
      }
    } else {
      reasons.push(`Departs at convenient time (${bus.departureTime})`);
    }

    // 2. Price Score (25%) - Lower price is better
    let priceScore = 0.8;
    if (maxPrice > minPrice) {
      priceScore = 1 - (bus.price - minPrice) / (maxPrice - minPrice);
    } else {
      priceScore = 1.0;
    }
    if (bus.price === minPrice) {
      reasons.push(`Lowest fare option at ₹${bus.price}`);
    } else {
      reasons.push(`Competitive fare of ₹${bus.price}`);
    }

    // 3. Arrival fit / Duration Score (20%) - Shorter duration is better
    let durationScore = 0.8;
    const durationHours = parseFloat(bus.duration) || 8;
    durationScore = Math.max(0.5, 1 - (durationHours - 2) / 10);
    reasons.push(`Journey duration of ${bus.duration}`);

    // 4. Seat Availability Score (15%) - More seats is better
    const seats = bus.availableSeats || 10;
    const seatScore = Math.min(1.0, seats / 30);
    if (seats >= 15) {
      reasons.push(`High seat availability (${seats} seats open)`);
    } else {
      reasons.push(`${seats} seats left`);
    }

    // 5. Rating Score (10%)
    const numRating = parseFloat(bus.rating) || 4.5;
    const ratingScore = numRating / 5.0;
    if (numRating >= 4.7) {
      reasons.push(`Top customer rating of ${bus.rating}`);
    }

    // Weighted Total Score
    const totalScore = (
      timeScore * 0.30 +
      priceScore * 0.25 +
      durationScore * 0.20 +
      seatScore * 0.15 +
      ratingScore * 0.10
    );

    return {
      bus,
      busId: bus.id,
      score: parseFloat(totalScore.toFixed(2)),
      reasons
    };
  });

  // Sort descending by total score
  ratedBuses.sort((a, b) => b.score - a.score);

  const topMatch = ratedBuses[0];

  return {
    bestBus: topMatch.bus,
    score: topMatch.score,
    reasons: topMatch.reasons,
    rankedBuses: ratedBuses
  };
};
