import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../stylespages/login-signup.module.css';

const Signup = ({ onSwitchToLogin, onSuccess }) => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName]                 = useState('');
  const [email, setEmail]               = useState('');
  const [mobile, setMobile]             = useState('');
  const [password, setPassword]         = useState('');
  const [confirm, setConfirm]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');
  const [success, setSuccess]           = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return false;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address format (e.g. user@example.com).');
      return false;
    }

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile.trim())) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return false;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return false;
    }

    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signup({ name, email, mobile, password });
      setSuccess(true);
      setTimeout(() => {
        if (typeof onSuccess === 'function') {
          onSuccess();
        } else {
          navigate('/');
        }
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create your Go‑Ticket account</h2>

      {success && (
        <div className={styles.successBanner}>
          Account created successfully! Logging you in...
        </div>
      )}

      {errorMsg && <div className={styles.errorBox}>⚠️ {errorMsg}</div>}

      <form onSubmit={handleSignup}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="signup-name">Full name *</label>
          <input
            id="signup-name"
            type="text"
            className={styles.input}
            placeholder="Jaishree Verma"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="signup-email">Email address *</label>
          <input
            id="signup-email"
            type="email"
            className={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="signup-mobile">Mobile number *</label>
          <input
            id="signup-mobile"
            type="tel"
            maxLength={10}
            className={styles.input}
            placeholder="10-digit Mobile Number"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
              if (errorMsg) setErrorMsg('');
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="signup-password">Password *</label>
          <div className={styles.passwordWrapper}>
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              className={`${styles.input} ${styles.passwordInput}`}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
            />
            <button
              type="button"
              className={styles.passwordToggleBtn}
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="signup-confirm">Confirm password *</label>
          <div className={styles.passwordWrapper}>
            <input
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              className={`${styles.input} ${styles.passwordInput}`}
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
            />
            <button
              type="button"
              className={styles.passwordToggleBtn}
              onClick={() => setShowConfirm((prev) => !prev)}
              title={showConfirm ? 'Hide password' : 'Show password'}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        <button className={styles.submit} type="submit" disabled={loading || success}>
          {loading ? 'Creating Account…' : 'Create Account'}
        </button>
      </form>

      <p className={styles.prompt} style={{ marginTop: '1rem' }}>
        Already have an account?{' '}
        <span
          className={styles.link}
          style={{ cursor: 'pointer', fontWeight: 700 }}
          onClick={() => typeof onSwitchToLogin === 'function' && onSwitchToLogin()}
        >
          Login here
        </span>
      </p>
    </div>
  );
};

export default Signup;
