import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../stylespages/payment.module.css';

const generateTicketId = () =>
  'GT' + Math.random().toString(36).substring(2, 8).toUpperCase();

/* ── Empty passenger template ───────────────────────────── */
const emptyPassenger = () => ({
  id: Date.now() + Math.random(),
  fullName: '',
  mobile: '',
  email: '',
  aadhaar: '',
  gender: '',
  age: '',
  otpSent: false,
  otpValue: '',
  otpInput: '',
  mobileVerified: false,
  otpError: '',
  otpTimer: 0,
});

/* ── Step indicator ─────────────────────────────────────── */
const StepBar = ({ current }) => {
  const steps = [
    { id: 'summary',   label: 'Summary' },
    { id: 'details',   label: 'Passenger' },
    { id: 'payment',   label: 'Payment' },
    { id: 'confirmed', label: 'Done' },
  ];
  const order      = steps.map((s) => s.id);
  const currentIdx = order.indexOf(current);

  return (
    <div className={styles.stepIndicator}>
      {steps.map((s, i) => {
        const idx      = order.indexOf(s.id);
        const isDone   = idx < currentIdx;
        const isActive = idx === currentIdx;
        return (
          <React.Fragment key={s.id}>
            <div
              className={`${styles.stepDot} ${isDone ? styles.done : ''} ${
                isActive ? styles.active : ''
              }`}
            >
              <div className={styles.stepCircle}>{isDone ? '✓' : i + 1}</div>
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`${styles.stepLine} ${idx < currentIdx ? styles.done : ''}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ── Single Passenger Card ──────────────────────────────── */
const PassengerCard = ({ pax, index, total, onChange, onRemove }) => {
  const timerRef = useRef(null);

  /* Simulate sending OTP */
  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(pax.mobile)) {
      onChange(index, 'otpError', 'Enter a valid 10-digit mobile first.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    onChange(index, 'otpValue', code);
    onChange(index, 'otpSent', true);
    onChange(index, 'otpError', '');
    onChange(index, 'mobileVerified', false);
    onChange(index, 'otpInput', '');
    // Countdown 30s
    let t = 30;
    onChange(index, 'otpTimer', t);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      t -= 1;
      onChange(index, 'otpTimer', t);
      if (t <= 0) clearInterval(timerRef.current);
    }, 1000);

    alert(`📲 OTP sent to ${pax.mobile}: ${code}\n(Demo mode — OTP shown in alert)`);
  };

  const verifyOtp = () => {
    if (pax.otpInput === pax.otpValue) {
      onChange(index, 'mobileVerified', true);
      onChange(index, 'otpError', '');
    } else {
      onChange(index, 'otpError', 'Incorrect OTP. Please try again.');
    }
  };

  return (
    <div className={styles.passengerCardBox}>
      {/* Card header */}
      <div className={styles.passengerCardHeader}>
        <span className={styles.passengerCardTitle}>
          👤 Passenger {index + 1}
          {index === 0 && (
            <span className={styles.primaryBadge}> PRIMARY</span>
          )}
        </span>
        {total > 1 && index > 0 && (
          <button
            className={styles.removePassengerBtn}
            onClick={() => onRemove(index)}
            title="Remove passenger"
          >
            ✕ Remove
          </button>
        )}
      </div>

      {/* Full Name */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Full Name *</label>
        <input
          type="text"
          className={styles.input}
          placeholder="As per Aadhaar card"
          value={pax.fullName}
          onChange={(e) => onChange(index, 'fullName', e.target.value)}
        />
      </div>

      {/* Gender + Age */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Gender *</label>
          <div className={styles.genderRow}>
            {['Male', 'Female', 'Other'].map((g) => (
              <label key={g} className={styles.genderOption}>
                <input
                  type="radio"
                  name={`gender-${index}`}
                  value={g}
                  checked={pax.gender === g}
                  onChange={() => onChange(index, 'gender', g)}
                />
                {g}
              </label>
            ))}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Age *</label>
          <input
            type="number"
            className={styles.input}
            placeholder="e.g. 28"
            min={1}
            max={99}
            value={pax.age}
            onChange={(e) => onChange(index, 'age', e.target.value)}
          />
        </div>
      </div>

      {/* Mobile + OTP */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Mobile Number *</label>
        <div className={styles.mobileOtpRow}>
          <input
            type="tel"
            className={`${styles.input} ${styles.mobileInput}`}
            placeholder="10-digit Indian mobile"
            maxLength={10}
            value={pax.mobile}
            disabled={pax.mobileVerified}
            onChange={(e) => {
              onChange(index, 'mobile', e.target.value.replace(/\D/g, '').slice(0, 10));
              onChange(index, 'mobileVerified', false);
              onChange(index, 'otpSent', false);
            }}
          />
          {pax.mobileVerified ? (
            <span className={styles.mobileVerifiedBadge}>✅ Verified</span>
          ) : (
            <button
              className={styles.sendOtpBtn}
              onClick={sendOtp}
              disabled={pax.otpTimer > 0}
            >
              {pax.otpTimer > 0 ? `Resend (${pax.otpTimer}s)` : pax.otpSent ? '🔄 Resend OTP' : '📲 Send OTP'}
            </button>
          )}
        </div>
        {!pax.mobileVerified && (
          <p className={styles.fieldHint}>📲 E-ticket will be sent to this number via SMS</p>
        )}
      </div>

      {/* OTP input */}
      {pax.otpSent && !pax.mobileVerified && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Enter OTP *</label>
          <div className={styles.mobileOtpRow}>
            <input
              type="text"
              className={`${styles.input} ${styles.mobileInput}`}
              placeholder="6-digit OTP"
              maxLength={6}
              value={pax.otpInput}
              onChange={(e) =>
                onChange(index, 'otpInput', e.target.value.replace(/\D/g, '').slice(0, 6))
              }
            />
            <button
              className={`${styles.sendOtpBtn} ${styles.verifyOtpBtn}`}
              onClick={verifyOtp}
            >
              ✅ Verify
            </button>
          </div>
          {pax.otpError && (
            <p className={styles.otpErrorMsg}>⚠️ {pax.otpError}</p>
          )}
        </div>
      )}

      {/* Email */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Email Address *</label>
        <input
          type="email"
          className={styles.input}
          placeholder="example@email.com"
          value={pax.email}
          onChange={(e) => onChange(index, 'email', e.target.value)}
        />
        <p className={styles.fieldHint}>📧 PDF ticket will be sent to this email</p>
      </div>

      {/* Aadhaar */}
      <div className={styles.sectionDivider}>🪪 Aadhaar Verification</div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Aadhaar Card Number *</label>
        <div className={styles.aadhaarWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder="12-digit Aadhaar number"
            maxLength={12}
            value={pax.aadhaar}
            onChange={(e) =>
              onChange(index, 'aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))
            }
          />
          {pax.aadhaar.length === 12 && (
            <span className={styles.aadhaarVerified}>✅ Verified</span>
          )}
        </div>
        <p className={styles.fieldHint}>🔒 Stored securely — used only for boarding verification</p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   Main PaymentPage Component
══════════════════════════════════════════════════════════ */
const PaymentPage = () => {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const bookingData = state?.bookingData || {};

  const [step, setStep]     = useState('summary');
  const [method, setMethod] = useState('');

  /* Payment fields */
  const [upiId, setUpiId]       = useState('');
  const [cardNum, setCardNum]   = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry]     = useState('');
  const [cvv, setCvv]           = useState('');

  /* Multiple passengers */
  const [passengers, setPassengers] = useState([emptyPassenger()]);

  const [errorMsg, setErrorMsg] = useState('');
  const [ticketId]              = useState(generateTicketId());

  const totalFare = bookingData.fare
    ? parseInt(bookingData.fare.replace(/[^\d]/g, ''), 10) *
      (bookingData.seats?.length || 1)
    : 0;

  /* ── Passenger state helpers ────── */
  const updatePassenger = (idx, field, value) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const addPassenger = () => {
    setPassengers((prev) => [...prev, emptyPassenger()]);
  };

  const removePassenger = (idx) => {
    setPassengers((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ── Validation ─────────────────── */
  const validateDetails = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p   = passengers[i];
      const nth = passengers.length > 1 ? ` (Passenger ${i + 1})` : '';

      if (!p.fullName.trim() || !/^[a-zA-Z\s]{3,}$/.test(p.fullName.trim()))
        return `Enter a valid full name${nth}.`;
      if (!p.mobileVerified)
        return `Mobile number must be verified via OTP${nth}.`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
        return `Enter a valid email address${nth}.`;
      if (!/^\d{12}$/.test(p.aadhaar))
        return `Aadhaar must be 12 digits${nth}.`;
      if (!p.gender) return `Select gender${nth}.`;
      if (!p.age || p.age < 1 || p.age > 99)
        return `Enter valid age (1–99)${nth}.`;
    }
    return null;
  };

  const validatePayment = () => {
    if (!method) return 'Please select a payment method.';
    if (method === 'upi' && !upiId.includes('@'))
      return 'Enter a valid UPI ID (e.g. name@upi).';
    if (method === 'card') {
      if (cardNum.replace(/\s/g, '').length < 16)
        return 'Enter a valid 16-digit card number.';
      if (!cardName.trim()) return 'Enter the cardholder name.';
      if (!expiry) return 'Enter card expiry.';
      if (cvv.length < 3) return 'Enter a valid CVV.';
    }
    return null;
  };

  /* ── Handlers ───────────────────── */
  const handleProceedToDetails = () => { setErrorMsg(''); setStep('details'); };

  const handleProceedToPayment = () => {
    const err = validateDetails();
    if (err) return setErrorMsg(err);
    setErrorMsg('');
    setStep('payment');
  };

  const handleConfirmPay = () => {
    const err = validatePayment();
    if (err) return setErrorMsg(err);
    setErrorMsg('');

    const primary = passengers[0];
    const ticket  = {
      ticketId,
      ...bookingData,
      totalFare,
      paymentMethod: method,
      passenger: {
        fullName: primary.fullName.trim(),
        mobile:   primary.mobile,
        email:    primary.email.toLowerCase(),
        aadhaar:  primary.aadhaar.replace(/\d(?=\d{4})/g, '•'),
        gender:   primary.gender,
        age:      parseInt(primary.age, 10),
      },
      passengers: passengers.map((p) => ({
        fullName: p.fullName.trim(),
        mobile:   p.mobile,
        email:    p.email.toLowerCase(),
        aadhaar:  p.aadhaar.replace(/\d(?=\d{4})/g, '•'),
        gender:   p.gender,
        age:      parseInt(p.age, 10),
      })),
      bookedAt: new Date().toISOString(),
    };
    localStorage.setItem('lastTicket', JSON.stringify(ticket));
    setStep('confirmed');
  };

  /* ══════════════════════════════════════
     CONFIRMED SCREEN
  ══════════════════════════════════════ */
  if (step === 'confirmed') {
    const ticket  = JSON.parse(localStorage.getItem('lastTicket') || '{}');
    const primary = ticket.passenger || {};
    const allPax  = ticket.passengers || [primary];

    return (
      <div className={styles.page}>
        <div className={`${styles.ticketCard} ${styles.printArea}`}>
          <div className={styles.ticketHeader}>
            <div className={styles.ticketLogo}>
              <img src="/images/logo.png" alt="Go Ticket" className={styles.ticketLogoImg} />
            </div>
            <div className={styles.ticketBadge}>✅ CONFIRMED</div>
          </div>

          <h2 className={styles.ticketTitle}>🎉 Booking Confirmed!</h2>
          <p className={styles.ticketId}>Ticket ID: <strong>{ticketId}</strong></p>

          {/* Delivery notification */}
          <div className={styles.deliveryNote}>
            📲 Ticket sent to <strong>{primary.mobile}</strong> &amp;{' '}
            <strong>{primary.email}</strong>
          </div>

          {/* All passengers */}
          {allPax.map((p, i) => (
            <div key={i} className={styles.passengerBanner}>
              <div className={styles.passengerBannerTitle}>
                👤 Passenger {i + 1}{i === 0 ? ' (Primary)' : ''}
              </div>
              <div className={styles.passengerBannerRow}>
                <strong>{p.fullName}</strong>
                <span>{p.gender} · Age {p.age}</span>
              </div>
              <div className={styles.passengerBannerRow} style={{ marginTop: '0.3rem' }}>
                <span>📱 {p.mobile}</span>
                <span>🪪 Aadhaar {p.aadhaar}</span>
              </div>
            </div>
          ))}

          {/* QR */}
          <div className={styles.qrBox}>
            <div className={styles.qrGrid}>
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={styles.qrCell}
                  style={{ background: (i * 7 + 3) % 3 !== 0 ? '#333' : '#fff' }}
                />
              ))}
            </div>
            <p className={styles.qrLabel}>Scan at boarding</p>
          </div>

          {/* Journey details */}
          <div className={styles.detailGrid}>
            {[
              { label: 'Bus',       val: ticket.name },
              { label: 'Route',     val: ticket.route },
              { label: 'Date',      val: ticket.date },
              { label: 'Departure', val: ticket.time },
              { label: 'Seats',     val: ticket.seats?.join(', ') || 'N/A' },
              { label: 'Boarding',  val: ticket.boarding?.location },
              { label: 'Drop',      val: ticket.dropping?.location },
              { label: 'Total Paid',val: `₹${ticket.totalFare}` },
            ].map(({ label, val }) => (
              <div key={label} className={styles.detailItem}>
                <span className={styles.detailLabel}>{label}</span>
                <span className={styles.detailVal}>{val || '—'}</span>
              </div>
            ))}
          </div>

          <button className={styles.downloadBtn} onClick={() => window.print()}>
            📄 Download PDF Ticket
          </button>

          <div className={styles.ticketActions}>
            <button className={styles.actionBtn} onClick={() => navigate('/eticket')}>
              🎫 View E-Ticket
            </button>
            <button
              className={`${styles.actionBtn} ${styles.homeBtn}`}
              onClick={() => navigate('/')}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════
     MAIN FLOW STEPS
  ══════════════════════════════════════ */
  return (
    <div className={styles.page}>

      {/* ── STEP 1: Booking Summary ──────────────────────── */}
      {step === 'summary' && (
        <div className={styles.card}>
          <StepBar current="summary" />
          <h2 className={styles.heading}><u>Booking Summary</u></h2>

          <div className={styles.summaryGrid}>
            {[
              { label: 'Bus',        val: bookingData.name },
              { label: 'Route',      val: bookingData.route },
              { label: 'Date',       val: bookingData.date },
              { label: 'Departure',  val: bookingData.time },
              { label: 'Bus Type',   val: bookingData.type },
              { label: 'Seats',      val: bookingData.seats?.join(', ') || 'N/A' },
              { label: 'Boarding',   val: bookingData.boarding?.location },
              { label: 'Drop',       val: bookingData.dropping?.location },
              { label: 'Fare/seat',  val: bookingData.fare },
            ].map(({ label, val }) => (
              <div key={label} className={styles.summaryItem}>
                <span className={styles.summaryLabel}>{label}</span>
                <span className={styles.summaryVal}>{val}</span>
              </div>
            ))}
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total</span>
              <span className={`${styles.summaryVal} ${styles.totalFare}`}>₹{totalFare}</span>
            </div>
          </div>

          <button className={styles.proceedBtn} onClick={handleProceedToDetails}>
            <b>👤 Enter Passenger Details →</b>
          </button>
        </div>
      )}

      {/* ── STEP 2: Passenger Details ────────────────────── */}
      {step === 'details' && (
        <div className={styles.card}>
          <StepBar current="details" />
          <h2 className={styles.heading}><u>Passenger Details</u></h2>

          <div className={styles.detailsStepInfo}>
            <strong>🇮🇳 Indian Citizen Verification Required</strong>
            Aadhaar number and mobile OTP verification are mandatory. Ticket will
            be delivered via SMS and email after successful payment.
          </div>

          {errorMsg && <div className={styles.errorMsg}>⚠️ {errorMsg}</div>}

          {/* Render each passenger */}
          {passengers.map((pax, idx) => (
            <PassengerCard
              key={pax.id}
              pax={pax}
              index={idx}
              total={passengers.length}
              onChange={updatePassenger}
              onRemove={removePassenger}
            />
          ))}

          {/* Add Passenger button */}
          <button className={styles.addPassengerBtn} onClick={addPassenger}>
            ＋ Add Another Passenger
          </button>

          <div className={styles.payBtnRow}>
            <button className={styles.backBtn} onClick={() => setStep('summary')}>← Back</button>
            <button className={styles.proceedBtn} onClick={handleProceedToPayment}>
              <b>💳 Proceed to Pay ₹{totalFare}</b>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Payment ──────────────────────────────── */}
      {step === 'payment' && (
        <div className={styles.card}>
          <StepBar current="payment" />
          <h2 className={styles.heading}><u>Choose Payment Method</u></h2>

          {errorMsg && <div className={styles.errorMsg}>⚠️ {errorMsg}</div>}

          <div className={styles.methodRow}>
            {['upi', 'card', 'cod'].map((m) => (
              <button
                key={m}
                className={`${styles.methodBtn} ${method === m ? styles.methodActive : ''}`}
                onClick={() => setMethod(m)}
              >
                {m === 'upi'  && '📱 UPI'}
                {m === 'card' && '💳 Card'}
                {m === 'cod'  && '💵 Cash'}
              </button>
            ))}
          </div>

          {method === 'upi' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>UPI ID</label>
              <input
                type="text"
                className={styles.input}
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          {method === 'card' && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Card Number</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  value={cardNum}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                    setCardNum(v.replace(/(.{4})/g, '$1 ').trim());
                  }}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Cardholder Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Name on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Expiry</label>
                  <input
                    type="month"
                    className={styles.input}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>CVV</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="•••"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </>
          )}

          {method === 'cod' && (
            <p className={styles.codNote}>
              💵 You will pay ₹{totalFare} in cash to the bus conductor before departure.
            </p>
          )}

          <div className={styles.payBtnRow}>
            <button className={styles.backBtn} onClick={() => setStep('details')}>← Back</button>
            <button className={styles.proceedBtn} onClick={handleConfirmPay}>
              <b>✅ Confirm &amp; Pay ₹{totalFare}</b>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
