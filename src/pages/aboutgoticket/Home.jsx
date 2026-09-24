import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopRoutesDirectory from '../../components/TopRoutesDirectory';
import AlphabeticalCityPicker from '../../components/AlphabeticalCityPicker';
import styles from '../../stylespages/home.module.css';

/* ── Popular routes data across India ───────────────────── */
const POPULAR_ROUTES = [
  {
    from: 'Delhi', to: 'Manali',
    distance: '535 km', duration: '13h 30m',
    minFare: '₹1,150', buses: 22,
    tag: 'Mountain Special',
    tagColor: '#028090',
    desc: 'Himalayan scenic corridor with premium Volvo 9600 sleepers.',
    stops: ['Chandigarh', 'Mandi', 'Kullu'],
  },
  {
    from: 'Delhi', to: 'Agra',
    distance: '206 km', duration: '3h 30m',
    minFare: '₹349', buses: 18,
    tag: 'Most Booked',
    tagColor: '#e74c3c',
    desc: 'India\'s busiest heritage corridor — Delhi to the Taj Mahal city.',
    stops: ['Mathura', 'Vrindavan'],
  },
  {
    from: 'Mumbai', to: 'Goa',
    distance: '590 km', duration: '12h 30m',
    minFare: '₹999', buses: 20,
    tag: 'Holiday Express',
    tagColor: '#e67e22',
    desc: 'Coastal highway luxury sleeper service to North and South Goa.',
    stops: ['Pune', 'Satara', 'Kolhapur', 'Mapusa'],
  },
  {
    from: 'Mumbai', to: 'Pune',
    distance: '148 km', duration: '2h 45m',
    minFare: '₹299', buses: 24,
    tag: 'Express Route',
    tagColor: '#2980b9',
    desc: 'The metro express linking India\'s financial capital to Pune.',
    stops: ['Lonavala', 'Khandala'],
  },
  {
    from: 'Bangalore', to: 'Hyderabad',
    distance: '570 km', duration: '8h 30m',
    minFare: '₹890', buses: 28,
    tag: 'Tech Corridor',
    tagColor: '#8e44ad',
    desc: 'Tech corridor overnight express between two major IT hubs.',
    stops: ['Anantapur', 'Kurnool'],
  },
  {
    from: 'Bangalore', to: 'Chennai',
    distance: '346 km', duration: '6h 00m',
    minFare: '₹550', buses: 30,
    tag: 'Airavat Special',
    tagColor: '#16a085',
    desc: 'High-frequency Volvo multi-axle service connecting South capitals.',
    stops: ['Hosur', 'Krishnagiri', 'Vellore'],
  },
  {
    from: 'Lucknow', to: 'Kanpur',
    distance: '84 km', duration: '1h 45m',
    minFare: '₹149', buses: 35,
    tag: 'Frequent',
    tagColor: '#27ae60',
    desc: 'UP\'s twin-city corridor with the highest bus frequency.',
    stops: ['Unnao'],
  },
  {
    from: 'Delhi', to: 'Dehradun',
    distance: '255 km', duration: '5h 30m',
    minFare: '₹580', buses: 16,
    tag: 'Valley Express',
    tagColor: '#056676',
    desc: 'Direct highway connectivity to Uttarakhand capital and foothills.',
    stops: ['Meerut', 'Muzaffarnagar', 'Roorkee'],
  },
  {
    from: 'Jaipur', to: 'Delhi',
    distance: '281 km', duration: '4h 15m',
    minFare: '₹399', buses: 15,
    tag: 'Rajasthan Special',
    tagColor: '#e67e22',
    desc: 'Pink City to the capital — a favourite for weekend travelers.',
    stops: ['Shahpura', 'Behror', 'Rewari'],
  },
  {
    from: 'Kolkata', to: 'Siliguri',
    distance: '560 km', duration: '12h 30m',
    minFare: '₹950', buses: 14,
    tag: 'North Bengal',
    tagColor: '#2c3e50',
    desc: 'Gateway to Darjeeling and Northeast India with luxury sleepers.',
    stops: ['Malda', 'Raiganj', 'Kishanganj'],
  },
  {
    from: 'Ahmedabad', to: 'Surat',
    distance: '265 km', duration: '4h 30m',
    minFare: '₹360', buses: 20,
    tag: 'Diamond Hub',
    tagColor: '#d35400',
    desc: 'Gujarat commercial artery connecting textile and diamond centers.',
    stops: ['Nadiad', 'Anand', 'Vadodara', 'Bharuch'],
  },
  {
    from: 'Bhopal', to: 'Indore',
    distance: '195 km', duration: '3h 30m',
    minFare: '₹320', buses: 26,
    tag: 'Malwa Express',
    tagColor: '#27ae60',
    desc: 'MP express corridor connecting the capital to Cleanest City Indore.',
    stops: ['Sehore', 'Ashta', 'Dewas'],
  },
  {
    from: 'Lucknow', to: 'Varanasi',
    distance: '320 km', duration: '5h',
    minFare: '₹449', buses: 12,
    tag: 'Pilgrimage',
    tagColor: '#c0392b',
    desc: 'Sacred corridor to the Ghats of Varanasi from Lucknow.',
    stops: ['Raebareli', 'Sultanpur'],
  },
  {
    from: 'Delhi', to: 'Chandigarh',
    distance: '248 km', duration: '4h',
    minFare: '₹379', buses: 22,
    tag: 'Volvo AC',
    tagColor: '#1a1a2e',
    desc: 'Premium Volvo fleet on the NH44 — smooth & punctual.',
    stops: ['Panipat', 'Karnal', 'Ambala'],
  },
];

