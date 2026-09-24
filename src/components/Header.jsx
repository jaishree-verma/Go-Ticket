import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import styles from '../styles/header.module.css';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuth, setShowAuth]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [autoDismissed, setAutoDismissed]   = useState(false);

  const location = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !autoDismissed) {
      const timer = setTimeout(() => setShowAuth(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, autoDismissed]);

  const handleCloseAuth = () => {
    setShowAuth(false);
    setAutoDismissed(true);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayName = user?.name ? user.name.split(' ')[0] : '';

  return (
    <>
      <header className={styles.header}>
        <div className={styles.navContainer}>
          {/* Logo & Trusted Customer Laurel Badge */}
          <div className={styles.leftNav}>
            <Link to="/" className={styles.logoLink}>
              <div className={styles.brandLogoBox}>
                <span className={styles.brandTitle}>
                  <span className={styles.brandGo}>Go</span>
                  <span className={styles.brandTicket}>Ticket</span>
                </span>
              </div>
            </Link>

            {/* Golden Laurel Trust Badge */}
            <div className={styles.trustLaurelBadge}>
              <span className={styles.laurelIcon}>🌾</span>
              <div className={styles.trustTextCol}>
                <span className={styles.trustSubtitle}>Trusted by</span>
                <strong className={styles.trustMainTitle}>Indian Customers</strong>
              </div>
              <span className={styles.laurelIcon}>🌾</span>
            </div>

            <div className={styles.categoryGroup}>
              <Link
                to="/"
                className={`${styles.categoryItem} ${location.pathname === '/' || location.pathname === '/available-buses' ? styles.activeCategory : ''}`}
              >
                <span className={styles.categoryIcon}>🚌</span>
                <span className={styles.categoryLabel}>Bus tickets</span>
              </Link>

              <Link
                to="/livetracking"
                className={`${styles.categoryItem} ${location.pathname === '/livetracking' ? styles.activeCategory : ''}`}
              >
                <span className={styles.categoryIcon}>📍</span>
                <span className={styles.categoryLabel}>Bus tracking</span>
              </Link>

              <Link
                to="/eticket"
                className={`${styles.categoryItem} ${location.pathname === '/eticket' ? styles.activeCategory : ''}`}
              >
                <span className={styles.categoryIcon}>📄</span>
                <span className={styles.categoryLabel}>E-Ticket</span>
              </Link>

              <Link
                to="/home"
                className={`${styles.categoryItem} ${location.pathname === '/home' ? styles.activeCategory : ''}`}
              >
                <span className={styles.categoryIcon}>🗺️</span>
                <span className={styles.categoryLabel}>Routes</span>
              </Link>
            </div>
          </div>

          {/* Right Action Options */}
          <div className={styles.rightNav}>
            <Link to="/seatbooking" className={styles.actionItem}>
              <span className={styles.actionIcon}>📋</span>
              <span className={styles.actionLabel}>Bookings</span>
            </Link>

            <Link to="/contact" className={styles.actionItem}>
              <span className={styles.actionIcon}>❓</span>
              <span className={styles.actionLabel}>Help</span>
            </Link>

            {isAuthenticated ? (
              <div className={styles.userSection}>
                <span className={styles.actionItem}>
                  <span className={styles.actionIcon}>👤</span>
                  <span className={styles.actionLabel}>{displayName}</span>
                </span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            ) : (
              <div
                className={styles.actionItem}
                onClick={() => setShowAuth(true)}
                role="button"
                tabIndex={0}
              >
                <span className={styles.actionIcon}>👤</span>
                <span className={styles.actionLabel}>Account</span>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle navigation menu"
          >
            <span className={styles.hamburgerBar} />
            <span className={styles.hamburgerBar} />
            <span className={styles.hamburgerBar} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        <Link to="/" className={styles.mobileNavLink}>🚌 Bus Tickets</Link>
        <Link to="/livetracking" className={styles.mobileNavLink}>📍 Bus Tracking</Link>
        <Link to="/eticket" className={styles.mobileNavLink}>📄 E-Ticket</Link>
        <Link to="/home" className={styles.mobileNavLink}>🗺️ Routes</Link>
        <Link to="/seatbooking" className={styles.mobileNavLink}>📋 Bookings</Link>
        <Link to="/contact" className={styles.mobileNavLink}>❓ Help &amp; Support</Link>

        {isAuthenticated ? (
          <button onClick={handleLogout} className={styles.mobileLogoutBtn}>Logout ({displayName})</button>
        ) : (
          <button onClick={() => { setMobileOpen(false); setShowAuth(true); }} className={styles.mobileNavLink}>
            👤 Account (Login / Signup)
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showAuth && !isAuthenticated && <AuthModal onClose={handleCloseAuth} />}
    </>
  );
};

export default Header;
