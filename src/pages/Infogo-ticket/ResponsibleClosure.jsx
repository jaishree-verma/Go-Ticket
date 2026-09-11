import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylespages/infopages.module.css';

const ResponsibleClosure = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span className={styles.headerBadge}>SECURITY & VULNERABILITY POLICY</span>
      <h1 className={styles.heading}>Responsible Disclosure Policy</h1>
      <p className={styles.subText}>Security Guidelines and Reporting Framework for GoTicket</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Reporting Vulnerabilities</h2>
        <p className={styles.sectionContent}>
          GoTicket is dedicated to maintaining high standards of data security for travelers.
          If you discover a potential vulnerability in our booking or state machine flows, please report
          it directly to our support desk at <code>security@go-ticket.in</code>.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Safe Harbor Commitment</h2>
        <p className={styles.sectionContent}>
          We commit to not pursuing legal action against security researchers who conduct testing in good faith
          without causing service disruption or compromising passenger data.
        </p>
      </div>

      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
};

export default ResponsibleClosure;
