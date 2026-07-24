// import React from 'react';
// import { Link } from 'react-router-dom';
// import styles from '../styles/footer.module.css';

// const Footer = () => {
//   return (
//     <footer className={styles.footer}>
//       <div className={styles.footerContainer}>
//         {/* About Go-Ticket Section */}
//         <div className={styles.footerColumn}>
//           <h2><u><b>About Go-Ticket</b></u></h2>
//           <ul>
//             <li><Link to="/home"><u>Home</u></Link></li>
//             <li><Link to="/e-ticket"><u>E-Ticket</u></Link></li>
//             <li><Link to="/seat-booking"><u>Seat Booking</u></Link></li>
//             <li><Link to="/live-tracking"><u>Live Tracking</u></Link></li>
//             <li><Link to="/secure-payment"><u>Secure Payment</u></Link></li>
//             <li><Link to="/contact"><u>Contact Us</u></Link></li>
//           </ul>
//         </div>

//         {/* Info Section */}
//         <div className={styles.footerColumn}>
//           <h2><u><b>Info</b></u></h2>
//           <ul>
//             <li><Link to="/terms"><u>Terms & Conditions</u></Link></li>
//             <li><Link to="/privacy"><u>Privacy Policy</u></Link></li>
//             <li><Link to="/agreement"><u>Non Disclosure Agreement</u></Link></li>
//             <li><Link to="/closure"><u>Responsible Closure</u></Link></li>
//             <li><Link to="/sites"><u>Global Sites References - Red Bus & Abhi Bus</u></Link></li>
//             <li><Link to="/working"><u>Working Criteria</u></Link></li>
//           </ul>
//         </div>
//       </div>

//       {/* Footer Bottom */}
//       <div className={styles.footerBottom}>
//         <p>© 2025 Go Ticket India. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import styles from '../styles/footer.module.css';

// // const Footer = () => {
// //   return (
// //     <footer className={styles.footer}>
// //       <div className={styles.footerContainer}>
// //         <div className={styles.footerColumn}>
// //           <h2><u><b>About Go-Ticket</b></u></h2>
// //           <ul>
// //             <li><Link to="/home"><u>Home</u></Link></li>
// //             <li><Link to="/e-ticket"><u>E-Ticket</u></Link></li>
// //             <li><Link to="/seat-booking"><u>Seat Booking</u></Link></li>
// //             <li><Link to="/live-tracking"><u>Live Tracking</u></Link></li>
// //             <li><Link to="/secure-payment"><u>Secure Payment</u></Link></li>
// //             <li><Link to="/contact"><u>Contact Us</u></Link></li>
// //           </ul>
// //         </div>

// //         <div className={styles.footerColumn}>
// //           <h2><u><b>Info</b></u></h2>
// //           <ul>
// //             <li><Link to="/terms"><u>Terms & Conditions</u></Link></li>
// //             <li><Link to="/privacy"><u>Privacy Policy</u></Link></li>
// //             <li><Link to="/agreement"><u>Non Disclosure Agreement</u></Link></li>
// //             <li><Link to="/closure"><u>Responsible Closure</u></Link></li>
// //             <li><Link to="/sites"><u>Global Sites References - Red Bus & Abhi Bus</u></Link></li>
// //             <li><Link to="/working"><u>Working Criteria</u></Link></li>
// //           </ul>
// //         </div>
// //       </div>

// //       <div className={styles.footerBottom}>
// //         <p>© 2025 Go Ticket India. All rights reserved.</p>
// //       </div>
// //     </footer>
// //   );
// // };

// // export default Footer;
import React from 'react';
import styles from '../styles/footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerColumn}>
          <h2><u><b>About Go-Ticket</b></u></h2>
          <ul>
            <li><a href="/"><u>Home</u></a></li>
            <li><a href="/e-ticket"><u>E-Ticket</u></a></li>
            <li><a href="/seat-booking"><u>Seat Booking</u></a></li>
            <li><a href="/live-tracking"><u>Live Tracking</u></a></li>
            <li><a href="/contact"><u>Contact Us</u></a></li>
            
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h2><u><b>Info</b></u></h2>
          <ul>
            <li><a href="/terms"><u>Terms & Conditions</u></a></li>
            <li><a href="/privacy"><u>Privacy Policy</u></a></li>
            <li><a href="/privacy"><u>Secure Payment</u></a></li>
            <li><a href="/closure"><u>Responsible Closure</u></a></li>
            <li><a href="/closure"><u>Global Sites References - Red Bus & Abhi Bus</u></a></li>
           
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2025 Go Ticket India. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
