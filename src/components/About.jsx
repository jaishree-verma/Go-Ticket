import React, { useState, useEffect } from 'react';
import styles from '../styles/about.module.css';

// Animated Counter Hook
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

const FEATURES_DATA = [
  {
    icon: '⚡',
    title: 'Live GPS Bus Tracking',
    highlight: 'Real-time ETA & Map Location',
    desc: 'Monitor live bus speeds, exact stop arrivals, and delays on satellite maps.'
  },
  {
    icon: '🪑',
    title: 'Interactive Seat Layouts',
    highlight: 'Window & Sleeper Picks',
    desc: 'Select upper/lower sleeper berths and single window seats with transparent views.'
  },
  {
    icon: '🛡️',
    title: 'Instant QR & WhatsApp Pass',
    highlight: '100% Paperless Boarding',
    desc: 'Get instant WhatsApp & SMS ticket passes with 1-tap QR boarding at gates.'
  },
  {
    icon: '💳',
    title: 'Zero Hidden Booking Fees',
    highlight: 'Transparent Price Guarantee',
    desc: 'No convenience surcharges. Instant refunds via UPI, Cards, and NetBanking.'
  },
  {
    icon: '🏨',
    title: 'Hotel & Transit Stays',
    highlight: 'Up to 30% Partner Discounts',
    desc: 'Book verified hotel stays near top drop points and bus terminals.'
  },
  {
    icon: '🎧',
    title: '24/7 Tixie Support Desk',
    highlight: 'Instant Direct Ticket Help',
    desc: 'Round-the-clock live passenger desk for modifications, refunds & assistance.'
  }
];

const AboutUs = () => {
  const passengersCount = useCounter(5284000);
  const routesCount = useCounter(10450);
  const operatorsCount = useCounter(280);
  const ratingScore = (useCounter(48, 1500) / 10).toFixed(1);

  return (
    <section id="about" className={styles.aboutWrapper}>
      <div className={styles.aboutContainer}>
        {/* Header Area */}
        <div className={styles.headerArea}>
          <span className={styles.sectionBadge}>WHY CHOOSE GO TICKET</span>
          <h2 className={styles.aboutHeading}>Built for Modern, Comfortable &amp; Reliable Travel</h2>
          <p className={styles.aboutSubheading}>
            We connect thousands of passengers every day with verified bus operators, delivering a seamless travel experience.
          </p>
        </div>

        {/* Live Animated Customer Counting Bar */}
        <div className={styles.liveMetricsBanner}>
          <div className={styles.metricCard}>
            <div className={styles.metricNumber}>{passengersCount.toLocaleString()}+</div>
            <div className={styles.metricLabel}>Happy Passengers Served</div>
          </div>
          <div className={styles.metricDivider}></div>
          <div className={styles.metricCard}>
            <div className={styles.metricNumber}>{routesCount.toLocaleString()}+</div>
            <div className={styles.metricLabel}>Active Daily Routes</div>
          </div>
          <div className={styles.metricDivider}></div>
          <div className={styles.metricCard}>
            <div className={styles.metricNumber}>{operatorsCount}+</div>
            <div className={styles.metricLabel}>Verified Bus Partners</div>
          </div>
          <div className={styles.metricDivider}></div>
          <div className={styles.metricCard}>
            <div className={styles.metricNumber}>⭐ {ratingScore} / 5.0</div>
            <div className={styles.metricLabel}>Customer Satisfaction</div>
          </div>
        </div>

        {/* Compact & Impactful Feature Cards Grid */}
        <div className={styles.featuresGrid}>
          {FEATURES_DATA.map((feat, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.cardTopRow}>
                <div className={styles.cardIcon}>{feat.icon}</div>
                <span className={styles.cardHighlightBadge}>{feat.highlight}</span>
              </div>
              <h3 className={styles.cardTitle}>{feat.title}</h3>
              <p className={styles.cardDesc}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
