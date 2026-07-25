import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import styles from '../styles/hero.module.css';

const ALL_INDIAN_CITIES = [
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Goa', state: 'Goa' },
  { city: 'Vijayawada', state: 'Andhra Pradesh' },
  { city: 'Nellore', state: 'Andhra Pradesh' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Mangalore', state: 'Karnataka' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { city: 'Kanpur', state: 'Uttar Pradesh' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Varanasi', state: 'Uttar Pradesh' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Surat', state: 'Gujarat' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Agra', state: 'Uttar Pradesh' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Madurai', state: 'Tamil Nadu' },
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Trivandrum', state: 'Kerala' },
  { city: 'Kozhikode', state: 'Kerala' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Patna', state: 'Bihar' },
  { city: 'Chandigarh', state: 'Punjab' },
  { city: 'Amritsar', state: 'Punjab' },
  { city: 'Ludhiana', state: 'Punjab' },
  { city: 'Dehradun', state: 'Uttarakhand' },
  { city: 'Rishikesh', state: 'Uttarakhand' },
  { city: 'Shimla', state: 'Himachal Pradesh' },
  { city: 'Manali', state: 'Himachal Pradesh' },
  { city: 'Guwahati', state: 'Assam' },
  { city: 'Bhubaneswar', state: 'Odisha' },
  { city: 'Cuttack', state: 'Odisha' },
  { city: 'Raipur', state: 'Chhattisgarh' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Nashik', state: 'Maharashtra' },
  { city: 'Vadodara', state: 'Gujarat' },
  { city: 'Rajkot', state: 'Gujarat' },
  { city: 'Udaipur', state: 'Rajasthan' },
  { city: 'Jodhpur', state: 'Rajasthan' },
  { city: 'Kota', state: 'Rajasthan' },
  { city: 'Gwalior', state: 'Madhya Pradesh' },
  { city: 'Jabalpur', state: 'Madhya Pradesh' },
  { city: 'Tirupati', state: 'Andhra Pradesh' },
  { city: 'Kakinada', state: 'Andhra Pradesh' },
  { city: 'Rajahmundry', state: 'Andhra Pradesh' },
  { city: 'Guntur', state: 'Andhra Pradesh' },
  { city: 'Mysore', state: 'Karnataka' },
  { city: 'Hubli', state: 'Karnataka' },
  { city: 'Belgaum', state: 'Karnataka' },
  { city: 'Salem', state: 'Tamil Nadu' },
  { city: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { city: 'Tirunelveli', state: 'Tamil Nadu' },
  { city: 'Pondicherry', state: 'Puducherry' }
];

const RECENT_SEARCHES = [
  { from: 'Hyderabad', to: 'Bangalore', date: 'Tue 23 Sep 2025' },
  { from: 'Kanpur', to: 'Delhi', date: 'Today' }
];

const Hero = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  const [activeTab, setActiveTab] = useState('buses');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown]     = useState(false);

  const fromRef = useRef(null);
  const toRef   = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const selectedFrom = from.trim() || 'Kanpur';
    const selectedTo = to.trim() || 'Lucknow';

    navigate('/available-buses', {
      state: {
        from: selectedFrom,
        to: selectedTo,
        date: date,
        passengers: 1,
        route: `${selectedFrom} → ${selectedTo}`,
      },
    });
  };

  const setQuickDate = (type) => {
    const d = new Date();
    if (type === 'tomorrow') d.setDate(d.getDate() + 1);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleRecentSearch = (item) => {
    setFrom(item.from);
    setTo(item.to);
  };

  const filteredFromCities = ALL_INDIAN_CITIES.filter((c) =>
    c.city.toLowerCase().includes(from.toLowerCase()) ||
    c.state.toLowerCase().includes(from.toLowerCase())
  );

  const filteredToCities = ALL_INDIAN_CITIES.filter((c) =>
    c.city.toLowerCase().includes(to.toLowerCase()) ||
    c.state.toLowerCase().includes(to.toLowerCase())
  );

  return (
    <>
      <section className={styles.heroBanner}>
        {/* Full-width KSRTC Tea Garden Bus Banner */}
        <div className={styles.bannerImageContainer}>
          <img
            src="/images/ksrtc_yellow_bus.jpg"
            alt="KSRTC Bus on Winding Tea Garden Road"
            className={styles.bannerImg}
          />
          <div className={styles.bannerOverlay}></div>
        </div>

        {/* Floating Multi-Transport Search Widget */}
        <div className={styles.widgetWrapper}>
          <div className={styles.searchCard}>
            {/* Top Transport Category Tabs */}
            <div className={styles.tabHeader}>
              <div className={styles.tabsList}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'buses' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('buses')}
                >
                  <span className={styles.tabIconBadge}>🚌</span> Buses
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'flights' ? styles.tabActive : ''}`}
                  onClick={() => navigate('/home')}
                >
                  <span className={styles.tabIconBadge}>✈️</span> Flights
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'trains' ? styles.tabActive : ''}`}
                  onClick={() => navigate('/home')}
                >
                  <span className={styles.tabIconBadge}>🚆</span> Trains
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === 'hotels' ? styles.tabActive : ''}`}
                  onClick={() => navigate('/home')}
                >
                  <span className={styles.tabIconBadge}>🏨</span> Hotels
                </button>
              </div>

              <span className={styles.taglineText}>India’s Fastest Bus Ticket Booking Platform</span>
            </div>

            {/* Main Search Row Form */}
            <form onSubmit={handleSearchSubmit} className={styles.searchFormRow}>
              {/* Leaving From Input & Dropdown */}
              <div className={styles.inputCell} ref={fromRef}>
                <div className={styles.cellContent}>
                  <label>Leaving From</label>
                  <input
                    type="text"
                    placeholder="Leaving From"
                    value={from}
                    onFocus={() => setShowFromDropdown(true)}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      setShowFromDropdown(true);
                    }}
                  />
                </div>

                {/* Dropdown Menu matching user image reference */}
                {showFromDropdown && (
                  <div className={styles.cityDropdownMenu}>
                    {filteredFromCities.length > 0 ? (
                      filteredFromCities.map((item, idx) => (
                        <div
                          key={idx}
                          className={styles.cityDropdownItem}
                          onClick={() => {
                            setFrom(item.city);
                            setShowFromDropdown(false);
                          }}
                        >
                          <div className={styles.cityBuildingIcon}>🏢</div>
                          <div className={styles.cityInfo}>
                            <div className={styles.cityName}>{item.city}</div>
                            <div className={styles.stateName}>{item.state}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noCityFound}>No matching city</div>
                    )}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <button
                type="button"
                className={styles.swapBtn}
                onClick={() => { setFrom(to); setTo(from); }}
                title="Swap Source & Destination"
              >
                ⇄
              </button>

              {/* Going To Input & Dropdown */}
              <div className={styles.inputCell} ref={toRef}>
                <div className={styles.cellContent}>
                  <label>Going To</label>
                  <input
                    type="text"
                    placeholder="Going To"
                    value={to}
                    onFocus={() => setShowToDropdown(true)}
                    onChange={(e) => {
                      setTo(e.target.value);
                      setShowToDropdown(true);
                    }}
                  />
                </div>

                {/* Dropdown Menu matching user image reference */}
                {showToDropdown && (
                  <div className={styles.cityDropdownMenu}>
                    {filteredToCities.length > 0 ? (
                      filteredToCities.map((item, idx) => (
                        <div
                          key={idx}
                          className={styles.cityDropdownItem}
                          onClick={() => {
                            setTo(item.city);
                            setShowToDropdown(false);
                          }}
                        >
                          <div className={styles.cityBuildingIcon}>🏢</div>
                          <div className={styles.cityInfo}>
                            <div className={styles.cityName}>{item.city}</div>
                            <div className={styles.stateName}>{item.state}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noCityFound}>No matching city</div>
                    )}
                  </div>
                )}
              </div>

              {/* Departure Date */}
              <div className={styles.inputCell}>
                <span className={styles.cellIcon}>📅</span>
                <div className={styles.cellContent}>
                  <label>Departure Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Quick Today / Tomorrow Chips */}
              <div className={styles.quickDateGroup}>
                <button type="button" className={styles.dateChip} onClick={() => setQuickDate('today')}>
                  Today
                </button>
                <button type="button" className={styles.dateChip} onClick={() => setQuickDate('tomorrow')}>
                  Tomorrow
                </button>
              </div>

              {/* Red Pill Search Submit Button */}
              <button type="submit" className={styles.submitSearchBtn}>
                Search ➔
              </button>
            </form>
          </div>

          {/* Recent Searches */}
          <div className={styles.recentSearchesContainer}>
            <span className={styles.recentTitle}>Recent searches</span>
            <div className={styles.recentGrid}>
              {RECENT_SEARCHES.map((item, idx) => (
                <div key={idx} className={styles.recentCard} onClick={() => handleRecentSearch(item)}>
                  <span className={styles.historyIconBadge}>🕒</span>
                  <div>
                    <strong>{item.from} ➔ {item.to}</strong>
                    <small>{item.date}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          bookingRequired={true}
        />
      )}
    </>
  );
};

export default Hero;
