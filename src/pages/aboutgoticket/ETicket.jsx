import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylespages/eticket.module.css';

/* ── MOCK TICKETS DATABASE ──────────────────────────────── */
const MOCK_TICKETS = {
  '9876543210': {
    ticketId: 'GT88A19B',
    name: 'Volvo AC Express',
    route: 'Lucknow → Kanpur',
    date: '2026-07-28',
    time: '05:05 PM',
    type: 'Volvo AC Sleeper',
    seats: ['A4', 'A5'],
    boarding: { location: 'Lucknow ISBT' },
    dropping: { location: 'Kanpur Central' },
    totalFare: 1198,
    paymentMethod: 'UPI',
    passenger: {
      fullName: 'Rahul Sharma',
      mobile: '9876543210',
      email: 'rahul.sharma@example.com',
      aadhaar: '••••••••1234',
      gender: 'Male',
      age: 28,
    },
    passengers: [
      { fullName: 'Rahul Sharma', mobile: '9876543210', email: 'rahul.sharma@example.com', aadhaar: '••••••••1234', gender: 'Male', age: 28 },
      { fullName: 'Pooja Sharma', mobile: '9876543210', email: 'pooja.sharma@example.com', aadhaar: '••••••••5678', gender: 'Female', age: 26 },
    ],
    bookedAt: new Date().toISOString(),
  },
  '9123456789': {
    ticketId: 'GT99B22C',
    name: 'Delhi-Agra Superfast',
    route: 'Delhi → Agra',
    date: '2026-07-30',
    time: '07:30 AM',
    type: 'Semi-Sleeper AC',
    seats: ['B2'],
    boarding: { location: 'Kashmere Gate ISBT' },
    dropping: { location: 'Agra Fort Bus Stand' },
    totalFare: 599,
    paymentMethod: 'CARD',
    passenger: {
      fullName: 'Anita Verma',
      mobile: '9123456789',
      email: 'anita.verma@example.com',
      aadhaar: '••••••••9012',
      gender: 'Female',
      age: 32,
    },
    passengers: [
      { fullName: 'Anita Verma', mobile: '9123456789', email: 'anita.verma@example.com', aadhaar: '••••••••9012', gender: 'Female', age: 32 },
    ],
    bookedAt: new Date().toISOString(),
  },
};

