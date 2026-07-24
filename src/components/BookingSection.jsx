
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/bookingsection.module.css'; // Adjust path if needed

const Bookings = () => {
  const navigate = useNavigate();

  return (
    <section id="how-to-book" className={styles.bookingSection}>
      <div className={styles.bookingContent}>
        {/* Text Section */}
        <div className={styles.bookingText}>
          <h2><u>How to Book a Bus Ticket</u></h2>
          <p>
            Booking your journey with Go Ticket is fast, simple, and secure. Whether you're planning ahead or booking last-minute, our platform ensures a smooth experience from search to e-ticket.
          </p>
          <p>
            Follow these easy steps to reserve your seat and receive your digital ticket instantly:
          </p>
          <ol className={styles.bookingSteps}>
            <li><strong><u>Visit the Go Ticket Website:</u></strong> Open your browser and go to the official Go Ticket homepage.</li>
            <li><strong><u>Enter Travel Details:</u></strong> Enter your departure and destination cities, along with travel date.</li>
            <li><strong><u>Choose Your Bus:</u></strong> Browse available buses, check timings, seat layout, and fare details.</li>
            <li><strong><u>Select Your Seat:</u></strong> Pick your preferred seat from the live seat map.</li>
            <li><strong><u>Enter Passenger Details:</u></strong> Fill in your name, contact number, and any required ID info.</li>
            <li><strong><u>Make Payment:</u></strong> Choose a payment method and complete the transaction securely.</li>
            <li><strong><u>Receive E-Ticket:</u></strong> Your ticket will be sent instantly via SMS and email with all travel details.</li>
          </ol>
        </div>

        {/* Image Section */}
        <div className={styles.bookingImage}>
          <img src="/images/About us (7).png" alt="Booking illustration showing Go Ticket search screen" />
        </div>
      </div>

      {/* Book Now Button */}
      <div className={styles.buttonWrapper}>
        <button className={styles.bookingButton} onClick={() => navigate('/seatbooking')}>
          <b>Book Now</b>
        </button>
      </div>

      {/* Divider Line Outside Padded Container */}
      <div className={styles.fullWidthDivider}>
        <hr className={styles.sectionDivider} />
      </div>
    </section>
  );
};

export default Bookings;
