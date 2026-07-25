import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/trackbus.module.css';

const TrackBus = () => {
  const navigate = useNavigate();

  return (
    <section id="track-bus" className={styles.trackBus}>
      <div className={styles.trackContainer}>
        <div className={styles.trackTextContent}>
          <span className={styles.sectionBadge}>REAL-TIME GPS</span>
          <h2 className={styles.title}>Track Your Bus Live With Precision GPS</h2>
          <p className={styles.subtitle}>
            Eliminate waiting times and uncertainty. Monitor exact vehicle coordinates, delay updates, traffic conditions, and precise ETA on interactive live maps.
          </p>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <span className={styles.icon}>📍</span>
              <div>
                <h4>Live Interactive Map</h4>
                <p>Watch your bus movement turn-by-turn in real time.</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.icon}>⏱️</span>
              <div>
                <h4>Smart Boarding & ETA Alerts</h4>
                <p>Get automated alerts 15 minutes before arrival at your stop.</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.icon}>🔗</span>
              <div>
                <h4>Trip Sharing with Loved Ones</h4>
                <p>Share live trip status links with family for extra safety.</p>
              </div>
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <button className={styles.trackButton} onClick={() => navigate('/livetracking')}>
              ⚡ <b>TRACK YOUR BUS NOW</b>
            </button>
          </div>
        </div>

        <div className={styles.trackVisual}>
          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <span className={styles.liveIndicator}>● LIVE GPS TRACKING</span>
              <span className={styles.busNumber}>Bus #GT-1048 (Delhi → Kanpur)</span>
            </div>
            <div className={styles.mapBody}>
              <div className={styles.routePoint}>
                <span className={styles.pointDot}></span>
                <div>
                  <strong>Delhi ISBT Kashmere Gate</strong>
                  <p>Departed 08:00 AM</p>
                </div>
              </div>
              <div className={styles.routeLine}>
                <span className={styles.movingBus}>🚌</span>
              </div>
              <div className={styles.routePoint}>
                <span className={styles.pointDotActive}></span>
                <div>
                  <strong>Kanpur Central Bus Stand</strong>
                  <p>ETA: 01:30 PM (On Time)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackBus;
