import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../stylespages/availablebuses.module.css';

const AvailableBuses = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const travelRoute = state?.route || 'Delhi → Kanpur';
  const travelDate  = state?.date || new Date().toISOString().split('T')[0];
  const ampmFilter  = state?.ampm || 'AM';

  const buses = [
    {
      id: 'UP78KN1234',
      name: 'KN Speed Express',
      type: 'AC Sleeper 2+1',
      label: 'Bus 1',
      rating: '4.8 ★',
      amenities: ['⚡ Charging', '📶 Free Wi-Fi', '🥛 Water Bottle'],
      slots: [
        { time: '05:05 PM', fare: '₹599', status: 'available' },
        { time: '07:30 PM', fare: '₹649', status: 'filling' },
        { time: '08:00 PM', fare: '₹699', status: 'filled' },
        { time: '09:00 PM', fare: '₹699', status: 'available' },
        { time: '10:00 PM', fare: '₹699', status: 'filling' }
      ]
    },
    {
      id: 'UP78GE5678',
      name: 'GoExpress Deluxe',
      type: 'Non-AC Seater 2+2',
      label: 'Bus 2',
      rating: '4.6 ★',
      amenities: ['⚡ Charging', '💺 Pushback Seats'],
      slots: [
        { time: '06:30 AM', fare: '₹499', status: 'available' },
        { time: '08:00 AM', fare: '₹549', status: 'filling' },
        { time: '10:15 AM', fare: '₹599', status: 'filled' },
        { time: '05:05 PM', fare: '₹599', status: 'available' },
        { time: '07:30 PM', fare: '₹649', status: 'filling' }
      ]
    },
    {
      id: 'UP78SP9012',
      name: 'SwiftLine Luxury',
      type: 'Volvo AC Seater',
      label: 'Bus 3',
      rating: '4.9 ★',
      amenities: ['⚡ Charging', '📶 Wi-Fi', '❄️ Climate Control', '🎬 Movies'],
      slots: [
        { time: '04:30 PM', fare: '₹579', status: 'available' },
        { time: '06:45 PM', fare: '₹629', status: 'filling' },
        { time: '09:15 PM', fare: '₹679', status: 'filled' },
        { time: '10:15 PM', fare: '₹679', status: 'available' },
        { time: '11:15 PM', fare: '₹679', status: 'filling' },
        { time: '12:15 PM', fare: '₹679', status: 'filled' }
      ]
    },
    {
      id: 'UP79SL9012',
      name: 'Royal Comforts',
      type: 'AC Multi-Axle Sleeper',
      label: 'Bus 4',
      rating: '4.7 ★',
      amenities: ['🛌 Blankets', '⚡ Charging', '🚰 Mineral Water'],
      slots: [
        { time: '04:30 PM', fare: '₹579', status: 'available' },
        { time: '06:45 PM', fare: '₹629', status: 'filling' },
        { time: '09:15 AM', fare: '₹679', status: 'filled' },
        { time: '10:15 AM', fare: '₹679', status: 'available' },
        { time: '11:15 AM', fare: '₹679', status: 'filling' },
        { time: '12:15 AM', fare: '₹679', status: 'filled' }
      ]
    },
    {
      id: 'UP88SL9012',
      name: 'Havok Executive',
      type: 'AC Seater 2+2',
      label: 'Bus 5',
      rating: '4.5 ★',
      amenities: ['⚡ Charging', '🛋️ Leg Rest'],
      slots: [
        { time: '04:30 PM', fare: '₹579', status: 'available' },
        { time: '06:45 PM', fare: '₹629', status: 'filling' },
        { time: '09:15 PM', fare: '₹679', status: 'filled' },
        { time: '10:15 PM', fare: '₹679', status: 'available' },
        { time: '11:15 PM', fare: '₹679', status: 'filling' },
        { time: '12:15 PM', fare: '₹679', status: 'filled' }
      ]
    },
    {
      id: 'UP32SL5712',
      name: 'Feel Breeze Volvo',
      type: 'Volvo AC Multi-Axle',
      label: 'Bus 6',
      rating: '4.8 ★',
      amenities: ['⚡ Charging', '📶 Wi-Fi', '💊 Emergency Kit'],
      slots: [
        { time: '04:30 PM', fare: '₹579', status: 'available' },
        { time: '06:45 PM', fare: '₹629', status: 'filling' },
        { time: '09:15 PM', fare: '₹679', status: 'filled' },
        { time: '10:15 PM', fare: '₹679', status: 'available' },
        { time: '11:15 PM', fare: '₹679', status: 'filling' },
        { time: '12:15 PM', fare: '₹679', status: 'filled' }
      ]
    },
    {
      id: 'UP88SL8812',
      name: 'Only Way Intercity',
      type: 'Non-AC Sleeper',
      label: 'Bus 7',
      rating: '4.4 ★',
      amenities: ['⚡ Charging', '🧳 Extra Luggage Space'],
      slots: [
        { time: '04:30 AM', fare: '₹579', status: 'available' },
        { time: '06:45 AM', fare: '₹629', status: 'filling' },
        { time: '09:15 PM', fare: '₹679', status: 'filled' },
        { time: '10:15 PM', fare: '₹679', status: 'available' },
        { time: '11:15 PM', fare: '₹679', status: 'filling' },
        { time: '12:15 PM', fare: '₹679', status: 'filled' }
      ]
    },
    {
      id: 'UP88SL9012',
      name: 'Kite Travels',
      type: 'AC Seater 2+2',
      label: 'Bus 8',
      rating: '4.6 ★',
      amenities: ['⚡ Charging', '📺 TV Screen'],
      slots: [
        { time: '04:30 PM', fare: '₹579', status: 'available' },
        { time: '06:45 AM', fare: '₹629', status: 'filling' },
        { time: '09:15 AM', fare: '₹679', status: 'filled' },
        { time: '10:15 PM', fare: '₹679', status: 'available' },
        { time: '11:15 AM', fare: '₹679', status: 'filling' },
        { time: '12:15 AM', fare: '₹679', status: 'filled' }
      ]
    }
  ];

  const handleSlotClick = (bus, slot) => {
    navigate('/select-seats', {
      state: {
        ...state,
        selectedBus: bus,
        selectedSlot: slot
      }
    });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Available Buses</h1>
      
      {/* Route & Date Banner Strip */}
      <div className={styles.routeHeaderCard}>
        <div className={styles.routeBadgeInfo}>
          <span className={styles.routeText}>{travelRoute}</span>
          <span className={styles.dateText}>Date: {travelDate} ({ampmFilter} Filter)</span>
        </div>
        <button className={styles.modifyBtn} onClick={() => navigate('/seatbooking')}>
          Modify Search
        </button>
      </div>

      {/* Legend Bar */}
      <div className={styles.statusLegend}>
        <div className={styles.legendItem}>
          <span className={`${styles.statusDot} ${styles.available}`}></span> Available
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.statusDot} ${styles.filling}`}></span> Filling Fast
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.statusDot} ${styles.filled}`}></span> Fully Booked
        </div>
      </div>

      {/* Bus Cards List */}
      <div className={styles.busGrid}>
        {buses.map((bus) => {
          const filteredSlots = bus.slots.filter((slot) =>
            slot.time.includes(ampmFilter)
          );

          return (
            <div key={bus.id} className={styles.busCard}>
              {/* Left Column: Operator details & ratings */}
              <div className={styles.busInfo}>
                <div className={styles.titleRow}>
                  <h3>{bus.name}</h3>
                  <span className={styles.ratingBadge}>{bus.rating}</span>
                </div>
                <div className={styles.busSubRow}>
                  <span className={styles.busTypeTag}>{bus.type}</span>
                  <span className={styles.busRegNo}>Bus Reg: <strong>{bus.id}</strong></span>
                </div>
                <div className={styles.amenitiesRow}>
                  {bus.amenities.map((item, idx) => (
                    <span key={idx} className={styles.amenityTag}>{item}</span>
                  ))}
                </div>
              </div>

              {/* Right Column: Time Slot Bubbles */}
              <div className={styles.slotsWrapper}>
                <div className={styles.timeSlotsHeader}>Select Departure Time Slot ({ampmFilter})</div>
                <div className={styles.timeSlots}>
                  {filteredSlots.length > 0 ? (
                    filteredSlots.map((slot, i) => (
                      <div
                        key={i}
                        className={`${styles.timeBubble} ${styles[slot.status]}`}
                        onClick={() => slot.status !== 'filled' && handleSlotClick(bus, slot)}
                      >
                        <span className={styles.timeText}>{slot.time}</span>
                        <span className={styles.fareTag}>{slot.fare}</span>
                        <span className={styles.tooltipFare}>Fare: {slot.fare}</span>
                      </div>
                    ))
                  ) : (
                    <p className={styles.noSlots}>
                      No {ampmFilter} departures available for this bus operator.
                    </p>
                  )}
                </div>
                
                {filteredSlots.length > 0 && (
                  <div className={styles.cancellationWrapper}>
                    <span className={styles.cancellationNote}>Free Cancellation available up to 4 hrs before departure</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableBuses;
