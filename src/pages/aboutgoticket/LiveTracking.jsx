import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../../stylespages/livetracking.module.css';

/* ── Demo Bus Fleet ─────────────────────────────────────── */
const BUS_FLEET = {
  'UP32AB1234': {
    name: 'Volvo AC Express',
    busNo: 'UP32AB1234',
    route: 'Lucknow → Kanpur',
    type: 'Volvo AC',
    driver: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    capacity: 40,
    occupancy: 28,
    speed: 62,
    nextStop: 'Unnao Bus Stand',
    departedFrom: 'Lucknow ISBT',
    destination: 'Kanpur Central',
    scheduledArr: '11:30 AM',
    waypoints: [
      { lat: 26.8467, lng: 80.9462, name: 'Lucknow ISBT' },
      { lat: 26.7000, lng: 80.6500, name: 'Unnao' },
      { lat: 26.4499, lng: 80.3319, name: 'Kanpur Central' },
    ],
    progress: 58,
    status: 'En Route',
    color: '#27ae60',
  },
  'DL01CD5678': {
    name: 'Delhi-Agra Superfast',
    busNo: 'DL01CD5678',
    route: 'Delhi → Agra',
    type: 'Semi-Sleeper',
    driver: 'Mohit Sharma',
    phone: '+91 91234 56789',
    capacity: 45,
    occupancy: 40,
    speed: 78,
    nextStop: 'Mathura Bus Stand',
    departedFrom: 'Delhi ISBT Kashmere Gate',
    destination: 'Agra Fort Bus Stand',
    scheduledArr: '02:15 PM',
    waypoints: [
      { lat: 28.6420, lng: 77.2167, name: 'Delhi ISBT' },
      { lat: 27.4924, lng: 77.6737, name: 'Mathura' },
      { lat: 27.1767, lng: 78.0081, name: 'Agra Fort' },
    ],
    progress: 71,
    status: 'En Route',
    color: '#2980b9',
  },
  'MH12EF9012': {
    name: 'Mumbai Pune Express',
    busNo: 'MH12EF9012',
    route: 'Mumbai → Pune',
    type: 'AC Sleeper',
    driver: 'Santosh Patil',
    phone: '+91 87654 32109',
    capacity: 36,
    occupancy: 36,
    speed: 0,
    nextStop: 'Lonavala',
    departedFrom: 'Mumbai Dadar ST Depot',
    destination: 'Pune Swargate',
    scheduledArr: '09:00 AM',
    waypoints: [
      { lat: 19.0760, lng: 72.8777, name: 'Mumbai Dadar' },
      { lat: 18.7481, lng: 73.4072, name: 'Lonavala' },
      { lat: 18.5204, lng: 73.8567, name: 'Pune Swargate' },
    ],
    progress: 100,
    status: 'Arrived',
    color: '#8e44ad',
  },
};

