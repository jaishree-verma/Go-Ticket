import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylespages/infopages.module.css';

const Reference = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span className={styles.headerBadge}>TECHNICAL REFERENCES</span>
      <h1 className={styles.heading}>System References & Standards</h1>
      <p className={styles.subText}>Standards, Route Corridors, and Verification Frameworks</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Indian Intercity Corridors</h2>
        <p className={styles.sectionContent}>
          Route mappings reference high-density transit corridors including Kanpur ↔ Delhi,
          Lucknow ↔ Delhi, Jaipur ↔ Delhi, Mumbai ↔ Pune, and Bangalore ↔ Hyderabad.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Architectural Standards</h2>
        <p className={styles.sectionContent}>
          Built using React 19 component architecture, OpenStreetMap embed coordinate mapping,
          Haversine distance metrics, and multi-criteria recommendation scoring models.
        </p>
      </div>

      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
};

export default Reference;
