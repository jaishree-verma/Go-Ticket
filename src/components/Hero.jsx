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
  { city: 'Pondicherry', state: 'Puducherry' },
];

const RECENT_SEARCHES = [
  { from: 'Pune',      to: 'Goa',         date: 'Weekend',         icon: '🌊', price: '₹699', badge: '🌴 Beach' },
  { from: 'Delhi',     to: 'Jaipur',      date: 'Tomorrow',        icon: '⚡', price: '₹499', badge: '🔥 Popular' },
  { from: 'Mumbai',    to: 'Goa',         date: '24 Sep 2025',     icon: '🌴', price: '₹899', badge: '⭐ rated' },
  { from: 'Bangalore', to: 'Chennai',     date: 'Daily Route',     icon: '🚌', price: '₹550', badge: '⚡ 4h 30m' },
  { from: 'Ahmedabad', to: 'Mumbai',      date: 'Daily',           icon: '🏙️', price: '₹420', badge: '✅ AC' },
  { from: 'Hyderabad', to: 'Bangalore',   date: 'Tue 23 Sep',      icon: '🕒', price: '₹799', badge: '🛡️ Sleeper' },
  { from: 'Kanpur',    to: 'Delhi',       date: 'Today',           icon: '🚀', price: '₹620', badge: '🔥 8 left' },
  { from: 'Chennai',   to: 'Pondicherry', date: 'Daily Route',     icon: '🌊', price: '₹299', badge: '✨ AC Seater' },
  { from: 'Lucknow',   to: 'Delhi',       date: 'Today',           icon: '🏛️', price: '₹580', badge: '⚡ 7h' },
  { from: 'Kochi',     to: 'Goa',         date: 'Fri 26 Sep',      icon: '🌺', price: '₹950', badge: '🌴 Scenic' },
];

const HERO_BACKGROUNDS = [
  {
    src: '/images/hero_bus_mountain.jpg',
    alt: 'Luxury Bus on Mountain Road at Dusk',
  },
  {
    src: '/images/hero_mountain_road_clean.jpg',
    alt: 'Scenic Curved Mountain Highway Bus Tour',
  },
];

const formatDisplayDate = (isoDateStr) => {
  if (!isoDateStr) return '';
  try {
    const parts = isoDateStr.split('-');
    if (parts.length !== 3) return isoDateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[parseInt(parts[1], 10) - 1] || parts[1];
    return `${parts[2]} ${month} ${parts[0]}`;
  } catch (e) {
    return isoDateStr;
  }
};

