import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/offers.module.css';

const COUPONS = [
  {
    code: 'FIRSTGO',
    title: 'Flat 20% OFF on First Booking',
    desc: 'Save up to ₹150 instantly on any sleeper or seater bus route.',
    discountText: '₹150 OFF'
  },
  {
    code: 'GTWEEKEND',
    title: 'Weekend Special ₹200 OFF',
    desc: 'Valid on interstate express routes over weekends.',
    discountText: '₹200 OFF'
  },
  {
    code: 'UPIPAY',
    title: 'Extra ₹50 UPI Cashback',
    desc: 'Instant wallet cashback for Paytm, PhonePe, and GPay UPI payments.',
    discountText: '₹50 CASHBACK'
  }
];

const OffersSection = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleApplyCoupon = (coupon) => {
    // Save coupon to localStorage for automated checkout application
    localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    setShowModal(false);

    // Automate navigation directly to seat booking / payment journey
    navigate('/seatbooking');
  };

  return (
    <>
      <section className={styles.giftBannerSection}>
        <div className={styles.giftBanner}>
          <div className={styles.giftContent}>
            <div
              className={styles.giftIcon}
              onClick={() => setShowModal(true)}
              title="Click to open your gift!"
              role="button"
              tabIndex={0}
            >
              🎁
            </div>

            <div className={styles.giftTextGroup}>
              <span className={styles.giftSubtext}>We have an exclusive gift for you</span>
              <h3 className={styles.giftMainHeading}>Thank you for being our loyal customer</h3>
            </div>

            <div className={styles.actionGroup}>
              <button
                className={styles.viewGiftBtn}
                onClick={() => setShowModal(true)}
              >
                View your gift
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Gift Coupon Popup Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <span className={styles.modalIcon}>🎉</span>
                <div>
                  <h3>Your Exclusive Gift Coupons</h3>
                  <p>Choose a coupon code to apply and automate your ticket booking!</p>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className={styles.couponsList}>
              {COUPONS.map((coupon) => (
                <div key={coupon.code} className={styles.couponCard}>
                  <div className={styles.couponInfo}>
                    <div className={styles.couponBadge}>{coupon.discountText}</div>
                    <h4 className={styles.couponTitle}>{coupon.title}</h4>
                    <p className={styles.couponDesc}>{coupon.desc}</p>
                    <span className={styles.couponTag}>Code: <strong>{coupon.code}</strong></span>
                  </div>

                  <button
                    className={styles.applyBtn}
                    onClick={() => handleApplyCoupon(coupon)}
                  >
                    Apply &amp; Book Now ⚡
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OffersSection;
