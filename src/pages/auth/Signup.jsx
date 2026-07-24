import React, { useState } from 'react';
import styles from '../../stylespages/login-signup.module.css';

const Signup = ({ onSwitchToLogin }) => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [mobile, setMobile]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess]   = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name.trim()) return setErrorMsg('Please enter your full name.');
    if (!email.trim() || !email.includes('@')) return setErrorMsg('Please enter a valid email address.');
    if (!/^[6-9]\d{9}$/.test(mobile)) return setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
    if (password.length < 6) return setErrorMsg('Password must be at least 6 characters.');
    if (password !== confirm) return setErrorMsg('Passwords do not match.');

    setErrorMsg('');
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existing = users.find(u => u.email === email.trim().toLowerCase());
    
    if (existing) {
      return setErrorMsg('An account with this email already exists.');
    }

    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      password,
      registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    localStorage.setItem('userName', newUser.name);
    localStorage.setItem('userMobile', newUser.mobile);
    localStorage.setItem('userEmail', newUser.email);
    localStorage.setItem('authToken', 'token-' + Date.now());

    setSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
            onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="signup-password">Password *</label>
          <input
            id="signup-password"
            type="password"
            className={styles.input}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="signup-confirm">Confirm password *</label>
          <input
            id="signup-confirm"
            type="password"
            className={styles.input}
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button className={styles.submit} type="submit">
          Create Account
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
