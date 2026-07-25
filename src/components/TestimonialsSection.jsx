import React from 'react';
import styles from '../styles/testimonials.module.css';

const REVIEWS_DATA = [
  {
    name: 'Aman Sharma',
    city: 'Kanpur',
    rating: 5,
    date: 'Verified Journey (Kanpur ➔ Delhi)',
    comment: 'Go Ticket made my urgent travel completely hassle-free! Live tracking was pinpoint accurate and saved me 45 minutes of waiting at the bus stand.'
  },
  {
    name: 'Priya Verma',
    city: 'Lucknow',
    rating: 5,
    date: 'Verified Journey (Lucknow ➔ Varanasi)',
    comment: 'Clean seat layouts, instant WhatsApp E-Tickets, and zero hidden charges! Easily the best bus booking experience I have had so far.'
  },
  {
    name: 'Rahul Gupta',
    city: 'Delhi',
    rating: 5,
    date: 'Verified Journey (Delhi ➔ Chandigarh)',
    comment: 'Tixie chatbot helped me contact direct booking agents when I needed emergency seat upgrades for my family. Top notch 24/7 service!'
  },
  {
    name: 'Sneha Rastogi',
    city: 'Jaipur',
    rating: 5,
    date: 'Verified Journey (Jaipur ➔ Delhi)',
    comment: 'Super easy sleeper seat selection and instant SMS updates. Boarding point navigation was so clear on live GPS!'
  },
  {
    name: 'Vikram Singh',
    city: 'Agra',
    rating: 5,
    date: 'Verified Journey (Agra ➔ Noida)',
    comment: 'Discount codes FIRSTGO gave me ₹150 off instantly! Will definitely use Go Ticket for all future travels.'
  },
  {
    name: 'Ananya Roy',
    city: 'Kolkata',
    rating: 5,
    date: 'Verified Journey (Mumbai ➔ Pune)',
    comment: 'Booked seats in 2 minutes right from my phone. Seamless payment options via UPI and prompt customer care.'
  }
];

const TestimonialsSection = () => {
  // Duplicate array for continuous marquee scrolling loop
  const marqueeReviews = [...REVIEWS_DATA, ...REVIEWS_DATA];

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <span className={styles.sectionBadge}>HAPPY PASSENGERS</span>
          <h2 className={styles.heading}>What Our Passengers Say About Go Ticket</h2>
          <p className={styles.subheading}>Real live reviews from verified travelers across India.</p>
        </div>

        {/* Marquee Carousel Slider */}
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeContent}>
            {marqueeReviews.map((rev, idx) => (
              <div key={idx} className={styles.reviewCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.ratingStars}>
                    {'⭐'.repeat(rev.rating)}
                  </div>
                  <span className={styles.verifiedTag}>● LIVE REVIEW</span>
                </div>
                <p className={styles.comment}>"{rev.comment}"</p>
                
                <div className={styles.userMeta}>
                  <div className={styles.avatarCircle}>{rev.name.charAt(0)}</div>
                  <div className={styles.userInfo}>
                    <h4 className={styles.userName}>{rev.name}</h4>
                    <span className={styles.userRoute}>{rev.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
