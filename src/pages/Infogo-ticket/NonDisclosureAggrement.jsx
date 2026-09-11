import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylespages/infopages.module.css';

const NonDisclosureAgreement = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span className={styles.headerBadge}>CONFIDENTIALITY PROTOCOL</span>
      <h1 className={styles.heading}>Non-Disclosure Agreement (NDA)</h1>
      <p className={styles.subText}>GoTicket Bus Partner & Fleet Operator Data Protection Terms</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Proprietary Information</h2>
        <p className={styles.sectionContent}>
          All bus operator schedules, slot allocations, route telemetry, and pricing structures integrated
          within the GoTicket platform are treated as proprietary partner assets.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Passenger Confidentiality</h2>
        <p className={styles.sectionContent}>
          Passenger identity information, travel schedules, and contact details must not be disclosed
          or utilized for unsolicited marketing outside of journey-critical communications.
        </p>
      </div>

      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
};

export default NonDisclosureAgreement;
