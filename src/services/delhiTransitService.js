import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import axios from 'axios';

const DELHI_OTD_KEY = process.env.REACT_APP_DELHI_OTD_KEY || 'LfZcHu6prdENZkDDXpiaMndfY8tn3HIN';

/**
 * Fetches real-time live vehicle positions from Delhi Open Transit Data
 * 
 * @param {number} [limit=25] - Max number of buses to return
 * @returns {Promise<Array>} List of live bus telemetry objects
 */
export const fetchLiveDelhiBuses = async (limit = 25) => {
  const directEndpoint = `/api/delhi-otd/VehiclePositions.pb?key=${DELHI_OTD_KEY}`;
  const corsFallbackEndpoint = `https://api.allorigins.win/raw?url=${encodeURIComponent(
    `https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key=${DELHI_OTD_KEY}`
  )}`;

  let bufferData = null;

  // Try local proxy first, then CORS fallback
  try {
    const res = await axios.get(directEndpoint, {
      responseType: 'arraybuffer',
      timeout: 5000
    });
    bufferData = res.data;
  } catch (err) {
    try {
      const res = await axios.get(corsFallbackEndpoint, {
        responseType: 'arraybuffer',
        timeout: 8000
      });
      bufferData = res.data;
    } catch (fallbackErr) {
      console.warn('Delhi OTD live fetch error:', fallbackErr.message);
    }
  }

  if (bufferData) {
    try {
      const uint8 = new Uint8Array(bufferData);
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(uint8);

      const parsedBuses = feed.entity
        .filter((e) => e.vehicle && e.vehicle.position)
        .slice(0, limit)
        .map((e) => {
          const v = e.vehicle;
          const regNo = v.vehicle?.id || v.vehicle?.label || 'DL1PD' + Math.floor(1000 + Math.random() * 9000);
          const isElectric = regNo.includes('EV');

          return {
            id: regNo,
            registration: regNo,
            route: v.trip?.routeId || 'DTC Express',
            latitude: v.position.latitude,
            longitude: v.position.longitude,
            speedKmH: Math.round((v.position.speed || 0) * 3.6),
            bearing: v.position.bearing || 0,
            timestamp: v.timestamp?.low ? new Date(v.timestamp.low * 1000).toLocaleTimeString() : 'Just now',
            operator: isElectric ? 'Delhi Electric DTC' : 'Delhi Transport Corp (DTC)',
            isLive: true,
            status: 'In Transit'
          };
        });

      if (parsedBuses.length > 0) {
        return parsedBuses;
      }
    } catch (parseErr) {
      console.error('Failed to decode GTFS-RT feed:', parseErr);
    }
  }

  // Fallback demo fleet if network is offline
  return [
    {
      id: 'DL51EV9092',
      registration: 'DL51EV9092',
      route: 'Route 534 (Mehrauli ➔ Anand Vihar)',
      latitude: 28.5903,
      longitude: 77.0866,
      speedKmH: 42,
      operator: 'Delhi Electric DTC',
      isLive: false,
      status: 'In Transit'
    },
    {
      id: 'DL1PD8698',
      registration: 'DL1PD8698',
      route: 'Route 419 (Ambedkar Nagar ➔ Old Delhi)',
      latitude: 28.5381,
      longitude: 77.2916,
      speedKmH: 38,
      operator: 'Delhi Transport Corp (DTC)',
      isLive: false,
      status: 'On Schedule'
    }
  ];
};

/**
 * Searches live Delhi bus position by registration plate or route
 */
export const searchDelhiBus = async (busQuery) => {
  const allBuses = await fetchLiveDelhiBuses(200);
  const q = (busQuery || '').toLowerCase().trim();

  const found = allBuses.find(
    (b) => b.registration.toLowerCase().includes(q) || b.route.toLowerCase().includes(q)
  );

  return found || allBuses[0] || null;
};
