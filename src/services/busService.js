// GoTicket Bus Search Service
// Clean abstraction exposing searchBuses() for transport search
// Today: Queries local mock dataset with a simulated async Promise delay
// Future: Will replace internal mock query with FastAPI HTTP request (e.g., fetch('/api/buses/search'))

import { MOCK_BUSES } from '../data/mockBuses.js';
import { CITY_ALIASES } from './intentDefinitions.js';

const normalizeCity = (c = '') => {
  const s = (c || '').trim().toLowerCase();
  if (!s) return '';
  if (CITY_ALIASES[s]) return CITY_ALIASES[s].toLowerCase();
  for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
    if (s === alias || s.includes(alias)) return canonical.toLowerCase();
  }
  return s;
};

/**
 * Searches for buses matching the requested criteria.
 * 
 * @param {Object} searchParams
 * @param {string} searchParams.source - Departure city
 * @param {string} searchParams.destination - Arrival city
 * @param {string} [searchParams.date] - Departure travel date (YYYY-MM-DD)
 * @param {string} [searchParams.preferredTime] - Optional time filter for future AI agent
 * @param {number} [searchParams.maxPrice] - Optional max fare price filter for future AI agent
 * @param {string} [searchParams.busType] - Optional bus type filter for future AI agent
 * @returns {Promise<Array>} Promise resolving to matching bus array
 */
export const searchBuses = ({
  source = '',
  destination = '',
  date = '',
  preferredTime = null,
  maxPrice = null,
  busType = null
}) => {
  return new Promise((resolve, reject) => {
    // Artificial 500ms delay to simulate network latency and test loading states
    setTimeout(() => {
      try {
        const normSource = normalizeCity(source);
        const normDest = normalizeCity(destination);

        if (!normSource || !normDest) {
          return resolve([]);
        }

        let results = MOCK_BUSES.filter((bus) => {
          const busSource = normalizeCity(bus.source);
          const busDest = normalizeCity(bus.destination);
          const matchSource = busSource === normSource;
          const matchDest = busDest === normDest;

          let matchPrice = true;
          if (maxPrice) {
            matchPrice = bus.price <= maxPrice;
          }

          let matchType = true;
          if (busType) {
            matchType = (bus.busType || '').toLowerCase().includes(busType.toLowerCase());
          }

          return matchSource && matchDest && matchPrice && matchType;
        });

        if (preferredTime && results.length > 0) {
          const strictTimeMatches = results.filter(b => b.departureTime && b.departureTime.includes(preferredTime));
          if (strictTimeMatches.length > 0) {
            results = strictTimeMatches;
          }
        }

        resolve(results);
      } catch (err) {
        reject(new Error('Failed to perform bus search. Please try again.'));
      }
    }, 500);
  });
};
