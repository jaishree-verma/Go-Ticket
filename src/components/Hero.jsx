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
  { from: 'Delhi', to: 'Jaipur', date: 'Tomorrow', icon: '⚡', price: '₹499', badge: '🔥 Popular' },
  { from: 'Mumbai', to: 'Goa', date: '24 Sep 2025', icon: '🌴', price: '₹899', badge: '⭐ 4.9 Rated' },
  { from: 'Bangalore', to: 'Chennai', date: 'Daily Route', icon: '🚌', price: '₹550', badge: '⚡ 4h 30m' },
  { from: 'Hyderabad', to: 'Bangalore', date: 'Tue 23 Sep 2025', icon: '🕒', price: '₹799', badge: '🛡️ Sleeper' },
  { from: 'Kanpur', to: 'Delhi', date: 'Today', icon: '🚀', price: '₹620', badge: '🔥 8 Seats Left' },
  { from: 'Chennai', to: 'Pondicherry', date: 'Daily Route', icon: '🌊', price: '₹299', badge: '✨ AC Seater' }
];

const formatDateDDMMYYYY = (isoDateStr) => {
  if (!isoDateStr) return '';
  const parts = isoDateStr.split('-');
  if (parts.length !== 3) return isoDateStr;
  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
};

const getTomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const Hero = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  const [activeTab, setActiveTab] = useState('buses');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSwapping, setIsSwapping] = useState(false);

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

  const handleSwap = () => {
    setIsSwapping(true);
    setFrom(to);
    setTo(from);
    setTimeout(() => setIsSwapping(false), 400);
  };

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

  const todayISO = new Date().toISOString().split('T')[0];
  const tomorrowISO = getTomorrowISO();

  return (
    <>
      <section className={styles.heroBanner}>
        {/* Full-section Dynamic Video Background Loop */}
        <div className={styles.bannerImageContainer}>
          <div className={styles.frameTrackContainer}>
            <img
              src="/images/city_bus_shelter_dusk.jpg"
              alt="City Bus Shelter Station at Dusk"
              className={`${styles.bannerImg} ${styles.frame1}`}
            />
            <img
              src="/images/passenger_boarding_hero.jpg"
              alt="Passenger Stepping Inside Modern Luxury Bus"
              className={`${styles.bannerImg} ${styles.frame2}`}
            />
          </div>
          
          {/* Animated Light Particles & Gradient Overlay */}
          <div className={styles.particleField}></div>
          <div className={styles.cinematicGlowOverlay}></div>

          {/* Dynamic Live Ticker Stats Overlay inside Hero */}
          <div className={styles.heroLiveTickerBar}>
            <div className={styles.liveStatBadge}>
              <span className={styles.pulsingGreenDot}></span>
              <span><strong>4,820+</strong> Live Buses Active</span>
            </div>
            <div className={styles.liveStatBadge}>
              <span className={styles.statIcon}>⚡</span>
              <span>Instant E-Ticket Booking</span>
            </div>
            <div className={styles.liveStatBadge}>
              <span className={styles.statIcon}>⭐</span>
              <span><strong>4.9/5</strong> Rating (2M+ Travelers)</span>
            </div>
          </div>
        </div>

        {/* Floating Multi-Transport Search Widget */}
        <div className={styles.widgetWrapper}>
          <div className={styles.searchCard}>
            {/* Dynamic Animated Top Accent Glow Bar */}
            <div className={styles.accentGlowBar}></div>

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

              <span className={styles.taglineText}>
                <span className={styles.livePulseDot}></span> India’s Fastest Bus Ticket Booking Platform
              </span>
            </div>

            {/* Main Search Row Form */}
            <form onSubmit={handleSearchSubmit} className={styles.searchFormRow}>
              {/* Leaving From Input & Dropdown */}
              <div className={styles.inputCell} ref={fromRef}>
                <span className={styles.greenPinIcon} title="Departure Location">🟢</span>
                <div className={styles.cellContent}>
                  <label className={styles.cellLabel}>Leaving From</label>
                  <input
                    type="text"
                    placeholder="Departure City"
                    value={from}
                    onFocus={() => setShowFromDropdown(true)}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      setShowFromDropdown(true);
                    }}
                  />
                </div>

                {/* Dropdown Menu */}
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

              {/* Centered Swap Route Button with Animated Spin */}
              <div className={styles.swapBtnWrapper}>
                <button
                  type="button"
                  className={`${styles.swapBtn} ${isSwapping ? styles.swapSpin : ''}`}
                  onClick={handleSwap}
                  title="Swap Source & Destination"
                >
                  ⇄
                </button>
              </div>

              {/* Going To Input & Dropdown */}
              <div className={styles.inputCell} ref={toRef}>
                <span className={styles.redPinIcon} title="Arrival Location">🔴</span>
                <div className={styles.cellContent}>
                  <label className={styles.cellLabel}>Going To</label>
                  <input
                    type="text"
                    placeholder="Destination City"
                    value={to}
                    onFocus={() => setShowToDropdown(true)}
                    onChange={(e) => {
                      setTo(e.target.value);
                      setShowToDropdown(true);
                    }}
                  />
                </div>

                {/* Dropdown Menu */}
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

              {/* Departure Date Selection with DD-MM-YYYY format preview & calendar icon */}
              <div className={styles.inputCell}>
                <span className={styles.calendarIcon} title="Departure Date">📅</span>
                <div className={styles.cellContent}>
                  <label className={styles.cellLabel}>
                    Departure Date <span className={styles.formattedDateBadge}>({formatDateDDMMYYYY(date)})</span>
                  </label>
                  <input
                    type="date"
                    min={todayISO}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={styles.dateInput}
                  />
                </div>
              </div>

              {/* Quick Date Selector Pills */}
              <div className={styles.quickDateGroup}>
                <button
                  type="button"
                  className={`${styles.dateChip} ${date === todayISO ? styles.dateChipActive : ''}`}
                  onClick={() => setQuickDate('today')}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={`${styles.dateChip} ${date === tomorrowISO ? styles.dateChipActive : ''}`}
                  onClick={() => setQuickDate('tomorrow')}
                >
                  Tomorrow
                </button>
              </div>

              {/* Dynamic Animated Pulse Search Submit Button */}
              <button type="submit" className={styles.submitSearchBtn}>
                <span>Search Buses</span>
                <span className={styles.arrowIconMotion}>➔</span>
              </button>
            </form>
          </div>

          {/* Dynamic Trending Routes Grid with Live Price Badges */}
          <div className={styles.recentSearchesContainer}>
            <div className={styles.recentHeaderRow}>
              <div className={styles.titleFlexGroup}>
                <span className={styles.recentTitle}>Trending & Popular Routes</span>
                <span className={styles.liveRoutePulseBadge}>🔥 Live Updates</span>
              </div>
              <span className={styles.recentSubtext}>Click to quick-select city pairs with instant seat availability</span>
            </div>
            <div className={styles.recentGrid}>
              {RECENT_SEARCHES.map((item, idx) => (
                <div key={idx} className={styles.recentCard} onClick={() => handleRecentSearch(item)}>
                  <div className={styles.cardTopRow}>
                    <span className={styles.historyIconBadge}>{item.icon || '🕒'}</span>
                    <span className={styles.featureBadge}>{item.badge}</span>
                  </div>
                  <div className={styles.recentCardBody}>
                    <strong className={styles.recentRoutePair}>
                      {item.from} <span className={styles.routeArrowIcon}>→</span> {item.to}
                    </strong>
                    <div className={styles.cardFooterFlex}>
                      <small className={styles.recentDatePreview}>{item.date}</small>
                      <span className={styles.priceTag}>from <strong>{item.price}</strong></span>
                    </div>
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
