import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylespages/seatbooking.module.css';

const CITIES = [
  'Agra', 'Ahmedabad', 'Allahabad', 'Amritsar', 'Bengaluru', 'Bhopal',
  'Bhubaneswar', 'Chandigarh', 'Chennai', 'Coimbatore', 'Dehradun', 'Delhi',
  'Faridabad', 'Ghaziabad', 'Gurgaon', 'Guwahati', 'Hyderabad', 'Indore',
  'Jaipur', 'Jammu', 'Jodhpur', 'Kanpur', 'Kochi', 'Kolkata', 'Lucknow',
  'Ludhiana', 'Mathura', 'Mumbai', 'Mysuru', 'Nagpur', 'Nashik', 'Noida',
  'Patna', 'Pune', 'Raipur', 'Rajkot', 'Ranchi', 'Surat', 'Varanasi',
  'Visakhapatnam', 'Prayagraj', 'Greater Noida', 'Meerut', 'Moradabad',
];

const POPULAR_ROUTES = [
  { from: 'Kanpur',   to: 'Lucknow'   },
  { from: 'Delhi',    to: 'Agra'      },
  { from: 'Mumbai',   to: 'Pune'      },
  { from: 'Jaipur',   to: 'Delhi'     },
  { from: 'Lucknow',  to: 'Varanasi'  },
  { from: 'Delhi',    to: 'Chandigarh'},
];

const SeatBooking = () => {
  const [from, setFrom]           = useState('');
  const [to, setTo]               = useState('');
  const [date, setDate]           = useState('');
  const [ampm, setAmpm]           = useState('');
  const [passengers, setPassengers] = useState(1);
  const [errorMsg, setErrorMsg]   = useState('');

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions]     = useState([]);

  const fromRef = useRef(null);
  const toRef   = useRef(null);
  const navigate = useNavigate();

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

  const handlePopularRoute = (route) => {
    setFrom(route.from);
    setTo(route.to);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  const handleBooking = () => {
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

  // Today in YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>
        Book Seats by Entering Journey Details
      </h2>

      {/* Error */}
      {errorMsg && <div className={styles.errorMsg}>⚠️ {errorMsg}</div>}

      {/* Route Row: From → Swap → To */}
      <div className={styles.routeSelector}>
        {/* FROM */}
        <div className={styles.inputWrapper} ref={fromRef}>
          <input
            type="text"
            placeholder="From (e.g. Kanpur)"
            value={from}
            onChange={handleFromChange}
            autoComplete="off"
          />
          {fromSuggestions.length > 0 && (
            <div className={styles.suggestions}>
              {fromSuggestions.map((city) => (
                <div
                  key={city}
                  className={styles.suggestion}
                  onMouseDown={() => { setFrom(city); setFromSuggestions([]); }}
                >
                  📍 {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap */}
        <button className={styles.swapBtn} onClick={handleSwap} title="Swap cities">
          ⇄
        </button>

        {/* TO */}
        <div className={styles.inputWrapper} ref={toRef}>
          <input
            type="text"
            placeholder="To (e.g. Delhi)"
            value={to}
            onChange={handleToChange}
            autoComplete="off"
          />
          {toSuggestions.length > 0 && (
            <div className={styles.suggestions}>
              {toSuggestions.map((city) => (
                <div
                  key={city}
                  className={styles.suggestion}
                  onMouseDown={() => { setTo(city); setToSuggestions([]); }}
                >
                  📍 {city}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date + AM/PM */}
      <div className={styles.detailsRow}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Travel Date</label>
          <input
            type="date"
            value={date}
            min={todayStr}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className={styles.timeGroup}>
          <select
            value={ampm}
            onChange={(e) => setAmpm(e.target.value)}
            className={styles.select}
          >
            <option value="">Select AM / PM</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {/* Passengers Stepper */}
      <div className={styles.stepperRow}>
        <label className={styles.label}>Passengers:</label>
        <button
          className={styles.stepperBtn}
          onClick={() => setPassengers((p) => Math.max(1, p - 1))}
          disabled={passengers <= 1}
        >
          −
        </button>
        <span className={styles.stepperValue}>{passengers}</span>
        <button
          className={styles.stepperBtn}
          onClick={() => setPassengers((p) => Math.min(10, p + 1))}
          disabled={passengers >= 10}
        >
          +
        </button>
      </div>

      {/* Submit */}
      <button className={styles.bookButton} onClick={handleBooking}>
        <b>🔍 Search Buses</b>
      </button>

      {/* Popular Routes */}
      <div className={styles.popularRoutes}>
        <p className={styles.popularTitle}>Popular Routes</p>
        <div className={styles.routeTags}>
          {POPULAR_ROUTES.map((r) => (
            <button
              key={`${r.from}-${r.to}`}
              className={styles.routeTag}
              onClick={() => handlePopularRoute(r)}
            >
              {r.from} → {r.to}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
