// import React from 'react';
// import styles from '../styles/trackbus.module.css'; // Adjust path if needed

// const TrackBus = () => {
//   return (
//     <section id="track-bus" className={styles.trackBus}>
//       <div className={styles.trackContent}>
//         <h1><u>Track Your Bus Live with Go Ticket</u></h1>
//         <div className={styles.spacer}></div>
//         <p>
//           Worried about delays or missed buses? With Go Ticket’s <strong>Live Bus Tracking</strong>, you get real-time updates on your bus’s location, speed, and arrival time — all from your phone.
//         </p>
//         <ul className={styles.trackList}>
//           <li><strong><u>Live Location Map:</u></strong> Watch your bus move in real time.</li>
//           <li><strong><u>ETA Alerts:</u></strong> Know exactly when to reach your stop.</li>
//           <li><strong><u>Boarding Point Clarity:</u></strong> Get precise directions to your pickup spot.</li>
//           <li><strong><u>Secure Access:</u></strong> Only valid passengers can track.</li>
//           <li><strong><u>No App Needed:</u></strong> Works directly in your browser.</li>
//         </ul>
//         <p>
//           Whether you're traveling solo or tracking a loved one’s journey, Go Ticket gives you peace of mind — every step of the way.
//         </p>
//       </div>

//       <div className={styles.trackImage}>
//         <img src="/images/About us (8).png" alt="Live Bus Tracking Illustration" />
//       </div>
      
//   <div className={styles.buttonWrapper}>
//     <button className={styles.trackButton}><b>TRACK NOW</b></button>
//   </div>
    
//     </section>
//   );
// };

// export default TrackBus;
import React from 'react';
import styles from '../styles/trackbus.module.css'; // Adjust path if needed

const TrackBus = () => {
  return (
    <section id="track-bus" className={styles.trackBus}>
      <div className={styles.trackContent}>
        <h1><u>Track Your Bus Live with Go Ticket</u></h1>
        <div className={styles.spacer}></div>
        <p>
          Worried about delays or missed buses? With Go Ticket’s <strong>Live Bus Tracking</strong>, you get real-time updates on your bus’s location, speed, and arrival time — all from your phone.
        </p>
        <ul className={styles.trackList}>
          <li><strong><u>Live Location Map:</u></strong> Watch your bus move in real time.</li>
          <li><strong><u>ETA Alerts:</u></strong> Know exactly when to reach your stop.</li>
          <li><strong><u>Boarding Point Clarity:</u></strong> Get precise directions to your pickup spot.</li>
          <li><strong><u>Secure Access:</u></strong> Only valid passengers can track.</li>
          <li><strong><u>No App Needed:</u></strong> Works directly in your browser.</li>
        </ul>
        <p>
          Whether you're traveling solo or tracking a loved one’s journey, Go Ticket gives you peace of mind — every step of the way.
        </p>
      </div>

      <div className={styles.trackImage}>
        <img src="/images/About us (8).png" alt="Live Bus Tracking Illustration" />
      </div>
      
  <div className={styles.buttonWrapper}>
    <button className={styles.trackButton}><b>TRACK NOW</b></button>
  </div>
    
    </section>
  );
};

export default TrackBus;
