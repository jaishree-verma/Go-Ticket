import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import styles from '../styles/hero.module.css';

const Hero = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  const handleSeatBookingClick = () => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      setShowAuth(true);
    } else {
      navigate('/seatbooking');
    }
  };

  return (
    <>
      <section className={styles.hero}>
        {/* Left side: Text + Buttons + Icons */}
        <div className={styles.heroText}>
          <div className={styles.welcomeBadge}>✨ Welcome to Go Ticket</div>
          <h1><u>GO TICKET</u></h1>
          <p><b>Technology, when combined with innovation, has the power to make everyday life seamless, connected, and smarter.</b></p>

          <div className={styles.searchSection}>
            {/* SEARCH BUSES button -> Navigates to Routes (/home) */}
            <div className={styles.buttons}>
              <button onClick={() => navigate('/home')}>
                🔍 SEARCH BUSES
              </button>
            </div>

            {/* Transport icons */}
            <div className={styles.transportIcons}>
              <img src="/images/About us (5).png" alt="Plane" />
              <img src="/images/About us (2).png" alt="Train" />
              <img src="/images/About us (4).png" alt="Bus" />
              <img src="/images/About us (3).png" alt="Car" />
            </div>

            {/* SEAT BOOKING button -> Navigates to Bookings (/seatbooking) with auth check */}
            <div className={styles.seatBooking}>
              <button onClick={handleSeatBookingClick}>
                🪑 SEAT BOOKING
              </button>
            </div>
          </div>
        </div>

        {/* Right side: Bus image */}
        <div className={styles.heroImage}>
          <img src="/images/About us (1).png" alt="Go-Ticket Express Bus" />
        </div>
      </section>

      {/* Auth Modal if seat booking clicked without login */}
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
