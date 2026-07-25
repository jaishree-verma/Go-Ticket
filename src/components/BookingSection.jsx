import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/bookingsection.module.css';

const STEPS = [
  {
    step: '01',
    icon: '🔍',
    title: 'Search Route & Date',
    highlight: 'Instant City Match',
    desc: 'Enter departure & destination cities with travel date on our quick search bar.'
  },
  {
    step: '02',
    icon: '🚌',
    title: 'Compare & Choose Bus',
    highlight: 'Volvo, Sleeper & AC',
    desc: 'Filter buses by departure time, seat type, operator ratings & fare prices.'
  },
  {
    step: '03',
    icon: '🪑',
    title: 'Pick Preferred Seat',
    highlight: 'Window & Berth Views',
    desc: 'Select your preferred window or sleeper berth with live seat availability maps.'
  },
  {
    step: '04',
    icon: '⚡',
    title: 'Instant E-Ticket Pass',
    highlight: 'Zero Convenience Fee',
    desc: 'Pay securely via UPI or Card to receive instant SMS & WhatsApp QR passes.'
  }
];

const BookingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="how-to-book" className={styles.bookingSection}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <span className={styles.sectionBadge}>EASY &amp; TRANSPARENT BOOKING</span>
          <h2 className={styles.heading}>How to Book Your Bus Ticket in 4 Simple Steps</h2>
        </div>

        <div className={styles.stepsGrid}>
          {STEPS.map((s, idx) => (
            <div key={idx} className={styles.stepCard}>
              <div className={styles.stepHeaderRow}>
                <div className={styles.stepBadge}>{s.step}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
              </div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <span className={styles.highlightBadge}>{s.highlight}</span>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaArea}>
          <button className={styles.bookingButton} onClick={() => navigate('/seatbooking')}>
            <b>Book Your Ticket Now</b>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
