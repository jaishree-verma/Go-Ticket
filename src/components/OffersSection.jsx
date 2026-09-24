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
        <div className={styles.giftBanner} onClick={() => setShowModal(true)}>
          {/* Animated Sheen Reflection Sweep */}
          <div className={styles.bannerShimmerLayer}></div>

          {/* Top & Bottom Seamless Gradient Merges */}
          <div className={styles.topMergeFade}></div>
          <div className={styles.bottomMergeFade}></div>

          {/* Floating Decorative Festive Sparkles */}
          <span className={styles.sparkle1} aria-hidden="true">✨</span>
          <span className={styles.sparkle2} aria-hidden="true">🎉</span>
          <span className={styles.sparkle3} aria-hidden="true">⭐</span>
          <span className={styles.sparkle4} aria-hidden="true">✨</span>

          <div className={styles.giftContent}>
            {/* Interactive 3D Gift Box with Pulsing Glow */}
            <div
              className={styles.giftIconWrapper}
              title="Click to open your gift!"
              role="button"
              tabIndex={0}
            >
              <div className={styles.giftGlowAura}></div>
              <div className={styles.giftIcon}>🎁</div>
              <span className={styles.tapToOpenBadge}>Tap to open ✨</span>
            </div>

            {/* Exciting Header & Value Proposition */}
            <div className={styles.giftTextGroup}>
              <div className={styles.topBadgeRow}>
                <span className={styles.exclusiveBadge}>
                  <span className={styles.pulsingDot}></span>
                  EXCLUSIVE VIP GIFT UNLOCKED
                </span>
                <span className={styles.couponTagPreview}>
                  🎟️ Code: <strong>FIRSTGO</strong> (Flat ₹150 OFF)
                </span>
                <span className={styles.timerBadge}>⚡ Limited Time</span>
              </div>

              <h3 className={styles.giftMainHeading}>
                Thank you for being our loyal customer —{' '}
                <span className={styles.gradientHighlight}>Claim Up to ₹200 OFF!</span>
              </h3>

              <p className={styles.giftSubtext}>
                Instant coupon discount applied at checkout · Valid on all Sleeper, Seater &amp; Express buses
              </p>
            </div>

            {/* High-Impact Glowing Action Button */}
            <div className={styles.actionGroup}>
              <button
                type="button"
                className={styles.viewGiftBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
              >
                <span className={styles.btnShimmerEffect}></span>
                <span className={styles.btnIcon}>🎁</span>
                <span className={styles.btnText}>Claim Your Gift</span>
                <span className={styles.btnArrow}>→</span>
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
