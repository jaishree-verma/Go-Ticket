import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../stylespages/login-signup.module.css';

const DEMO_EMAIL    = 'demo@goticket.in';
const DEMO_PASSWORD = 'demo123';

const Login = ({ onSwitchToSignup, onSuccess }) => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');

  const validateForm = () => {
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

    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return false;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(email, password);
      if (typeof onSuccess === 'function') {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setErrorMsg('');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Login to Go‑Ticket</h2>

      {errorMsg && <div className={styles.errorBox}>⚠️ {errorMsg}</div>}

      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="login-email">Email Address *</label>
          <input
            id="login-email"
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
          <label className={styles.label} htmlFor="login-password">Password *</label>
          <div className={styles.passwordWrapper}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className={`${styles.input} ${styles.passwordInput}`}
              placeholder="••••••••"
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

        <div className={styles.helperRow}>
          <label className={styles.checkboxRow}>
            <input type="checkbox" defaultChecked />
            Remember me
          </label>
          <span
            className={styles.link}
            style={{ cursor: 'pointer' }}
            onClick={() => alert('Password reset link sent to your registered email.')}
          >
            Forgot password?
          </span>
        </div>

        <button
          className={styles.submit}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <div className={styles.divider}>or</div>

      <div
        className={styles.demoNoticeBox}
        onClick={handleFillDemo}
        style={{ cursor: 'pointer' }}
        title="Click to auto-fill demo credentials"
      >
        Quick Demo Credentials (Click to autofill):<br />
        Email: <strong>{DEMO_EMAIL}</strong> | Password: <strong>{DEMO_PASSWORD}</strong>
      </div>

      <p className={styles.prompt} style={{ marginTop: '0.9rem' }}>
        New to Go‑Ticket?{' '}
        <span
          className={styles.link}
          style={{ cursor: 'pointer', fontWeight: 700 }}
          onClick={() => typeof onSwitchToSignup === 'function' && onSwitchToSignup()}
        >
          Create an account
        </span>
      </p>
    </div>
  );
};

export default Login;
