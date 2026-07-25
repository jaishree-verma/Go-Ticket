import React, { useState } from 'react';
import styles from '../styles/faq.module.css';

const FAQ_ITEMS = [
  {
    category: 'Booking & Tickets',
    question: "How do I book a bus ticket on Go Ticket?",
    answer: "Enter your source city, destination, and travel date on the home page search widget. Browse available bus operators, pick your seat, enter passenger details, and pay securely to receive your instant digital E-Ticket."
  },
  {
    category: 'Tracking & Live Status',
    question: "How does real-time GPS bus tracking work?",
    answer: "Once your ticket is booked, click 'Track Now' or visit the Bus Track section. Enter your PNR or trip details to view live vehicle location, current speed, and updated arrival times."
  },
  {
    category: 'Cancellation & Refunds',
    question: "Can I cancel or reschedule my bus ticket?",
    answer: "Yes, tickets can be cancelled or rescheduled up to 2 hours before departure via the E-Ticket management page. Refund amounts are processed instantly according to operator policy."
  },
  {
    category: 'Payments & Safety',
    question: "What payment methods are supported?",
    answer: "We support UPI (Google Pay, PhonePe, Paytm), All Major Credit & Debit Cards, Net Banking, and Digital Wallets with 256-bit SSL encryption."
  },
  {
    category: 'Boarding & Safety',
    question: "Do I need to print my ticket before boarding?",
    answer: "No paper printouts needed! Simply present your digital E-Ticket QR code or SMS confirmation along with a valid Government ID."
  },
  {
    category: 'Support',
    question: "How do I contact customer support if my bus is delayed?",
    answer: "Our 24/7 customer care team is accessible directly via live chat on the app or via the Contact page helpline number."
  }
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <div className={styles.headerArea}>
          <span className={styles.sectionBadge}>GOT QUESTIONS?</span>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.subTitle}>Find quick answers to common questions about ticket booking, live tracking, payments, and cancellations.</p>
        </div>

        <div className={styles.faqGrid}>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`${styles.faqBox} ${isOpen ? styles.open : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className={styles.faqQuestion}>
                  <div className={styles.questionTextGroup}>
                    <span className={styles.categoryBadge}>{item.category}</span>
                    <span className={styles.questionText}>{item.question}</span>
                  </div>
                  <span className={styles.toggleIcon}>{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <div className={styles.faqAnswer}>
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
