import React, { useState } from 'react';
import styles from '../../stylespages/contactus.module.css';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    ticketId: '',
    category: 'Booking & Ticket Enquiry',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');
  const [ticketStatus, setTicketStatus] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setErrorMsg('Please enter your full name.');
    if (!form.email.includes('@')) return setErrorMsg('Please enter a valid email address.');
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
    if (!form.message.trim()) return setErrorMsg('Please enter your message or query.');

    setErrorMsg('');
    setSubmitted(true);
  };

  const handleQuickCheck = () => {
    if (!form.ticketId.trim()) {
      setErrorMsg('Please enter a Ticket ID to check status.');
      return;
    }
    setErrorMsg('');
    const id = form.ticketId.trim().toUpperCase();
    const saved = JSON.parse(localStorage.getItem('lastTicket') || 'null');
    
    if (saved && saved.ticketId === id) {
      setTicketStatus({
        found: true,
        id: saved.ticketId,
        route: saved.route,
        date: saved.date,
        time: saved.time,
        status: 'CONFIRMED & ACTIVE',
      });
    } else {
      setTicketStatus({
        found: false,
        id: id,
        message: 'No active booking found for this Ticket ID. Please verify your reference code or contact support below.',
      });
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Contact Support & Headquarters</h1>
      <p className={styles.subText}>
        We are here to help you 24/7. Reach out via support channels, visit our regional offices, or submit your query below.
      </p>

      {/* ── Contact Info Grid Cards ───────────────────────── */}
      <div className={styles.infoCardsGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardHeaderTitle}>Customer Support Hotline</div>
          <div className={styles.cardValue}>+91 1800-419-8888 (Toll Free)</div>
          <div className={styles.cardSub}>Available 24x7 for urgent booking assistance</div>
          <a href="tel:+9118004198888" className={styles.actionLink}>Call Toll-Free</a>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardHeaderTitle}>Email Support Desk</div>
          <div className={styles.cardValue}>support@go-ticket.in</div>
          <div className={styles.cardSub}>Guaranteed response within 4 hours</div>
          <a href="mailto:support@go-ticket.in" className={styles.actionLink}>Send Email</a>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardHeaderTitle}>WhatsApp Help Desk</div>
          <div className={styles.cardValue}>+91 98765 43210</div>
          <div className={styles.cardSub}>Instant ticket updates, refund status & ETAs</div>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className={styles.actionLink}>Chat on WhatsApp</a>
        </div>
      </div>

      {/* ── Quick Ticket Status Lookup Section ────────────── */}
      <div className={styles.ticketCheckCard}>
        <div className={styles.sectionTitleText}>Quick Ticket Status Check</div>
        <div className={styles.quickCheckRow}>
          <input
            type="text"
            className={styles.input}
            name="ticketId"
            placeholder="Enter Ticket ID (e.g. GT88A19B)"
            value={form.ticketId}
            onChange={handleChange}
          />
          <button className={styles.checkBtn} onClick={handleQuickCheck}>
            Check Status
          </button>
        </div>

        {ticketStatus && (
          <div className={ticketStatus.found ? styles.statusSuccessBox : styles.statusErrorBox}>
            {ticketStatus.found ? (
              <div>
                <strong>Status for {ticketStatus.id}:</strong> {ticketStatus.status}
                <div>Route: {ticketStatus.route} | Date: {ticketStatus.date} ({ticketStatus.time})</div>
              </div>
            ) : (
              <div>⚠️ {ticketStatus.message}</div>
            )}
          </div>
        )}
      </div>

      {/* ── Main Form + Office Locations ──────────────────── */}
      <div className={styles.layoutTwoCol}>
        {/* Left: Contact Form */}
        <div className={styles.formCard}>
          <div className={styles.sectionTitleText}>Send Us a Message</div>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successTitle}>Message Received!</div>
              <p>Thank you, <strong>{form.name}</strong>. Your ticket inquiry reference has been generated. Our support agent will contact you on <strong>{form.mobile}</strong> or email <strong>{form.email}</strong> within 2 to 4 hours.</p>
              <button className={styles.resetBtn} onClick={() => setSubmitted(false)}>
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {errorMsg && <div className={styles.errorMsg}>⚠️ {errorMsg}</div>}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    name="name"
                    type="text"
                    className={styles.input}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    className={styles.input}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mobile Number *</label>
                  <input
                    name="mobile"
                    type="tel"
                    maxLength={10}
                    className={styles.input}
                    placeholder="10-digit mobile number"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        mobile: e.target.value.replace(/\D/g, '').slice(0, 10),
                      }))
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Inquiry Category *</label>
                  <select
                    name="category"
                    className={styles.select}
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="Booking & Ticket Enquiry">Booking & Ticket Enquiry</option>
                    <option value="Cancellation & Refund">Cancellation & Refund</option>
                    <option value="Bus Timing & Delay">Bus Timing & Delay</option>
                    <option value="Luggage & Baggage Policy">Luggage & Baggage Policy</option>
                    <option value="Corporate / Group Booking">Corporate / Group Booking</option>
                    <option value="Technical Issue / Payment Refund">Technical Issue / Payment Refund</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Subject</label>
                <input
                  name="subject"
                  type="text"
                  className={styles.input}
                  placeholder="Short summary of your query"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Detailed Message *</label>
                <textarea
                  name="message"
                  className={styles.textarea}
                  placeholder="Describe your issue or query in detail..."
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Support Ticket
              </button>
            </form>
          )}
        </div>

        {/* Right: Regional Office Addresses & FAQ */}
        <div className={styles.officesPanel}>
          <div className={styles.sectionTitleText}>Headquarters & Regional Hubs</div>

          <div className={styles.officeBox}>
            <div className={styles.officeCity}>Corporate Headquarters (Gurgaon)</div>
            <div className={styles.officeAddress}>
              Go-Ticket Tech Park, 5th Floor, Cyber City, DLF Phase 2, Gurgaon, Haryana — 122002
            </div>
            <div className={styles.officeMeta}>Hours: Mon–Sat (09:00 AM – 08:00 PM IST)</div>
          </div>

          <div className={styles.officeBox}>
            <div className={styles.officeCity}>Central Region Hub (Kanpur)</div>
            <div className={styles.officeAddress}>
              Go-Ticket Express Complex, Jhatkari Bus Station, GT Road, Kanpur, Uttar Pradesh — 208001
            </div>
            <div className={styles.officeMeta}>Hours: 24/7 Operations & Dispatch Desk</div>
          </div>

          {/* FAQ Box */}
          <div className={styles.faqCard}>
            <div className={styles.faqTitle}>Frequently Asked Questions</div>
            <div className={styles.faqItem}>
              <strong>Q: How long does refund processing take?</strong>
              <p>Refunds for cancelled tickets are credited to your UPI/Card account within 24 to 48 business hours.</p>
            </div>
            <div className={styles.faqItem}>
              <strong>Q: Where do I get my boarding pass?</strong>
              <p>Your SMS & Email PDF ticket contains the official boarding QR code. No printout is required.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© 2026 Go-Ticket India. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactUs;