/* ── Haversine distance (km) ────────────────────────────── */
const haversine = (lat1, lng1, lat2, lng2) => {
  const R   = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ── Interpolate bus position from progress ─────────────── */
const getBusPosition = (bus) => {
  const { waypoints, progress } = bus;
  if (progress >= 100) return waypoints[waypoints.length - 1];
  if (progress <= 0)  return waypoints[0];
  const seg    = (progress / 100) * (waypoints.length - 1);
  const segIdx = Math.floor(seg);
  const t      = seg - segIdx;
  const a      = waypoints[Math.min(segIdx, waypoints.length - 1)];
  const b      = waypoints[Math.min(segIdx + 1, waypoints.length - 1)];
  return {
    lat:  a.lat  + t * (b.lat  - a.lat),
    lng:  a.lng  + t * (b.lng  - a.lng),
    name: t < 0.5 ? a.name : b.name,
  };
};

/* ── LiveTracking Page ──────────────────────────────────── */
const LiveTracking = () => {
  const { state }                        = useLocation();
  const initialBusNo                     = state?.busNo || '';

  const [searchInput, setSearchInput]   = useState(initialBusNo);
  const [busData, setBusData]           = useState(null);
  const [searched, setSearched]         = useState(false);
  const [busPos, setBusPos]             = useState(null);
  const [userLoc, setUserLoc]           = useState(null);
  const [locLoading, setLocLoading]     = useState(false);
  const [distKm, setDistKm]             = useState(null);
  const [lastUpdate, setLastUpdate]     = useState('');
  const [liveProgress, setLiveProgress] = useState(0);
  const [mapKey, setMapKey]             = useState(0);

  const intervalRef = useRef(null);

  // Auto trigger tracking if busNo was passed from homepage
  useEffect(() => {
    if (initialBusNo) {
      const key = initialBusNo.trim().toUpperCase().replace(/\s/g, '');
      setSearched(true);
      const found = BUS_FLEET[key] || BUS_FLEET['UP32AB1234'];
      setBusData(found);
      setLastUpdate(new Date().toLocaleTimeString('en-IN'));
      setMapKey((k) => k + 1);
    }
  }, [initialBusNo]);

  /* ── Live simulation: move bus every 3s ─── */
  useEffect(() => {
    if (!busData) return;
    setLiveProgress(busData.progress);
    setBusPos(getBusPosition(busData));

    clearInterval(intervalRef.current);
    if (busData.status === 'En Route') {
      intervalRef.current = setInterval(() => {
        setLiveProgress((prev) => {
          const next = Math.min(prev + 0.3, 100);
          const updatedBus = { ...busData, progress: next };
          const pos = getBusPosition(updatedBus);
          setBusPos(pos);
          setLastUpdate(new Date().toLocaleTimeString('en-IN'));
          if (userLoc) {
            const d = haversine(userLoc.lat, userLoc.lng, pos.lat, pos.lng);
            setDistKm(d.toFixed(1));
          }
          return next;
        });
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [busData, userLoc]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Map iframe URL based on bus position ─── */
  const getMapUrl = useCallback(() => {
    if (!busPos) {
      return 'https://www.openstreetmap.org/export/embed.html?bbox=72,18,81,29&layer=mapnik';
    }
    const zoom = 0.15;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${busPos.lng - zoom},${busPos.lat - zoom},${busPos.lng + zoom},${busPos.lat + zoom}&layer=mapnik&marker=${busPos.lat},${busPos.lng}`;
  }, [busPos]);

  /* ── Search bus ─── */
  const handleSearch = () => {
    const key = searchInput.trim().toUpperCase().replace(/\s/g, '');
    setSearched(true);
    const found = BUS_FLEET[key] || null;
    setBusData(found);
    setDistKm(null);
    setLastUpdate(new Date().toLocaleTimeString('en-IN'));
    if (found) {
      setMapKey((k) => k + 1);
    }
  };

  /* ── Get user geolocation ─── */
  const getUserLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc);
        setLocLoading(false);
        if (busPos) {
          const d = haversine(loc.lat, loc.lng, busPos.lat, busPos.lng);
          setDistKm(d.toFixed(1));
        }
      },
      () => {
        setLocLoading(false);
        alert('Could not get your location. Please allow location access.');
      },
      { enableHighAccuracy: true }
    );
  };

  const statusColor = {
    'En Route': '#27ae60',
    'Arrived':  '#2980b9',
    'Delayed':  '#e67e22',
    'Halted':   '#c0392b',
  };

  /* ── Format speed / occupancy ─── */
  const occupancyPct = busData
    ? Math.round((busData.occupancy / busData.capacity) * 100)
    : 0;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Live Bus Tracking</h1>
      <p className={styles.subText}>
        Enter a bus number to view real-time GPS position, arrival time, speed, and your distance from the bus.
      </p>

      {/* ── Search Box ──────────────────────────────── */}
      <div className={styles.searchCard}>
        <div className={styles.searchLabel}>Enter Bus Number</div>
        <div className={styles.searchRow}>
          <input
            type="text"
            className={styles.trackInput}
            placeholder="e.g. UP32AB1234, DL01CD5678, MH12EF9012"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value.toUpperCase());
              setSearched(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className={styles.trackBtn} onClick={handleSearch}>
            Track Bus
          </button>
        </div>

        {/* Quick-pick demo buses */}
        <div className={styles.demoChips}>
          {Object.keys(BUS_FLEET).map((key) => (
            <button
              key={key}
              className={styles.demoChip}
              onClick={() => {
                setSearchInput(key);
                setSearched(true);
                setBusData(BUS_FLEET[key]);
                setMapKey((k) => k + 1);
                setLastUpdate(new Date().toLocaleTimeString('en-IN'));
                setDistKm(null);
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* ── Not Found ───────────────────────────────── */}
      {searched && !busData && (
        <div className={styles.notFoundBox}>
          ⚠️ No bus found for <strong>"{searchInput}"</strong>. Try one of the demo numbers above.
        </div>
      )}

      {/* ── Results Layout ──────────────────────────── */}
      {busData && (
        <div className={styles.resultLayout}>

          {/* LEFT: Map */}
          <div className={styles.mapSection}>
            <div className={styles.mapHeader}>
              <span className={styles.mapHeaderTitle}>Live Map View</span>
              {lastUpdate && (
                <span className={styles.lastUpdate}>
                  <span className={styles.liveDot} /> Updated {lastUpdate}
                </span>
              )}
            </div>

            <div className={styles.mapContainer}>
              <iframe
                key={mapKey}
                title="Live Bus Map"
                src={getMapUrl()}
                className={styles.mapFrame}
                loading="lazy"
              />
              {/* Animated bus pin overlay */}
              <div className={styles.busPinOverlay}>
                <div className={styles.busPinWrapper}>
                  <span className={styles.busDot}>🚌</span>
                  <div className={styles.busPulse} />
                </div>
                <div className={styles.busPinLabel}>{busData.busNo}</div>
              </div>
            </div>

            {/* Waypoints timeline */}
            <div className={styles.waypointTimeline}>
              {busData.waypoints.map((wp, i) => {
                const totalSegs = busData.waypoints.length - 1;
                const segProg = (liveProgress / 100) * totalSegs;
                const reached  = i <= Math.floor(segProg);
                const isCurrent = i === Math.floor(segProg) && liveProgress < 100;
                return (
                  <div key={i} className={styles.waypointRow}>
                    <div className={`${styles.waypointDot}
                      ${reached ? styles.waypointDotDone : ''}
                      ${isCurrent ? styles.waypointDotCurrent : ''}`}
                    />
                    <div className={styles.waypointInfo}>
                      <span className={`${styles.waypointName}
                        ${isCurrent ? styles.waypointNameCurrent : ''}`}>
                        {wp.name}
                      </span>
                    </div>
                    {i < busData.waypoints.length - 1 && (
                      <div className={`${styles.waypointLine}
                        ${reached ? styles.waypointLineDone : ''}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Journey Progress */}
            <div className={styles.progressWrapper}>
              <div className={styles.progressHeader}>
                <span>Journey Progress</span>
                <span>{Math.round(liveProgress)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${liveProgress}%`, background: busData.color }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Details Panel */}
          <div className={styles.detailsPanel}>

            {/* Bus header */}
            <div className={styles.busHeaderCard}>
              <div className={styles.busNumberBadge}>{busData.busNo}</div>
              <div className={styles.busNameText}>{busData.name}</div>
              <div
                className={styles.statusPill}
                style={{ background: statusColor[busData.status] || '#888' }}
              >
                <span className={styles.statusDot} />
                {busData.status}
              </div>
            </div>

            {/* Current location card */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>Current Location</div>
              <div className={styles.currentLocText}>
                {busPos?.name || busData.waypoints[0].name}
              </div>
              <div className={styles.coordsText}>
                {busPos && `${busPos.lat.toFixed(4)}°N, ${busPos.lng.toFixed(4)}°E`}
              </div>
            </div>

            {/* ETA + Speed row */}
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <div className={styles.statValue}>
                  {busData.status === 'Arrived' ? '✅' : busData.scheduledArr}
                </div>
                <div className={styles.statLabel}>Scheduled Arrival</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statValue}>{busData.speed} km/h</div>
                <div className={styles.statLabel}>Current Speed</div>
              </div>
            </div>

            {/* Route details */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>Route Details</div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>From</span>
                <span className={styles.detailValue}>{busData.departedFrom}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>To</span>
                <span className={styles.detailValue}>{busData.destination}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Next Stop</span>
                <span className={`${styles.detailValue} ${styles.nextStopHighlight}`}>
                  {busData.nextStop}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Bus Type</span>
                <span className={styles.detailValue}>{busData.type}</span>
              </div>
            </div>

            {/* Occupancy */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>Seat Occupancy</div>
              <div className={styles.occupancyRow}>
                <span className={styles.occupancyText}>
                  {busData.occupancy}/{busData.capacity} seats filled
                </span>
                <span className={styles.occupancyPct}>{occupancyPct}%</span>
              </div>
              <div className={styles.occupancyBar}>
                <div
                  className={styles.occupancyFill}
                  style={{
                    width: `${occupancyPct}%`,
                    background: occupancyPct > 90 ? '#e74c3c' : occupancyPct > 70 ? '#e67e22' : '#27ae60',
                  }}
                />
              </div>
            </div>

            {/* Driver info */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>Driver Details</div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Name</span>
                <span className={styles.detailValue}>{busData.driver}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Contact</span>
                <span className={styles.detailValue}>{busData.phone}</span>
              </div>
            </div>

            {/* Distance from you */}
            <div className={styles.distanceCard}>
              <div className={styles.distanceTitle}>Distance From You</div>
              {distKm ? (
                <div className={styles.distanceValue}>{distKm} km away</div>
              ) : (
                <div className={styles.distanceSubtext}>
                  {userLoc
                    ? 'Calculating…'
                    : 'Enable location to see your distance from the bus'}
                </div>
              )}
              <button
                className={styles.locBtn}
                onClick={getUserLocation}
                disabled={locLoading}
              >
                {locLoading
                  ? 'Getting location…'
                  : userLoc
                  ? 'Refresh My Location'
                  : 'Use My Location'}
              </button>
              {userLoc && (
                <p className={styles.locText}>
                  Your location: {userLoc.lat.toFixed(4)}°N, {userLoc.lng.toFixed(4)}°E
                </p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── Default state (no search) ────────────────── */}
      {!searched && (
        <div className={styles.infoGrid}>
          <div className={styles.infoTile}>
            <div className={styles.infoTileIconBox} style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }}>
              <span className={styles.infoTileIconText}>GPS</span>
            </div>
            <div className={styles.infoTileTitle}>Real-Time GPS Tracking</div>
            <div className={styles.infoTileText}>
              Bus positions are refreshed every few seconds via onboard GPS transponders for maximum accuracy.
            </div>
            <div className={styles.infoTileTag}>Live updates</div>
          </div>
          <div className={styles.infoTile}>
            <div className={styles.infoTileIconBox} style={{ background: 'linear-gradient(135deg,#0055aa,#003f7f)' }}>
              <span className={styles.infoTileIconText}>KM</span>
            </div>
            <div className={styles.infoTileTitle}>Distance From You</div>
            <div className={styles.infoTileText}>
              Haversine-formula distance from your GPS location to the bus, recalculated on every position update.
            </div>
            <div className={styles.infoTileTag}>Geolocation</div>
          </div>
          <div className={styles.infoTile}>
            <div className={styles.infoTileIconBox} style={{ background: 'linear-gradient(135deg,#b0a092,#9a8878)' }}>
              <span className={styles.infoTileIconText}>ETA</span>
            </div>
            <div className={styles.infoTileTitle}>Accurate Arrival Times</div>
            <div className={styles.infoTileText}>
              Estimated arrival is computed from current speed, remaining distance, and historical traffic patterns.
            </div>
            <div className={styles.infoTileTag}>Predictive</div>
          </div>
          <div className={styles.infoTile}>
            <div className={styles.infoTileIconBox} style={{ background: 'linear-gradient(135deg,#27ae60,#1a8a4a)' }}>
              <span className={styles.infoTileIconText}>STP</span>
            </div>
            <div className={styles.infoTileTitle}>Stop-by-Stop Updates</div>
            <div className={styles.infoTileText}>
              View the upcoming stop, full route waypoints, and how far along the journey the bus currently is.
            </div>
            <div className={styles.infoTileTag}>Route aware</div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <p>© 2026 Go-Ticket India. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LiveTracking;
