import React, { useState } from 'react';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import styles from '../stylespages/login-signup.module.css';

const AuthModal = ({ onClose, bookingRequired = false }) => {
  const [isNewUser, setIsNewUser] = useState(false); // Default to clean Login tab

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        {/* Modal Header */}
        <div className={styles.modalHeaderRow}>
          <div className={styles.tabToggleRow}>
            <button
              className={`${styles.tabBtn} ${!isNewUser ? styles.tabBtnActive : ''}`}
              onClick={() => setIsNewUser(false)}
            >
              Sign In / Login
            </button>
            <button
              className={`${styles.tabBtn} ${isNewUser ? styles.tabBtnActive : ''}`}
              onClick={() => setIsNewUser(true)}
            >
              Create Account
            </button>
          </div>
          <button className={styles.closeModalBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Required Banner */}
        {bookingRequired && (
          <div className={styles.bookingRequiredBanner}>
            🔒 <strong>Authentication Required:</strong> Please log in or create an account to proceed with seat booking and tracking.
          </div>
        )}

        {/* Dynamic Form Component */}
        {isNewUser ? (
          <Signup onSwitchToLogin={() => setIsNewUser(false)} />
        ) : (
          <Login onSwitchToSignup={() => setIsNewUser(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
