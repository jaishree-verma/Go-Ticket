import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import styles from '../styles/header.module.css';

const NAV_ITEMS = [
  { to: '/',             icon: '🏠',  label: 'HOME',        exact: true },
  { to: '/livetracking', icon: '📍',  label: 'BUS TRACK' },
  { to: '/home',         icon: '🗺️',  label: 'ROUTES' },
  { to: '/eticket',      icon: '🎫',  label: 'E-TICKET' },
  { to: '/seatbooking',  icon: '📋',  label: 'BOOKINGS' },
  { to: '/contact',      icon: '📞',  label: 'CONTACT' },
];

const Header = () => {
  const [showAuth, setShowAuth]     = useState(false);
  const [userName, setUserName]     = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [autoDismissed, setAutoDismissed] = useState(false);

  const location = useLocation();
  const navigate  = useNavigate();

  /* ── Auto-popup on first load if not logged in ── */
  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    } else if (!autoDismissed) {
      // Show login modal after a short delay so the page loads first
      const timer = setTimeout(() => setShowAuth(true), 800);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Re-check userName after modal closes (in case user just logged in) */
  const handleCloseAuth = () => {
    setShowAuth(false);
    setAutoDismissed(true);
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
  };

  // Close mobile menu whenever route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('authToken');
    setUserName('');
    navigate('/');
  };

  const isActive = (to, exact = false) => {
    if (exact) return location.pathname === '/';
    return location.pathname === to;
  };

  return (
    <>
      <header className={styles.header}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link to="/">
            <img src="/images/logo.png" alt="Go Ticket Logo" className={styles.logoImg} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav>
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const requiresAuth = item.to === '/seatbooking' || item.to === '/livetracking';
              return (
                <li key={item.to}>
                  <Link
                    to={requiresAuth && !userName ? '#' : item.to}
                    onClick={(e) => {
                      if (requiresAuth && !userName) {
                        e.preventDefault();
                        setShowAuth(true);
                      }
                    }}
                    className={`${styles.navLink} ${isActive(item.to, item.exact) ? styles.navLinkActive : ''}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              );
            })}

            {/* Auth / User */}
            <li>
              {userName ? (
                <div className={styles.userSection}>
                  <span className={styles.navLink}>
                    👤 Hi, {userName.split(' ')[0]}
                  </span>
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                  </button>
                </div>
              ) : (
                <span
                  className={styles.navLink}
                  onClick={() => setShowAuth(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setShowAuth(true)}
                  style={{ cursor: 'pointer' }}
                >
                  👤 LOGIN
                </span>
              )}
            </li>
          </ul>
        </nav>

        {/* Hamburger (mobile) */}
        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Toggle navigation menu"
        >
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>
      </header>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`${styles.mobileNavLink} ${isActive(item.to, item.exact) ? styles.mobileNavLinkActive : ''}`}
          >
            <span className={styles.mobileNavIcon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className={styles.mobileDivider} />

        <Link to="/seatbooking" className={styles.mobileBookBtn}>
          🚌 &nbsp; Book a Ticket
        </Link>

        {userName ? (
          <div className={styles.mobileNavLink} style={{ justifyContent: 'space-between' }}>
            <span>👤 {userName}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
          </div>
        ) : (
          <button
            onClick={() => { setMobileOpen(false); setShowAuth(true); }}
            className={styles.mobileNavLink}
          >
            <span className={styles.mobileNavIcon}>👤</span>
            LOGIN / SIGNUP
          </button>
        )}
      </div>

      {showAuth && <AuthModal onClose={handleCloseAuth} bookingRequired={!userName} />}
    </>
  );
};

export default Header;
