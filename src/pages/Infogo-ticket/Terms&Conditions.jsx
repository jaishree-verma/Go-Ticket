import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylespages/infopages.module.css';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span className={styles.headerBadge}>TERMS OF SERVICE</span>
      <h1 className={styles.heading}>Terms &amp; Conditions</h1>
      <p className={styles.subText}>Effective: September 2026 | GoTicket Platform Usage Guidelines</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Booking & Seat Allocation</h2>
        <p className={styles.sectionContent}>
          GoTicket operates as an intelligent intercity bus aggregation and conversational travel concierge.
          Seat selections on our 40-seat layout are atomic: no partial bookings are confirmed if any selected
          seat is unavailable.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Agentic Booking Confirmation Gate</h2>
        <p className={styles.sectionContent}>
          Our AI Travel Agent ("Tixie") adheres to strict confirmation protocols. No financial or ticket commitment
          is created until the passenger explicitly approves the Final Booking Summary in the conversational interface.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Cancellations & Rescheduling</h2>
        <p className={styles.sectionContent}>
          Tickets can be reviewed and managed via the E-Ticket portal. Digital passes remain verifiable by the passenger's
          registered mobile number.
        </p>
      </div>

      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
};

export default TermsAndConditions;
