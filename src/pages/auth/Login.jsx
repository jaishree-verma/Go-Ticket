import React, { useState } from 'react';
import styles from '../../stylespages/login-signup.module.css';

const DEMO_EMAIL    = 'demo@goticket.in';
const DEMO_PASSWORD = 'demo123';
const DEMO_NAME     = 'Demo User';
const DEMO_MOBILE   = '9876543210';

const Login = ({ onSwitchToSignup }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const doLogin = (name, mobile, userEmail) => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userMobile', mobile || DEMO_MOBILE);
    localStorage.setItem('userEmail', userEmail || email);
    localStorage.setItem('authToken', 'token-' + Date.now());
    window.location.reload();
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (!email.trim())    return setErrorMsg('Please enter your email address.');
    if (!password.trim()) return setErrorMsg('Please enter your password.');

    const cleanEmail = email.trim().toLowerCase();

    // ── Demo credentials ─────────────────────────────────────────
    if (cleanEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      doLogin(DEMO_NAME, DEMO_MOBILE, DEMO_EMAIL);
      return;
    }

    // ── Locally registered users ─────────────────────────────────
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const found = users.find(
      (u) => u.email === cleanEmail && u.password === password
    );

    if (found) {
      doLogin(found.name, found.mobile, found.email);
      return;
    }

    // Attempt mock API fallback gracefully
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setLoading(false);
      setErrorMsg('Invalid email or password. Please try again or create a new account.');
    }, 400);
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="login-password">Password *</label>
          <input
            id="login-password"
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.helperRow}>
          <label className={styles.checkboxRow}>
            <input type="checkbox" defaultChecked />
            Remember me
          </label>
          <span className={styles.link} style={{ cursor: 'pointer' }} onClick={() => alert('Password reset link sent to your registered email.')}>
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

      <div className={styles.demoNoticeBox}>
        Quick Demo Credentials:<br />
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
