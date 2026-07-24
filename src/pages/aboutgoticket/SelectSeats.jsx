import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../stylespages/selectseats.module.css';

const SelectSeats = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const { selectedBus, selectedSlot } = state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTerms, setShowTerms]         = useState(false);

  const selectedTime = selectedSlot?.time || '05:05 PM';
  const selectedFare = selectedSlot?.fare || '₹599';
  const fareNumber   = parseInt(selectedFare.replace(/[^\d]/g, ''), 10) || 599;

  // Mock sold seats
  const soldSeats = ['S2', 'S7', 'S12', 'S18', 'S24', 'S31'];

  const toggleSeat = (seat) => {
    if (soldSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleProceedToDropPage = () => {
    if (selectedSeats.length === 0) return;
    setShowTerms(false);
    navigate('/drop', {
      state: {
        ...state,
        selectedSeats,
        busDetails: {
          name: selectedBus?.name || 'KN Speed Express',
          label: selectedBus?.label || 'Bus 1',
          id: selectedBus?.id || 'UP78KN1234',
          type: selectedBus?.type || 'AC Sleeper 2+1',
          date: state?.date || new Date().toISOString().split('T')[0],
          route: state?.route || 'Kanpur → Lucknow',
          time: selectedTime,
          fare: selectedFare,
        },
        boardingPoints: [
          {
            time: '04:00 PM',
            location: 'Rania Toll Plaza',
            address: 'Towards Auraiya, Rania (UP)',
          },
          {
            time: '04:30 PM',
            location: 'Jhatkari Bus Station',
            address: 'GT Road, Kanpur',
            popular: true,
          }
        ],
        droppingPoints: [
          {
            time: '05:45 PM',
            location: 'Zero Point, Greater Noida',
            address: 'Yamuna Expressway, Towards Delhi',
          },
          {
            time: '06:15 PM',
            location: 'Transport Nagar Metro Station',
            address: 'Near Gate No. 1, Lucknow',
            popular: true,
          }
        ],
      },
    });
  };

  const renderRows = () => {
    const rows = [];
    let count = 1;
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        row.push(`S${count++}`);
      }
      rows.push(row);
    }

    return (
      <div className={styles.seatGridContainer}>
        {rows.map((row, index) => (
          <div key={index} className={styles.seatRow}>
            <div className={styles.leftSeats}>
              {row.slice(0, 2).map((seat) => {
                const isSelected = selectedSeats.includes(seat);
                const isSold     = soldSeats.includes(seat);
                return (
                  <button
                    key={seat}
                    disabled={isSold}
                    className={`${styles.seat} ${
                      isSold
                        ? styles.sold
                        : isSelected
                        ? styles.selected
                        : styles.available
                    }`}
                    onClick={() => toggleSeat(seat)}
                  >
                    <span className={styles.seatHandle} />
                    <span className={styles.seatNum}>{seat}</span>
                  </button>
                );
              })}
            </div>
            
            <div className={styles.aisleGap}>AISLE</div>

            <div className={styles.rightSeats}>
              {row.slice(2).map((seat) => {
                const isSelected = selectedSeats.includes(seat);
                const isSold     = soldSeats.includes(seat);
                return (
                  <button
                    key={seat}
                    disabled={isSold}
                    className={`${styles.seat} ${
                      isSold
                        ? styles.sold
                        : isSelected
                        ? styles.selected
                        : styles.available
                    }`}
                    onClick={() => toggleSeat(seat)}
                  >
                    <span className={styles.seatHandle} />
                    <span className={styles.seatNum}>{seat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const totalAmount = selectedSeats.length * fareNumber;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Interactive Seat Selection</h1>

      {/* Operator Info Banner */}
      <div className={styles.busHeaderBanner}>
        <div className={styles.busBadgeTitle}>
          <span className={styles.operatorName}>{selectedBus?.name || 'KN Speed Express'}</span>
          <span className={styles.busClassTag}>{selectedBus?.type || 'AC Sleeper 2+1'}</span>
        </div>
        <div className={styles.routePill}>
          {state?.route || 'Kanpur → Lucknow'} · Date: {state?.date || new Date().toISOString().split('T')[0]}
        </div>
      </div>

      {/* Summary Grid */}
      <div className={styles.busDetailsGrid}>
        <div className={styles.detailBox}>
          <span className={styles.detailLabel}>Reg. Number</span>
          <span className={styles.detailVal}>{selectedBus?.id || 'UP78KN1234'}</span>
        </div>
        <div className={styles.detailBox}>
          <span className={styles.detailLabel}>Departure</span>
          <span className={styles.detailVal}>{selectedTime}</span>
        </div>
        <div className={styles.detailBox}>
          <span className={styles.detailLabel}>Fare / Seat</span>
          <span className={styles.detailVal}>{selectedFare}</span>
        </div>
        <div className={styles.detailBox}>
          <span className={styles.detailLabel}>Selected Seats</span>
          <span className={`${styles.detailVal} ${styles.seatsHighlight}`}>
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
          </span>
        </div>
      </div>

      {/* Legend Bar */}
      <div className={styles.legendBar}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${styles.availableBox}`} />
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${styles.selectedBox}`} />
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${styles.soldBox}`} />
          <span>Sold Out</span>
        </div>
      </div>

      {/* Bus Frame Layout */}
      <div className={styles.busFrameCard}>
        <div className={styles.driverSection}>
          <span className={styles.steeringIcon}>⭕ DRIVER CABIN</span>
        </div>

        <div className={styles.seatLayout}>{renderRows()}</div>

        <div className={styles.rearSection}>REAR CABIN</div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className={styles.bottomActionBar}>
        <div className={styles.fareSummaryBox}>
          <div className={styles.totalFareLabel}>Total Amount ({selectedSeats.length} Seats)</div>
          <div className={styles.totalFareValue}>₹{totalAmount}</div>
        </div>
        <button
          className={styles.confirmBtn}
          disabled={selectedSeats.length === 0}
          onClick={() => setShowTerms(true)}
        >
          {selectedSeats.length > 0
            ? `Confirm & Proceed (${selectedSeats.length} Seats)`
            : 'Select at least 1 Seat'}
        </button>
      </div>

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Travel Guidelines & Terms</h3>
            <ul className={styles.termsList}>
              <li>Valid, confirmed ticket is mandatory for boarding.</li>
              <li>Government ID proof (Aadhaar/PAN/Voter ID) must be shown at boarding.</li>
              <li>Arrive at the boarding point 15 minutes prior to scheduled departure time.</li>
              <li>Selected seat allocations are locked and non-transferable.</li>
              <li>Smoking or alcohol consumption is strictly prohibited on board.</li>
            </ul>
            <div className={styles.modalActions}>
              <button className={styles.cancelModalBtn} onClick={() => setShowTerms(false)}>
                Cancel
              </button>
              <button className={styles.proceedModalBtn} onClick={handleProceedToDropPage}>
                Select Boarding & Dropping Points →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectSeats;