const ETicket = () => {
  const navigate = useNavigate();
  
  // Try loading active ticket from localStorage
  const savedTicket = JSON.parse(localStorage.getItem('lastTicket') || 'null');
  const loggedInMobile = localStorage.getItem('userMobile') || '';

  const [activeTicket, setActiveTicket] = useState(savedTicket);
  const [mobileInput, setMobileInput]   = useState(loggedInMobile);
  const [ticketIdInput, setTicketIdInput] = useState('');
  const [otpSent, setOtpSent]           = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpInput, setOtpInput]         = useState('');
  const [otpError, setOtpError]         = useState('');
  const [isVerifying, setIsVerifying]   = useState(false);
  const [sentSuccessMsg, setSentSuccessMsg] = useState('');

  // Auto load demo ticket if mobile is logged in or active in state
  useEffect(() => {
    if (!activeTicket && loggedInMobile && MOCK_TICKETS[loggedInMobile]) {
      setActiveTicket(MOCK_TICKETS[loggedInMobile]);
    }
  }, [loggedInMobile, activeTicket]);

  /* ── Step 1: Send OTP ───────────────────────────── */
  const handleSendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobileInput)) {
      setOtpError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setOtpError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(code);
    setOtpSent(true);
    alert(`📲 E-Ticket OTP sent to +91 ${mobileInput}: ${code}\n(Demo Mode — OTP shown in alert)`);
  };

  /* ── Step 2: Verify OTP & Retrieve Ticket ───────── */
  const handleVerifyOtp = () => {
    if (otpInput !== simulatedOtp) {
      setOtpError('Incorrect OTP. Please enter the valid 6-digit code.');
      return;
    }
    setOtpError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      // Check localStorage first
      if (savedTicket && (savedTicket.passenger?.mobile === mobileInput || savedTicket.passengers?.some(p => p.mobile === mobileInput))) {
        setActiveTicket(savedTicket);
      } else if (MOCK_TICKETS[mobileInput]) {
        setActiveTicket(MOCK_TICKETS[mobileInput]);
        localStorage.setItem('lastTicket', JSON.stringify(MOCK_TICKETS[mobileInput]));
      } else if (ticketIdInput.trim()) {
        // Fallback matching by ticket ID
        const matched = Object.values(MOCK_TICKETS).find(t => t.ticketId === ticketIdInput.trim().toUpperCase());
        if (matched) {
          setActiveTicket(matched);
        } else {
          setOtpError(`No ticket found for mobile ${mobileInput} or Ticket ID ${ticketIdInput}.`);
        }
      } else {
        // Generate a dynamic verified ticket for demonstration
        const dummyTicket = {
          ticketId: 'GT' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          name: 'GoExpress Deluxe',
          route: 'Delhi → Jaipur',
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM',
          type: 'AC Seater',
          seats: ['S12'],
          boarding: { location: 'Delhi ISBT' },
          dropping: { location: 'Jaipur Sindhi Camp' },
          totalFare: 499,
          paymentMethod: 'UPI',
          passenger: {
            fullName: 'Verified Traveler',
            mobile: mobileInput,
            email: `${mobileInput}@goticket.in`,
            aadhaar: '••••••••9999',
            gender: 'Male',
            age: 29,
          },
          passengers: [
            { fullName: 'Verified Traveler', mobile: mobileInput, email: `${mobileInput}@goticket.in`, aadhaar: '••••••••9999', gender: 'Male', age: 29 }
          ],
          bookedAt: new Date().toISOString(),
        };
        setActiveTicket(dummyTicket);
        localStorage.setItem('lastTicket', JSON.stringify(dummyTicket));
      }
      setOtpSent(false);
    }, 600);
  };

  /* ── Direct SMS / Email resend action ────────────── */
  const handleResendTicketDirect = () => {
    if (!activeTicket) return;
    const targetMobile = activeTicket.passenger?.mobile || mobileInput || 'registered number';
    setSentSuccessMsg(`✅ E-Ticket & PDF link resent successfully to ${targetMobile}!`);
    setTimeout(() => setSentSuccessMsg(''), 4000);
  };

  const generateQR = () =>
    Array.from({ length: 25 }).map((_, i) => ({
      key: i,
      dark: (i * 7 + 3) % 3 !== 0,
    }));

  const handlePrint = () => {
    window.print();
  };

  const paxList = activeTicket?.passengers || (activeTicket?.passenger ? [activeTicket.passenger] : []);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>E-Ticket Portal</h1>
      <p className={styles.subText}>
        Access, verify, and receive your digital e-ticket directly on your verified mobile number.
      </p>

      {/* ══ STEP A: VERIFY MOBILE TO GET TICKET ══════════════ */}
      <div className={styles.lookupCard}>
        <div className={styles.cardHeaderTitle}>
          <span>📱 Retrieve Ticket by Registered Mobile</span>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>Mobile Number *</label>
            <input
              type="tel"
              className={styles.input}
              placeholder="10-digit Indian Mobile (e.g. 9876543210)"
              maxLength={10}
              value={mobileInput}
              onChange={(e) => {
                setMobileInput(e.target.value.replace(/\D/g, '').slice(0, 10));
                setOtpSent(false);
                setOtpError('');
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>Ticket ID (Optional)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. GT88A19B"
              value={ticketIdInput}
              onChange={(e) => setTicketIdInput(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        {/* Demo Chip Shortcuts */}
        <div className={styles.demoChipWrapper}>
          <span className={styles.chipHint}>Quick Demo Numbers:</span>
          {Object.keys(MOCK_TICKETS).map((num) => (
            <button
              key={num}
              className={styles.demoChipBtn}
              onClick={() => {
                setMobileInput(num);
                setTicketIdInput(MOCK_TICKETS[num].ticketId);
                setOtpSent(false);
                setOtpError('');
              }}
            >
              {num} ({MOCK_TICKETS[num].route.split('→')[0].trim()})
            </button>
          ))}
        </div>

        {/* Send OTP button */}
        {!otpSent && (
          <button className={styles.submitBtn} onClick={handleSendOtp}>
            Send Verification OTP
          </button>
        )}

        {/* OTP Input Row */}
        {otpSent && (
          <div className={styles.otpVerificationBox}>
            <div className={styles.otpTitle}>Enter 6-Digit Verification Code</div>
            <div className={styles.otpInputRow}>
              <input
                type="text"
                className={`${styles.input} ${styles.otpInput}`}
                placeholder="6-Digit OTP"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              <button
                className={styles.verifyBtn}
                onClick={handleVerifyOtp}
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify & Fetch Ticket'}
              </button>
            </div>
            <p className={styles.otpSentNote}>
              OTP sent to +91 {mobileInput}. (Demo OTP: <strong>{simulatedOtp}</strong>)
            </p>
          </div>
        )}

        {otpError && <div className={styles.errorBanner}>⚠️ {otpError}</div>}
      </div>

      {/* ══ STEP B: ACTIVE TICKET DISPLAY ════════════════════ */}
      {activeTicket ? (
        <div className={styles.ticketCardWrapper}>
          {sentSuccessMsg && (
            <div className={styles.sentNotification}>
              {sentSuccessMsg}
            </div>
          )}

          <div className={styles.ticketCard}>
            {/* Header */}
            <div className={styles.ticketHeader}>
              <div className={styles.brandTitle}>GO-TICKET OFFICIAL</div>
              <span className={styles.ticketBadge}>VERIFIED CONFIRMED</span>
            </div>

            <div className={styles.ticketIdRow}>
              <span>Ticket ID: <strong>{activeTicket.ticketId}</strong></span>
              <span className={styles.bookingDateText}>
                Booked: {new Date(activeTicket.bookedAt || Date.now()).toLocaleDateString('en-IN')}
              </span>
            </div>

            {/* Passenger List */}
            {paxList.length > 0 && (
              <div className={styles.passengerSection}>
                <div className={styles.passengerSectionTitle}>Passenger Information</div>
                {paxList.map((p, idx) => (
                  <div key={idx} className={styles.passengerCardInner}>
                    <div className={styles.passengerRow}>
                      <span className={styles.paxName}>{idx + 1}. {p.fullName}</span>
                      <span className={styles.paxDetails}>{p.gender} · Age {p.age}</span>
                    </div>
                    <div className={styles.passengerRowSub}>
                      <span>Mobile: <strong>+91 {p.mobile}</strong></span>
                      <span>Aadhaar: <strong>{p.aadhaar}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* QR Code */}
            <div className={styles.qrWrapper}>
              <div className={styles.qrBox}>
                <div className={styles.qrGrid}>
                  {generateQR().map((cell) => (
                    <div
                      key={cell.key}
                      className={styles.qrCell}
                      style={{ background: cell.dark ? '#1a1a2e' : '#fff' }}
                    />
                  ))}
                </div>
              </div>
              <p className={styles.qrLabel}>Scan QR at boarding gate</p>
            </div>

            {/* Detailed Journey Summary */}
            <div className={styles.detailGrid}>
              {[
                { label: 'Bus Operator', val: activeTicket.name },
                { label: 'Route',        val: activeTicket.route },
                { label: 'Travel Date',  val: activeTicket.date },
                { label: 'Departure',    val: activeTicket.time },
                { label: 'Bus Class',    val: activeTicket.type },
                { label: 'Seat No(s)',   val: activeTicket.seats?.join(', ') || 'Assigned at boarding' },
                { label: 'Boarding Point', val: activeTicket.boarding?.location || 'Main Depot' },
                { label: 'Dropping Point', val: activeTicket.dropping?.location || 'Central Station' },
                { label: 'Total Fare',   val: `₹${activeTicket.totalFare}` },
                { label: 'Payment Mode', val: activeTicket.paymentMethod?.toUpperCase() || 'ONLINE' },
              ].map(({ label, val }) => (
                <div key={label} className={styles.detailItem}>
                  <span className={styles.detailLabel}>{label}</span>
                  <span className={styles.detailVal}>{val || '—'}</span>
                </div>
              ))}
            </div>

            {/* Instant Resend Action */}
            <div className={styles.dispatchBox}>
              <div className={styles.dispatchText}>
                Need another copy delivered directly to your phone?
              </div>
              <button className={styles.resendSmsBtn} onClick={handleResendTicketDirect}>
                Resend SMS & Email Ticket to +91 {activeTicket.passenger?.mobile || mobileInput}
              </button>
            </div>

            {/* PDF Print Download Button */}
            <button className={styles.downloadBtn} onClick={handlePrint}>
              Download PDF Ticket
            </button>

            <div className={styles.ticketActions}>
              <button className={styles.actionBtn} onClick={() => navigate('/seatbooking')}>
                Book Another Ticket
              </button>
              <button
                className={`${styles.actionBtn} ${styles.clearBtn}`}
                onClick={() => {
                  localStorage.removeItem('lastTicket');
                  setActiveTicket(null);
                }}
              >
                Clear Selected Ticket
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.noTicketBox}>
          <div className={styles.noTicketTitle}>No active ticket loaded</div>
          <p className={styles.noTicketText}>
            Enter your 10-digit registered mobile number above and verify via OTP to retrieve your e-ticket instantly.
          </p>
          <button className={styles.bookNowBtn} onClick={() => navigate('/seatbooking')}>
            Book a Ticket Now
          </button>
        </div>
      )}

      <footer className={styles.footer}>
        <p>© 2026 Go-Ticket India. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ETicket;
