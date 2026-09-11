import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylespages/infopages.module.css';

const WorkingCriteria = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span className={styles.headerBadge}>OPERATIONAL CRITERIA</span>
      <h1 className={styles.heading}>Platform Working Criteria</h1>
      <p className={styles.subText}>Service Level Standards for Operators and Travelers</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Bus Fleet Standards</h2>
        <p className={styles.sectionContent}>
          All verified operators on GoTicket must maintain modern fleet standards, including climate control,
          sanitized seating layouts, operational charging ports, and punctual departure windows.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. 24/7 Support Escalation</h2>
        <p className={styles.sectionContent}>
          Travelers have continuous access to the Tixie AI assistant and our toll-free passenger hotline
          for instant trip assistance, boarding point guidance, and delay notifications.
        </p>
      </div>

      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
};

export default WorkingCriteria;
