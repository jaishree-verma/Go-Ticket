import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import AlphabeticalCityPicker from './AlphabeticalCityPicker';
import styles from '../styles/hero.module.css';

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
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate]             = useState(todayStr);
  const [returnDate, setReturnDate] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [errorMsg, setErrorMsg]     = useState('');
  const [toastMsg, setToastMsg]     = useState('');

  const departureInputRef = useRef(null);
  const returnInputRef    = useRef(null);

  // Background image animation: switches every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSameCityFrom = (cityName) => {
    setToastMsg(`Destination cleared: Origin and Destination cannot both be "${cityName}".`);
    setTo('');
    setTimeout(() => setToastMsg(''), 4500);
  };

  const handleSameCityTo = (cityName) => {
    setToastMsg(`Origin cleared: Origin and Destination cannot both be "${cityName}".`);
    setFrom('');
    setTimeout(() => setToastMsg(''), 4500);
  };

  const handleSwap = () => {
    setIsSwapping(true);
    const temp = from;
    setFrom(to);
    setTo(temp);
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
        returnDate,
        passengers: 1,
        route: `${cleanFrom} → ${cleanTo}`,
      },
    });
  };

  const handleRecentSearch = (item) => {
    setFrom(item.from);
    setTo(item.to);
    setErrorMsg('');
  };

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
            {/* Toast Warning for Same City Selection */}
            {toastMsg && (
              <div className={styles.toastBanner}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={styles.toastIcon}>⚠️</span>
                  <span>{toastMsg}</span>
                </div>
                <button
                  type="button"
                  className={styles.closeToastBtn}
                  onClick={() => setToastMsg('')}
                  title="Close message"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Validation Error Banner */}
            {errorMsg && (
              <div className={styles.errorBanner}>
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSearchSubmit} className={styles.searchFormRow}>

              {/* 1. Leaving From (Origin) — Alphabetical A to Z Grouped */}
              <div className={styles.fieldCol}>
                <label className={styles.fieldLabel}>Leaving From</label>
                <AlphabeticalCityPicker
                  label="Leaving From"
                  value={from}
                  onChange={(val) => { setFrom(val); setErrorMsg(''); }}
                  opposingValue={to}
                  onSameCitySelected={handleSameCityFrom}
                  icon="🟢"
                  placeholder="From city"
                  theme="dark"
                />
              </div>

              {/* Swap button between From & To */}
              <button 
                type="button"
                className={`${styles.swapBtnInline} ${isSwapping ? styles.swapSpin : ''}`}
                onClick={handleSwap}
                title="Swap origin & destination"
                aria-label="Swap cities"
              >
                ⇄
              </button>

              {/* 2. Destination (Going To) — Alphabetical A to Z Grouped */}
              <div className={styles.fieldCol}>
                <label className={styles.fieldLabel}>Going To</label>
                <AlphabeticalCityPicker
                  label="Going To"
                  value={to}
                  onChange={(val) => { setTo(val); setErrorMsg(''); }}
                  opposingValue={from}
                  onSameCitySelected={handleSameCityTo}
                  icon="🔴"
                  placeholder="To city"
                  theme="dark"
                />
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

              {/* 5. Search Buses Button — Central Visual Focus */}
              <div className={styles.buttonCol}>
                <button type="submit" className={styles.searchBusesButton} id="search-buses-cta">
                  <span className={styles.btnBusIcon}>🚌</span>
                  <span className={styles.btnText}>SEARCH BUSES</span>
                  <span className={styles.btnArrow}>➔</span>
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
