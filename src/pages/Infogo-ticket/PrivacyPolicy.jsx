import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylespages/infopages.module.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span className={styles.headerBadge}>LEGAL & COMPLIANCE</span>
      <h1 className={styles.heading}>Privacy Policy</h1>
      <p className={styles.subText}>Last updated: September 2026 | GoTicket Passenger Privacy Framework</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
        <p className={styles.sectionContent}>
          GoTicket collects passenger travel information solely to facilitate intercity bus reservations,
          ticketing delivery, and safety compliance across Indian transit corridors. This includes:
        </p>
        <ul className={styles.list}>
          <li>Passenger contact details (Full Name, 10-digit Indian Mobile Number, Email Address).</li>
          <li>Government identity verification numbers (masked Aadhaar details for boarding passes).</li>
          <li>Journey metadata (Source city, Destination city, travel dates, seat preferences).</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. How Your Data Is Used</h2>
        <p className={styles.sectionContent}>
          Your data is used strictly to issue digital E-Tickets, dispatch simulated SMS/Email notifications,
          render interactive seat layout allocations, and calculate GPS live tracking distances.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Data Security & Storage</h2>
        <p className={styles.sectionContent}>
          In this academic/demonstration environment, active user sessions and booking receipts are kept
          within client-side browser storage and are never shared with unauthorized third-party trackers.
        </p>
      </div>

      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
};

export default PrivacyPolicy;
