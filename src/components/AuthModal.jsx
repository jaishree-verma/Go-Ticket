import React, { useState } from 'react';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import styles from '../stylespages/login-signup.module.css';

const AuthModal = ({ onClose, bookingRequired = false }) => {
  const [isNewUser, setIsNewUser] = useState(null); // null = prompt, true = signup, false = login

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.title}>
            {isNewUser === null ? 'Welcome' : isNewUser ? 'Sign up' : 'Login'}
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Booking required banner */}
        {bookingRequired && (
          <div className={styles.bookingBanner}>
            🔒 <strong>Login required</strong> to book tickets. Please sign in or create a free account.
          </div>
        )}

        {/* Step 1: Prompt box */}
        {isNewUser === null && (
          <div className={styles.promptWrapper}>
            <div className={styles.promptBox}>
              <h2 className={styles.promptTitle}>New user?</h2>
              <div className={styles.btnRow}>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => setIsNewUser(true)}
                >
                  Yes — Sign Up
                </button>
                <button
                  className={styles.btn}
                  onClick={() => setIsNewUser(false)}
                >
                  No — Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Signup or Login */}
        {isNewUser === true && (
          <Signup onSwitchToLogin={() => setIsNewUser(false)} />
        )}

        {isNewUser === false && (
          <Login onSwitchToSignup={() => setIsNewUser(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
