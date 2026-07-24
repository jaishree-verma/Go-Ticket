// import { useState } from 'react';
// import styles from '../styles/faq.module.css';

// const faqItems = [
//   { question: "How do I track my bus?", answer: "Use the 'Track Now' button to view your bus’s live location and arrival time." },
//   { question: "What if my bus doesn’t show up?", answer: "Check with your operator or contact Go Ticket support for help." },
//   { question: "Is tracking available for all buses?", answer: "Only verified buses on Go Ticket’s platform support live tracking." },
//   { question: "Do I need to download an app?", answer: "No — tracking works directly from your browser." },
//   { question: "Is my data secure?", answer: "Yes, Go Ticket uses encrypted channels to protect your travel information." },
//   { question: "Can I view nearby buses?", answer: "Yes, the map shows other vehicles in your area." },
//   { question: "Does tracking work internationally?", answer: "Currently, tracking is available only in supported regions." },
//   { question: "Can I share my live location?", answer: "Yes, you can share your trip with friends or family." },
//   { question: "Is there a cost to use tracking?", answer: "Live tracking is free for all Go Ticket users." },
// ];

// const Faq = () => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggleFAQ = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div className={styles.faqSection}>
//       <hr className={styles.sectionDivider} />
//       <h2 className={styles.sectionTitle}><u>Frequently Asked Questions</u></h2>

//       <div className={styles.faqGrid}>
//         {faqItems.map((item, index) => {
//           const isOpen = openIndex === index;
//           return (
//             <div key={index} className={`${styles.faqBox} ${isOpen ? styles.open : ''}`} onClick={() => toggleFAQ(index)}>
//               <div className={styles.faqQuestion}>
//                 <span>{item.question}</span>
//                 <span className={styles.plusSign}>{isOpen ? '−' : '+'}</span>
//               </div>
//               <div className={`${styles.faqAnswer} ${isOpen ? styles.open : ''}`}>
//                 {item.answer}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Final divider after FAQ section */}
//       <hr className={styles.faqEndDivider} />
//     </div>
//   );
// };

// export default Faq;
import { useState } from 'react';
import styles from '../styles/faq.module.css';

const faqItems = [
  { question: "How do I track my bus?", answer: "Use the 'Track Now' button to view your bus’s live location and arrival time." },
  { question: "What if my bus doesn’t show up?", answer: "Check with your operator or contact Go Ticket support for help." },
  { question: "Is tracking available for all buses?", answer: "Only verified buses on Go Ticket’s platform support live tracking." },
  { question: "Do I need to download an app?", answer: "No — tracking works directly from your browser." },
  { question: "Is my data secure?", answer: "Yes, Go Ticket uses encrypted channels to protect your travel information." },
  { question: "Can I view nearby buses?", answer: "Yes, the map shows other vehicles in your area." },
  { question: "Does tracking work internationally?", answer: "Currently, tracking is available only in supported regions." },
  { question: "Can I share my live location?", answer: "Yes, you can share your trip with friends or family." },
  { question: "Is there a cost to use tracking?", answer: "Live tracking is free for all Go Ticket users." },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqSection}>
      <h2 className={styles.sectionTitle}><u>Frequently Asked Questions</u></h2>

      <div className={styles.faqGrid}>
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className={`${styles.faqBox} ${isOpen ? styles.open : ''}`} onClick={() => toggleFAQ(index)}>
              <div className={styles.faqQuestion}>
                <span>{item.question}</span>
                <span className={styles.plusSign}>{isOpen ? '−' : '+'}</span>
              </div>
              <div className={`${styles.faqAnswer} ${isOpen ? styles.open : ''}`}>
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faq;
