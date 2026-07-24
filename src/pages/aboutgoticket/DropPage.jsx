import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../stylespages/drop.module.css';

const DropPage = () => {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const { busDetails, boardingPoints, droppingPoints, selectedSeats } = state || {};

  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [selectedDropping, setSelectedDropping] = useState(null);
  const [errorMsg, setErrorMsg]                 = useState('');

  const handleProceed = () => {
    if (selectedBoarding === null) return setErrorMsg('Please select a boarding point.');
    if (selectedDropping === null) return setErrorMsg('Please select a dropping point.');
    setErrorMsg('');

    const bookingData = {
      ...busDetails,
      boarding:  boardingPoints[selectedBoarding],
      dropping:  droppingPoints[selectedDropping],
      seats:     selectedSeats || [],
      bookedAt:  new Date().toISOString(),
    };

    navigate('/payment', { state: { bookingData } });
  };

  return (
    <div className={styles.container}>
      {/* Bus Summary Banner */}
      {busDetails && (
        <div className={styles.summaryBanner}>
          <span>🚌 <strong>{busDetails.name}</strong></span>
          <span>📅 {busDetails.date}</span>
          <span>🕐 {busDetails.time}</span>
          <span>💺 {busDetails.route}</span>
          <span>💰 {busDetails.fare}</span>
        </div>
      )}

      {errorMsg && <div className={styles.errorMsg}>⚠️ {errorMsg}</div>}

      <div className={styles.page}>
        {/* Left: Boarding Points */}
        <div className={styles.leftPanel}>
          <h3>Boarding Point</h3>
          <hr className={styles.divider} />

          {boardingPoints?.map((point, i) => (
            <label
              key={i}
              className={`${styles.optionBox} ${selectedBoarding === i ? styles.selected : ''}`}
              onClick={() => setSelectedBoarding(i)}
            >
              <input
                type="radio"
                name="boarding"
                className={styles.radio}
                checked={selectedBoarding === i}
                onChange={() => setSelectedBoarding(i)}
              />
              <div className={styles.optionContent}>
                <div className={styles.leftTime}>{point.time}</div>
                <div className={styles.rightInfo}>
                  <div className={styles.heading}>{point.location}</div>
                  <div className={styles.subText}>{point.address}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Right: Dropping Points */}
        <div className={styles.rightPanel}>
          <h3>Dropping Point</h3>
          <hr className={styles.divider} />

          {droppingPoints?.map((point, i) => (
            <label
              key={i}
              className={`${styles.optionBox} ${selectedDropping === i ? styles.selected : ''}`}
              onClick={() => setSelectedDropping(i)}
            >
              <input
                type="radio"
                name="dropping"
                className={styles.radio}
                checked={selectedDropping === i}
                onChange={() => setSelectedDropping(i)}
              />
              <div className={styles.optionContent}>
                <div className={styles.leftTime}>{point.time}</div>
                <div className={styles.rightInfo}>
                  <div className={styles.heading}>{point.location}</div>
                  <div className={styles.subText}>{point.address}</div>
                  {point.popular && (
                    <span className={styles.popularTag}>⭐ Popular dropping point</span>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      <div className={styles.proceedWrapper}>
        <button className={styles.proceedBtn} onClick={handleProceed}>
          <b>✅ Proceed to Payment</b>
        </button>
      </div>
    </div>
  );
};

export default DropPage;