/* ── Stat numbers ────────────────────────────────────────── */
const STATS = [
  { value: '500+', label: 'Routes Covered' },
  { value: '1200+', label: 'Daily Buses' },
  { value: '4.8★', label: 'Avg. Rating' },
  { value: '2M+', label: 'Happy Travelers' },
];

/* ═══════════════════════════════════════════════════════════
   Main Routes Page
═══════════════════════════════════════════════════════════ */
const Home = () => {
  const navigate  = useNavigate();

  const [from, setFrom]       = useState('');
  const [to, setTo]           = useState('');
  const [date, setDate]       = useState('');
  const [ampm, setAmpm]       = useState('');
  const [passengers, setPassengers] = useState(1);
  const [errorMsg, setErrorMsg]     = useState('');
  const [expandedRoute, setExpandedRoute]     = useState(null);
  const [filterTag, setFilterTag]             = useState('All');

  const [trackBusInput, setTrackBusInput]     = useState('');

  const handleHomeTrackNow = () => {
    const busNum = trackBusInput.trim() || 'UP32AB1234';
    navigate('/livetracking', {
      state: { busNo: busNum }
    });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSwap = () => { setFrom(to); setTo(from); };

  const handlePopularRoute = (route) => {
    setFrom(route.from);
    setTo(route.to);
    
    // Immediately navigate to available buses for instant booking
    navigate('/available-buses', {
      state: {
        from: route.from,
        to: route.to,
        date: date || todayStr,
        ampm: ampm || 'AM',
        passengers,
        route: `${route.from} → ${route.to}`,
      },
    });
  };

  const handleSearch = () => {
    const selectedFrom = from.trim() || 'Kanpur';
    const selectedTo   = to.trim() || 'Lucknow';
    const selectedDate = date || todayStr;
    const selectedAmpm = ampm || 'AM';

    if (selectedFrom.toLowerCase() === selectedTo.toLowerCase()) {
      return setErrorMsg('Departure and destination cannot be the same city.');
    }

    setErrorMsg('');
    navigate('/available-buses', {
      state: {
        from: selectedFrom,
        to: selectedTo,
        date: selectedDate,
        ampm: selectedAmpm,
        passengers,
        route: `${selectedFrom} → ${selectedTo}`,
      },
    });
  };

  const uniqueTags = ['All', ...new Set(POPULAR_ROUTES.map(r => r.tag))];
  const filteredRoutes = filterTag === 'All'
    ? POPULAR_ROUTES
    : POPULAR_ROUTES.filter(r => r.tag === filterTag);

  return (
    <div className={styles.page}>

      {/* ══ HERO SEARCH SECTION ══════════════════════════ */}
      <div className={styles.heroSection}>
        <div className={styles.heroBadge}>India's #1 Bus Booking Platform</div>
        <h1 className={styles.heroHeading}>Find Your Route</h1>
        <p className={styles.heroSub}>
          Search across 500+ routes, compare fares and timings, and book instantly.
        </p>

        <div className={styles.searchBox}>
          {errorMsg && <div className={styles.errorMsg}>⚠ {errorMsg}</div>}

          {/* From / Swap / To */}
          <div className={styles.routeRow}>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Leaving From</label>
              <AlphabeticalCityPicker
                label="Leaving From"
                value={from}
                onChange={(val) => { setFrom(val); setErrorMsg(''); }}
                opposingValue={to}
                onSameCitySelected={(cityName) => {
                  setErrorMsg(`Origin and Destination cannot both be "${cityName}".`);
                  setTo('');
                }}
                icon="🟢"
                placeholder="Departure city"
                theme="light"
              />
            </div>

            <button className={styles.swapBtn} onClick={handleSwap} title="Swap cities" type="button">⇄</button>

            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Going To</label>
              <AlphabeticalCityPicker
                label="Going To"
                value={to}
                onChange={(val) => { setTo(val); setErrorMsg(''); }}
                opposingValue={from}
                onSameCitySelected={(cityName) => {
                  setErrorMsg(`Origin and Destination cannot both be "${cityName}".`);
                  setFrom('');
                }}
                icon="🔴"
                placeholder="Destination city"
                theme="light"
              />
            </div>
          </div>

          {/* Date / AM-PM / Passengers */}
          <div className={styles.detailsRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Travel Date</label>
              <input type="date" className={styles.dateInput} value={date} min={todayStr}
                onChange={e => setDate(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Time Preference</label>
              <select className={styles.selectInput} value={ampm}
                onChange={e => setAmpm(e.target.value)}>
                <option value="">Select AM / PM</option>
                <option value="AM">AM — Morning</option>
                <option value="PM">PM — Afternoon / Evening</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Passengers</label>
              <div className={styles.stepper}>
                <button className={styles.stepBtn}
                  onClick={() => setPassengers(p => Math.max(1, p - 1))}
                  disabled={passengers <= 1}>−</button>
                <span className={styles.stepVal}>{passengers}</span>
                <button className={styles.stepBtn}
                  onClick={() => setPassengers(p => Math.min(10, p + 1))}
                  disabled={passengers >= 10}>+</button>
              </div>
            </div>
          </div>

          <button className={styles.searchBtn} onClick={handleSearch}>
            Search Available Buses
          </button>

          {/* Dedicated Direct Bus Tracking Box */}
          <div className={styles.trackBusCardBox}>
            <div className={styles.trackBoxTitle}>Track Bus Live by Registration Number</div>
            <div className={styles.trackBoxRow}>
              <input
                type="text"
                className={styles.trackBusInput}
                placeholder="Enter Bus Reg. No. (e.g. UP32AB1234, DL01CD5678)"
                value={trackBusInput}
                onChange={(e) => setTrackBusInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleHomeTrackNow()}
              />
              <button className={styles.trackNowSubmitBtn} onClick={handleHomeTrackNow}>
                Track Now
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className={styles.quickNavRow}>
            <button
              className={styles.quickNavBtn}
              onClick={() => navigate('/livetracking')}
            >
              Live Bus Tracking
            </button>
            <button
              className={styles.quickNavBtn}
              onClick={() => navigate('/seatbooking')}
            >
              Seat Booking
            </button>
            <button
              className={styles.quickNavBtn}
              onClick={() => navigate('/eticket')}
            >
              View E-Ticket
            </button>
          </div>
        </div>
      </div>

      {/* ══ STATS STRIP ══════════════════════════════════ */}
      <div className={styles.statsStrip}>
        {STATS.map(s => (
          <div key={s.label} className={styles.statItem}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ══ POPULAR ROUTES ═══════════════════════════════ */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Popular Routes</h2>
            <p className={styles.sectionSub}>Most searched and booked routes across India</p>
          </div>
        </div>

        {/* Tag filter pills */}
        <div className={styles.tagFilterRow}>
          {uniqueTags.map(tag => (
            <button
              key={tag}
              className={`${styles.tagFilter} ${filterTag === tag ? styles.tagFilterActive : ''}`}
              onClick={() => setFilterTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Route cards grid */}
        <div className={styles.routeGrid}>
          {filteredRoutes.map((route, i) => (
            <div
              key={i}
              className={`${styles.routeCard} ${expandedRoute === i ? styles.routeCardExpanded : ''}`}
            >
              {/* Tag badge */}
              <div
                className={styles.routeTag}
                style={{ background: route.tagColor }}
              >
                {route.tag}
              </div>

              {/* Cities */}
              <div className={styles.routeCities}>
                <span className={styles.cityFrom}>{route.from}</span>
                <div className={styles.routeArrowLine}>
                  <span className={styles.routeArrowDot} />
                  <div className={styles.routeArrowBar} />
                  <span className={styles.routeArrowHead}>▶</span>
                </div>
                <span className={styles.cityTo}>{route.to}</span>
              </div>

              {/* Key stats */}
              <div className={styles.routeMeta}>
                <div className={styles.routeMetaItem}>
                  <span className={styles.metaKey}>Distance</span>
                  <span className={styles.metaVal}>{route.distance}</span>
                </div>
                <div className={styles.routeMetaItem}>
                  <span className={styles.metaKey}>Duration</span>
                  <span className={styles.metaVal}>{route.duration}</span>
                </div>
                <div className={styles.routeMetaItem}>
                  <span className={styles.metaKey}>From</span>
                  <span className={`${styles.metaVal} ${styles.fareHighlight}`}>{route.minFare}</span>
                </div>
                <div className={styles.routeMetaItem}>
                  <span className={styles.metaKey}>Buses/day</span>
                  <span className={styles.metaVal}>{route.buses}</span>
                </div>
              </div>

              {/* Expandable stops */}
              {expandedRoute === i && (
                <div className={styles.expandedDetails}>
                  <p className={styles.routeDesc}>{route.desc}</p>
                  <div className={styles.stopsRow}>
                    <span className={styles.stopsLabel}>Stops:</span>
                    {route.stops.map((s, idx) => (
                      <span key={idx} className={styles.stopChip}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className={styles.routeActions}>
                <button
                  className={styles.detailsBtn}
                  onClick={() => setExpandedRoute(expandedRoute === i ? null : i)}
                >
                  {expandedRoute === i ? 'Less Info ▲' : 'Route Details ▼'}
                </button>
                <button
                  className={styles.bookRouteBtn}
                  onClick={() => handlePopularRoute(route)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ HOW IT WORKS ═════════════════════════════════ */}
      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>How Booking Works</h2>
            <p className={styles.sectionSub}>Four simple steps to your seat</p>
          </div>
        </div>

        <div className={styles.stepsRow}>
          {[
            { num: '01', title: 'Choose Route', text: 'Select your departure and destination city from our 500+ route network.' },
            { num: '02', title: 'Pick a Bus & Seat', text: 'Compare buses by type, fare, and timing. Pick your preferred seat on an interactive map.' },
            { num: '03', title: 'Verify & Pay', text: 'Complete Aadhaar verification, OTP mobile check, then pay via UPI, Card, or Cash.' },
            { num: '04', title: 'Get Your E-Ticket', text: 'Receive a PDF ticket on SMS & email instantly. Show QR code at boarding.' },
          ].map(step => (
            <div key={step.num} className={styles.stepCard}>
              <div className={styles.stepNum}>{step.num}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepText}>{step.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CTA STRIP ════════════════════════════════════ */}
      <div className={styles.ctaStrip}>
        <div className={styles.ctaContent}>
          <h3 className={styles.ctaTitle}>Ready to travel?</h3>
          <p className={styles.ctaSub}>Over 2 million seats booked on Go-Ticket. Your next journey is a click away.</p>
        </div>
        <div className={styles.ctaBtnRow}>
          <button className={styles.ctaBtn} onClick={() => navigate('/seatbooking')}>
            Book Seats Now
          </button>
          <button className={`${styles.ctaBtn} ${styles.ctaOutlineBtn}`} onClick={() => navigate('/livetracking')}>
            Track Bus Live
          </button>
        </div>
      </div>

      {/* ══ TOP ROUTES & RTC DIRECTORY ══════════════════ */}
      <TopRoutesDirectory />

      <footer className={styles.footer}>
        <p>© 2026 Go-Ticket India. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
