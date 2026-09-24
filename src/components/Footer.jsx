import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Brand Column */}
        <div className={styles.brandColumn}>
          <div className={styles.brandLogo}>
            <span className={styles.logoBadge}>🚌 GO TICKET</span>
          </div>
          <p className={styles.brandDesc}>
            India's reliable and modern bus ticket booking platform. Live GPS tracking, instant seat confirmation, and 24/7 passenger support.
          </p>
          <div className={styles.socialIcons}>
            <span className={styles.socialIcon} title="Facebook">🌐</span>
            <span className={styles.socialIcon} title="Twitter">📱</span>
            <span className={styles.socialIcon} title="Instagram">📸</span>
            <span className={styles.socialIcon} title="LinkedIn">💼</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footerColumn}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/home">Search Routes</Link></li>
            <li><Link to="/seatbooking">Seat Booking</Link></li>
            <li><Link to="/livetracking">Live Bus Tracking</Link></li>
            <li><Link to="/eticket">My E-Ticket</Link></li>
          </ul>
        </div>

        {/* Information */}
        <div className={styles.footerColumn}>
          <h3>Information</h3>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/contact">Help &amp; Support</Link></li>
            <li><Link to="/contact">Privacy Policy</Link></li>
            <li><Link to="/contact">Terms &amp; Conditions</Link></li>
            <li><Link to="/contact">FAQs</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.footerColumn}>
          <h3>Contact Us</h3>
          <ul className={styles.contactList}>
            <li>📍 <span>124 Transport Hub, MG Road, New Delhi, India</span></li>
            <li>📞 <span>+91 1800-123-4567 (Toll Free)</span></li>
            <li>✉️ <span>support@goticket.com</span></li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2026 Go Ticket India. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
