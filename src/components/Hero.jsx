// import React from 'react';
// import styles from '../styles/hero.module.css'; // Adjust path if needed

// const Hero = () => {
//   return (
//     <>
//       <section className={styles.hero}>
//         {/* Left side: Text + Buttons + Icons */}
//         <div className={styles.heroText}>
//           <h1><u>GO TICKET</u></h1>
//           <p><b>Technology, when combined with innovation, has the power to make everyday life seamless, connected, and smarter.</b></p>

//           <div className={styles.searchSection}>
//             {/* SEARCH BUSES button */}
//             <div className={styles.buttons}>
//               <button>🔍 SEARCH BUSES</button>
//             </div>

//             {/* Transport icons */}
//             <div className={styles.transportIcons}>
//               <img src="/images/About us (5).png" alt="Plane" />
//               <img src="/images/About us (2).png" alt="Train" />
//               <img src="/images/About us (4).png" alt="Bus" />
//               <img src="/images/About us (3).png" alt="Car" />
//             </div>

//             {/* SEAT BOOKING button */}
//             <div className={styles.seatBooking}>
//               <button>🪑 SEAT BOOKING</button>
//             </div>
//           </div>
//         </div>

//         {/* Right side: Bus image */}
//         <div className={styles.heroImage}>
//           <img src="/images/About us (1).png" alt="Bus Image" />
//         </div>
//       </section>

//       {/* Horizontal line divider */}
//       <hr className={styles.sectionDivider} />
//     </>
//   );
// };

// export default Hero;
import React from 'react';
import styles from '../styles/hero.module.css'; // Adjust path if needed

const Hero = () => {
  return (
    <>
      <section className={styles.hero}>
        {/* Left side: Text + Buttons + Icons */}
        <div className={styles.heroText}>
          <h1><u>GO TICKET</u></h1>
          <p><b>Technology, when combined with innovation, has the power to make everyday life seamless, connected, and smarter.</b></p>

          <div className={styles.searchSection}>
            {/* SEARCH BUSES button */}
            <div className={styles.buttons}>
              <button>🔍 SEARCH BUSES</button>
            </div>

            {/* Transport icons */}
            <div className={styles.transportIcons}>
              <img src="/images/About us (5).png" alt="Plane" />
              <img src="/images/About us (2).png" alt="Train" />
              <img src="/images/About us (4).png" alt="Bus" />
              <img src="/images/About us (3).png" alt="Car" />
            </div>

            {/* SEAT BOOKING button */}
            <div className={styles.seatBooking}>
              <button>🪑 SEAT BOOKING</button>
            </div>
          </div>
        </div>

        {/* Right side: Bus image */}
        <div className={styles.heroImage}>
          <img src="/images/About us (1).png" alt="Go-Ticket Express Bus" />
        </div>
      </section>

    </>
  );
};

export default Hero;

