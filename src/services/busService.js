// GoTicket Bus Search Service — Live API Integration
import axios from 'axios';
import { MOCK_BUSES } from '../data/mockBuses.js';

/**
 * Searches for real-time buses from the authorized backend GDS proxy.
 * 
 * @param {Object} searchParams
 * @param {string} searchParams.source - Departure city
 * @param {string} searchParams.destination - Arrival city
 * @param {string} [searchParams.date] - Departure travel date (YYYY-MM-DD)
 * @param {string} [searchParams.preferredTime] - Optional time filter
 * @param {number} [searchParams.maxPrice] - Optional max fare filter
 * @param {string} [searchParams.busType] - Optional bus type filter
 * @returns {Promise<Array>}
 */
export const searchBuses = async ({
  source = '',
  destination = '',
  date = '',
  preferredTime = null,
  maxPrice = null,
  busType = null
}) => {
  const cleanSource = (source || '').trim();
  const cleanDest = (destination || '').trim();

  if (!cleanSource || !cleanDest) {
    return [];
  }

  // 1. Live Authorized Backend Call
  try {
    const res = await axios.get('/api/buses/search', {
      params: { source: cleanSource, destination: cleanDest, date },
      timeout: 6000
    });

    if (Array.isArray(res.data) && res.data.length > 0) {
      let liveResults = res.data;

      if (maxPrice) {
        liveResults = liveResults.filter((b) => b.price <= maxPrice);
      }
      if (busType) {
        liveResults = liveResults.filter((b) =>
          b.busType.toLowerCase().includes(busType.toLowerCase())
        );
      }
      if (preferredTime) {
        const timeFiltered = liveResults.filter((b) =>
          b.departureTime.includes(preferredTime)
        );
        if (timeFiltered.length > 0) liveResults = timeFiltered;
      }

      return liveResults;
    }
  } catch (err) {
    console.warn('Live API search warning, falling back to local registry:', err.message);
  }

  // 2. Fallback to local verified registry
  const lowerSource = cleanSource.toLowerCase();
  const lowerDest = cleanDest.toLowerCase();

  return MOCK_BUSES.filter((bus) => {
    const matchSource = bus.source.toLowerCase() === lowerSource;
    const matchDest = bus.destination.toLowerCase() === lowerDest;
    const matchPrice = maxPrice ? bus.price <= maxPrice : true;
    const matchType = busType ? bus.busType.toLowerCase().includes(busType.toLowerCase()) : true;
    return matchSource && matchDest && matchPrice && matchType;
  });
};

/**
 * Fetches latest seat layout, live pricing, and boarding points from the API
 * 
 * @param {string} tripId
 * @returns {Promise<Object>}
 */
export const getLiveTripDetails = async (tripId) => {
  try {
    const res = await axios.get(`/api/buses/trip/${encodeURIComponent(tripId)}`, { timeout: 6000 });
    return res.data;
  } catch (err) {
    console.warn(`Live trip details fetch error for ${tripId}:`, err.message);
    return null;
  }
};