const Hero = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [currentBg, setCurrentBg]   = useState(0);
  const [from, setFrom]             = useState('');
  const [to, setTo]                 = useState('');
  const [date, setDate]             = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown]     = useState(false);

  const fromRef           = useRef(null);
  const toRef             = useRef(null);
  const fromInputRef      = useRef(null);
  const toInputRef        = useRef(null);
  const departureInputRef = useRef(null);
  const returnInputRef    = useRef(null);

  // Background image animation: switches every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setShowFromDropdown(false);
      if (toRef.current   && !toRef.current.contains(e.target))   setShowToDropdown(false);
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

  const handleDepartureClick = () => {
    if (departureInputRef.current) {
      if (typeof departureInputRef.current.showPicker === 'function') {
        try {
          departureInputRef.current.showPicker();
        } catch (err) {
          departureInputRef.current.focus();
        }
      } else {
        departureInputRef.current.focus();
      }
    }
  };

  const handleReturnClick = () => {
    if (returnInputRef.current) {
      if (typeof returnInputRef.current.showPicker === 'function') {
        try {
          returnInputRef.current.showPicker();
        } catch (err) {
          returnInputRef.current.focus();
        }
      } else {
        returnInputRef.current.focus();
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const selectedFrom = from.trim() || 'Kanpur';
    const selectedTo   = to.trim()   || 'Lucknow';
    navigate('/available-buses', {
      state: { 
        from: selectedFrom, 
        to: selectedTo, 
        date, 
        returnDate,
        passengers: 1, 
        route: `${selectedFrom} → ${selectedTo}` 
      },
    });
  };

  const handleRecentSearch = (item) => { setFrom(item.from); setTo(item.to); };

  const filteredFromCities = ALL_INDIAN_CITIES.filter(
    (c) => c.city.toLowerCase().includes(from.toLowerCase()) || c.state.toLowerCase().includes(from.toLowerCase())
  );
  const filteredToCities = ALL_INDIAN_CITIES.filter(
    (c) => c.city.toLowerCase().includes(to.toLowerCase()) || c.state.toLowerCase().includes(to.toLowerCase())
  );

  const todayISO = new Date().toISOString().split('T')[0];

  return (
    <>
      <section className={styles.heroBanner}>

        {/* ── Animated Background Slideshow (Cycles every 2-3s) ── */}
        <div className={styles.leftPanel}>
          <div className={styles.frameTrackContainer}>
            {HERO_BACKGROUNDS.map((bg, idx) => (
              <img
                key={idx}
                src={bg.src}
                alt={bg.alt}
                className={`${styles.bannerImg} ${
                  idx === currentBg ? styles.bannerImgActive : styles.bannerImgHidden
                }`}
              />
            ))}
          </div>
          <div className={styles.videoOverlay}></div>
          <div className={styles.topWhiteFade}></div>
          <div className={styles.bottomWhiteFade}></div>

          {/* Slide indicator dots */}
          <div className={styles.bgSlideIndicators}>
            {HERO_BACKGROUNDS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.bgDot} ${idx === currentBg ? styles.bgDotActive : ''}`}
                onClick={() => setCurrentBg(idx)}
                aria-label={`Switch to background ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── Live ticker ── */}
        <div className={styles.heroLiveTickerBar} style={{ position: 'relative', zIndex: 10, marginBottom: 10 }}>
          <div className={styles.liveStatBadge}>
            <span className={styles.pulsingGreenDot}></span>
            <span><strong>4,820+</strong> Live Buses</span>
          </div>
          <div className={styles.liveStatBadge}>
            <span className={styles.statIcon}>⚡</span>
            <span>Instant E-Ticket</span>
          </div>
          <div className={styles.liveStatBadge}>
            <span className={styles.statIcon}>⭐</span>
            <span><strong>4.9/5</strong> · 2M+ Travelers</span>
          </div>
        </div>

        {/* ── Headline (above the row) ── */}
        <div className={styles.videoTextBlock} style={{ position: 'relative', zIndex: 10, marginBottom: 14, textAlign: 'center' }}>
          <h1 className={styles.videoHeadline}>
            Travel Smarter,<br />Book <span>Faster.</span>
          </h1>
          <p className={styles.videoSubtext}>India's Most Trusted Bus Ticket Platform</p>
        </div>

        {/* ── Glowing Floating Search Card (Exact match to reference pic) ── */}
        <div className={styles.widgetWrapper}>
          <div className={styles.searchCard}>
            <form onSubmit={handleSearchSubmit} className={styles.searchFormRow}>

              {/* 1. Leaving From */}
              <div className={`${styles.fieldCol} ${showFromDropdown ? styles.fieldColOpen : ''}`} ref={fromRef}>
                <label className={styles.fieldLabel}>Leaving From</label>
                <div 
                  className={styles.fieldBox}
                  onClick={() => { fromInputRef.current?.focus(); setShowFromDropdown(true); }}
                >
                  <input
                    ref={fromInputRef}
                    type="text"
                    placeholder="Select departure"
                    value={from}
                    onFocus={() => setShowFromDropdown(true)}
                    onChange={(e) => { setFrom(e.target.value); setShowFromDropdown(true); }}
                    className={styles.fieldInput}
                  />
                  <span className={styles.chevronIcon}>⌵</span>
                </div>
                {showFromDropdown && (
                  <div className={styles.cityDropdownMenu}>
                    {filteredFromCities.length > 0 ? filteredFromCities.map((item, idx) => (
                      <div key={idx} className={styles.cityDropdownItem}
                        onClick={() => { setFrom(item.city); setShowFromDropdown(false); }}>
                        <div className={styles.cityBuildingIcon}>🏢</div>
                        <div className={styles.cityInfo}>
                          <div className={styles.cityName}>{item.city}</div>
                          <div className={styles.stateName}>{item.state}</div>
                        </div>
                      </div>
                    )) : <div className={styles.noCityFound}>No city found</div>}
                  </div>
                )}
              </div>

              {/* Swap button between From & To */}
              <button 
                type="button"
                className={`${styles.swapBtnInline} ${isSwapping ? styles.swapSpin : ''}`}
                onClick={handleSwap}
                title="Swap origin & destination"
              >
                ⇄
              </button>

              {/* 2. Destination */}
              <div className={`${styles.fieldCol} ${showToDropdown ? styles.fieldColOpen : ''}`} ref={toRef}>
                <label className={styles.fieldLabel}>Destination</label>
                <div 
                  className={styles.fieldBox}
                  onClick={() => { toInputRef.current?.focus(); setShowToDropdown(true); }}
                >
                  <input
                    ref={toInputRef}
                    type="text"
                    placeholder="Select destination"
                    value={to}
                    onFocus={() => setShowToDropdown(true)}
                    onChange={(e) => { setTo(e.target.value); setShowToDropdown(true); }}
                    className={styles.fieldInput}
                  />
                  <span className={styles.chevronIcon}>⌵</span>
                </div>
                {showToDropdown && (
                  <div className={styles.cityDropdownMenu}>
                    {filteredToCities.length > 0 ? filteredToCities.map((item, idx) => (
                      <div key={idx} className={styles.cityDropdownItem}
                        onClick={() => { setTo(item.city); setShowToDropdown(false); }}>
                        <div className={styles.cityBuildingIcon}>🏢</div>
                        <div className={styles.cityInfo}>
                          <div className={styles.cityName}>{item.city}</div>
                          <div className={styles.stateName}>{item.state}</div>
                        </div>
                      </div>
                    )) : <div className={styles.noCityFound}>No city found</div>}
                  </div>
                )}
              </div>

              {/* 3. Departure Date */}
              <div className={styles.fieldCol}>
                <label className={styles.fieldLabel}>Departure Date</label>
                <div className={styles.fieldBox} onClick={handleDepartureClick}>
                  <span className={styles.calendarMiniIcon}>📅</span>
                  <span className={styles.dateDisplayText}>
                    {date ? formatDisplayDate(date) : 'Date picker'}
                  </span>
                  <span className={styles.calendarMiniIconRight}>🗓️</span>
                  <input
                    ref={departureInputRef}
                    type="date"
                    min={todayISO}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={styles.hiddenNativeDatePicker}
                    aria-label="Departure Date"
                  />
                </div>
              </div>

              {/* 4. Return Date (optional) */}
              <div className={styles.fieldCol}>
                <label className={styles.fieldLabel}>
                  Return Date <span className={styles.optionalText}>(optional)</span>
                </label>
                <div className={styles.fieldBox} onClick={handleReturnClick}>
                  <span className={styles.calendarMiniIcon}>📅</span>
                  <span className={returnDate ? styles.dateDisplayText : styles.placeholderText}>
                    {returnDate ? formatDisplayDate(returnDate) : 'Date picker'}
                  </span>
                  <span className={styles.calendarMiniIconRight}>
                    {returnDate ? (
                      <span 
                        className={styles.clearDateBtn} 
                        onClick={(e) => { e.stopPropagation(); setReturnDate(''); }}
                        title="Clear return date"
                      >
                        ✕
                      </span>
                    ) : '🗓️'}
                  </span>
                  <input
                    ref={returnInputRef}
                    type="date"
                    min={date || todayISO}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className={styles.hiddenNativeDatePicker}
                    aria-label="Return Date (optional)"
                  />
                </div>
              </div>

              {/* 5. Search Buses button */}
              <div className={styles.buttonCol}>
                <button type="submit" className={styles.searchBusesButton}>
                  Search Buses
                </button>
              </div>

            </form>
          </div>

          {/* ── Popular Routes (Positioned right after destination / search box) ── */}
          <div className={styles.recentSearchesContainer}>
            <div className={styles.recentHeaderRow}>
              <div className={styles.titleFlexGroup}>
                <span className={styles.recentTitle}>Popular Routes</span>
                <span className={styles.liveRoutePulseBadge}>🔥 Live</span>
              </div>
              <span className={styles.recentSubtext}>Tap to auto-fill</span>
            </div>
            <div className={styles.recentGrid}>
              {RECENT_SEARCHES.map((item, idx) => (
                <div key={idx} className={styles.recentCard} onClick={() => handleRecentSearch(item)}>
                  <div className={styles.cardTopRow}>
                    <span className={styles.historyIconBadge}>{item.icon}</span>
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

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} bookingRequired={true} />}
    </>
  );
};

export default Hero;
