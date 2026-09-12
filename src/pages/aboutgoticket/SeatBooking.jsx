import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopRoutesDirectory from '../../components/TopRoutesDirectory';
import styles from '../../stylespages/seatbooking.module.css';

const BUS_TYPES = [
  {
    id: 'AC',
    label: 'AC',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
        <line x1="19.07" y1="4.93" x2="4.93" y2="19.07"></line>
        <circle cx="12" cy="12" r="2.5" fill="currentColor"></circle>
      </svg>
    ),
  },
  {
    id: 'Seater',
    label: 'Seater',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3v9a3 3 0 0 0 3 3h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1z"></path>
        <path d="M5 18h14"></path>
        <path d="M7 18v3"></path>
        <path d="M17 18v3"></path>
      </svg>
    ),
  },
  {
    id: 'Sleeper',
    label: 'Sleeper',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4v16"></path>
        <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
        <path d="M2 17h20"></path>
        <path d="M6 8v3a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8"></path>
      </svg>
    ),
  },
  {
    id: 'Non AC',
    label: 'Non AC',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="3" x2="12" y2="21"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="5.5" y1="5.5" x2="18.5" y2="18.5"></line>
        <line x1="18.5" y1="5.5" x2="5.5" y2="18.5"></line>
        <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2.5"></line>
      </svg>
    ),
  },
  {
    id: 'Bus Track',
    label: 'Bus Track',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a6 6 0 0 0-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 0 0-6-6z"></path>
        <circle cx="12" cy="8" r="2.5" fill="currentColor"></circle>
        <path d="M7 20a7 7 0 0 0 10 0"></path>
      </svg>
    ),
  },
  {
    id: 'New Buses',
    label: 'New Buses',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="14" rx="3"></rect>
        <line x1="4" y1="9" x2="20" y2="9"></line>
        <circle cx="8" cy="14" r="1.5" fill="currentColor"></circle>
        <circle cx="16" cy="14" r="1.5" fill="currentColor"></circle>
        <path d="M6 17v3"></path>
        <path d="M18 17v3"></path>
      </svg>
    ),
  },
  {
    id: 'Offers',
    label: 'Offers',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        <text x="12" y="16.5" fontSize="7" fontWeight="bold" textAnchor="middle" fill="currentColor">%</text>
      </svg>
    ),
  },
];

const CITIES = [
  'Agra', 'Ahmedabad', 'Allahabad', 'Amritsar', 'Bengaluru', 'Bhopal',
  'Bhubaneswar', 'Chandigarh', 'Chennai', 'Coimbatore', 'Dehradun', 'Delhi',
  'Faridabad', 'Ghaziabad', 'Gurgaon', 'Guwahati', 'Hyderabad', 'Indore',
  'Jaipur', 'Jammu', 'Jodhpur', 'Kanpur', 'Kochi', 'Kolkata', 'Lucknow',
  'Ludhiana', 'Mathura', 'Mumbai', 'Mysuru', 'Nagpur', 'Nashik', 'Noida',
  'Patna', 'Pune', 'Raipur', 'Rajkot', 'Ranchi', 'Surat', 'Varanasi',
  'Visakhapatnam', 'Prayagraj', 'Greater Noida', 'Meerut', 'Moradabad',
];

const SeatBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [from, setFrom]           = useState(location.state?.from || '');
  const [to, setTo]               = useState(location.state?.to || '');
  const [date, setDate]           = useState('');
  const [ampm, setAmpm]           = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedBusTypes, setSelectedBusTypes] = useState([]);
  const [trackBusInput, setTrackBusInput] = useState('');
  const [errorMsg, setErrorMsg]   = useState('');

  const toggleBusType = (typeId) => {
    setSelectedBusTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  const handleTrackNow = () => {
    const clean = trackBusInput.trim().toUpperCase();
    if (!clean) return;
    navigate('/livetracking', { state: { busNo: clean } });
  };

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions]     = useState([]);

  const fromRef = useRef(null);
  const toRef   = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setFromSuggestions([]);
      if (toRef.current   && !toRef.current.contains(e.target))   setToSuggestions([]);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getSuggestions = (val) =>
    val.length < 1
      ? []
      : CITIES.filter((c) => c.toLowerCase().startsWith(val.toLowerCase())).slice(0, 6);

  const handleFromChange = (e) => {
    setFrom(e.target.value);
    setFromSuggestions(getSuggestions(e.target.value));
  };

  const handleToChange = (e) => {
    setTo(e.target.value);
    setToSuggestions(getSuggestions(e.target.value));
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  const handleBooking = () => {
    const cleanFrom = from.trim();
    const cleanTo   = to.trim();

    if (!cleanFrom) {
      setErrorMsg('Please select or enter departure city.');
      return;
    }

    if (!cleanTo) {
      setErrorMsg('Please select or enter destination city.');
      return;
    }

    if (cleanFrom.toLowerCase() === cleanTo.toLowerCase()) {
      setErrorMsg('Departure and destination cities cannot be the same.');
      return;
    }

    if (date && date < todayStr) {
      setErrorMsg('Travel date cannot be in the past.');
      return;
    }

    setErrorMsg('');
    navigate('/available-buses', {
      state: {
        from: cleanFrom,
        to: cleanTo,
        date: date || todayStr,
        ampm: ampm || 'AM',
        passengers,
        route: `${cleanFrom} → ${cleanTo}`,
        selectedBusTypes,
      },
    });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className={styles.page}>
        <h2 className={styles.heading}>
          Book Seats by Entering Journey Details
        </h2>

        {/* Error */}
        {errorMsg && <div className={styles.errorMsg}>⚠️ {errorMsg}</div>}

        {/* ── Main White Search Card (Exact Match to User Image) ── */}
        <div className={styles.searchBox}>
          {/* Row 1: From / Swap / To */}
          <div className={styles.routeRow}>
            <div className={styles.inputWrapper} ref={fromRef}>
              <label className={styles.inputLabel}>FROM</label>
              <input
                className={styles.cityInput}
                type="text"
                placeholder="Departure city"
                value={from}
                autoComplete="off"
                onChange={handleFromChange}
              />
              {fromSuggestions.length > 0 && (
                <div className={styles.suggestions}>
                  {fromSuggestions.map((c) => (
                    <div
                      key={c}
                      className={styles.suggestion}
                      onMouseDown={() => { setFrom(c); setFromSuggestions([]); }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className={styles.swapBtn} onClick={handleSwap} title="Swap cities">
              ⇄
            </button>

            <div className={styles.inputWrapper} ref={toRef}>
              <label className={styles.inputLabel}>TO</label>
              <input
                className={styles.cityInput}
                type="text"
                placeholder="Destination city"
                value={to}
                autoComplete="off"
                onChange={handleToChange}
              />
              {toSuggestions.length > 0 && (
                <div className={styles.suggestions}>
                  {toSuggestions.map((c) => (
                    <div
                      key={c}
                      className={styles.suggestion}
                      onMouseDown={() => { setTo(c); setToSuggestions([]); }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Travel Date / Time Preference / Passengers */}
          <div className={styles.detailsRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>TRAVEL DATE</label>
              <input
                type="date"
                className={styles.dateInput}
                value={date}
                min={todayStr}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>TIME PREFERENCE</label>
              <select
                className={styles.selectInput}
                value={ampm}
                onChange={(e) => setAmpm(e.target.value)}
              >
                <option value="">Select AM / PM</option>
                <option value="AM">AM — Morning</option>
                <option value="PM">PM — Afternoon / Evening</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>PASSENGERS</label>
              <div className={styles.stepper}>
                <button
                  type="button"
                  className={styles.stepBtn}
                  onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                  disabled={passengers <= 1}
                >
                  −
                </button>
                <span className={styles.stepVal}>{passengers}</span>
                <button
                  type="button"
                  className={styles.stepBtn}
                  onClick={() => setPassengers((p) => Math.min(10, p + 1))}
                  disabled={passengers >= 10}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Bus Type Filter Selection (Image 5) */}
          <div className={styles.busTypeSection}>
            <div className={styles.busTypeTitle}>BUS TYPE</div>
            <div className={styles.busTypeGrid}>
              {BUS_TYPES.map((bt) => {
                const isSelected = selectedBusTypes.includes(bt.id);
                return (
                  <button
                    key={bt.id}
                    type="button"
                    className={`${styles.busTypeCard} ${isSelected ? styles.busTypeCardActive : ''}`}
                    onClick={() => toggleBusType(bt.id)}
                    title={`Filter by ${bt.label}`}
                  >
                    <span className={styles.busTypeIcon}>{bt.icon}</span>
                    <span className={styles.busTypeLabel}>{bt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full-Width Search Button */}
          <button className={styles.searchBtn} onClick={handleBooking}>
            Search Available Buses
          </button>

          {/* Dedicated Direct Bus Tracking Box */}
          <div className={styles.trackBusCardBox}>
            <div className={styles.trackBoxTitle}>TRACK BUS LIVE BY REGISTRATION NUMBER</div>
            <div className={styles.trackBoxRow}>
              <input
                type="text"
                className={styles.trackBusInput}
                placeholder="Enter Bus Reg. No. (e.g. UP32AB1234, DL01CD5678)"
                value={trackBusInput}
                onChange={(e) => setTrackBusInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleTrackNow()}
              />
              <button type="button" className={styles.trackNowSubmitBtn} onClick={handleTrackNow}>
                Track Now
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className={styles.quickNavRow}>
            <button
              type="button"
              className={styles.quickNavBtn}
              onClick={() => navigate('/livetracking')}
            >
              Live Bus Tracking
            </button>
            <button
              type="button"
              className={styles.quickNavBtn}
              onClick={() => navigate('/seatbooking')}
            >
              Seat Booking
            </button>
            <button
              type="button"
              className={styles.quickNavBtn}
              onClick={() => navigate('/eticket')}
            >
              View E-Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Directory of Routes, Top Cities, RTC Buses, and Bus Operators at the bottom */}
      <TopRoutesDirectory />

      {/* Clean Copyright Bottom Bar */}
      <footer className={styles.copyrightBar}>
        <p>© 2026 Go Ticket India. All rights reserved.</p>
      </footer>
    </>
  );
};

export default SeatBooking;
