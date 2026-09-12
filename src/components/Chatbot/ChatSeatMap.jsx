// GoTicket Interactive Chatbot Seat Map Component
// Step 3: Interactive Visual Seat Selection inside Chatbot
// Single Source of Truth: Uses seat layout model and live seat states from seatService.js

import React from 'react';
import './ChatSeatMap.css';

export default function ChatSeatMap({
  seatMap = {},
  onToggleSeat = () => {},
  onConfirmSeats = () => {},
}) {
  const {
    busName = 'Selected Bus',
    operator = 'GoTicket Express',
    fare = 599,
    slotTime = '08:30 PM',
    date = '',
    selectedSeats = [],
    recommendedSeats = [],
    rows = [],
  } = seatMap;

  const fareNum = typeof fare === 'number' ? fare : parseInt(String(fare).replace(/[^\d]/g, ''), 10) || 599;
  const totalAmount = selectedSeats.length * fareNum;

  return (
    <div className="chat-seatmap-card">
      {/* Header */}
      <div className="chat-seatmap-header">
        <div>
          <div className="chat-seatmap-title">🚌 {operator} — {busName}</div>
          <div className="chat-seatmap-sub">{date ? `${date} • ` : ''}{slotTime}</div>
        </div>
        <div className="chat-seatmap-fare">₹{fareNum}<small style={{ fontSize: '9px', color: '#64748b' }}>/seat</small></div>
      </div>

      {/* Legend */}
      <div className="chat-seatmap-legend">
        <div className="legend-item">
          <div className="legend-swatch available" />
          <span>Open</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch recommended" />
          <span>Best</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch selected" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch occupied" />
          <span>Sold</span>
        </div>
      </div>

      {/* Bus Container */}
      <div className="chat-seatmap-bus">
        <div className="bus-front-indicator">
          <span>FRONT / ENTRY 🚪</span>
          <span>STEERING 🛞</span>
        </div>

        {/* 8 Rows: 2 Left + Aisle + 3 Right */}
        <div className="chat-seatmap-rows">
          {rows.map((row) => (
            <div key={row.rowIndex} className="chat-seatmap-row">
              {/* Left Side (Col 1 & 2) */}
              <div className="chat-seats-side">
                {row.left.map((seat) => {
                  const isSel = selectedSeats.includes(seat.id);
                  const isRec = recommendedSeats.includes(seat.id);
                  const isOcc = seat.status === 'occupied';

                  let btnClass = 'chat-seat-btn';
                  if (isOcc) btnClass += ' occupied';
                  else if (isSel) btnClass += ' selected';
                  else if (isRec) btnClass += ' recommended';

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={isOcc}
                      className={btnClass}
                      title={`${seat.id} • ${seat.isWindow ? 'Window' : 'Aisle'} ${seat.berth ? `(${seat.berth} berth)` : ''} • ${isOcc ? 'Occupied' : '₹' + fareNum}`}
                      onClick={() => onToggleSeat(seat.id)}
                    >
                      {isRec && !isSel && <span className="seat-rec-star">⭐</span>}
                      <span>{seat.id}</span>
                      {seat.isWindow && <span className="seat-window-tag">W</span>}
                    </button>
                  );
                })}
              </div>

              {/* Aisle */}
              <div className="chat-seats-aisle">AISLE</div>

              {/* Right Side (Col 3, 4, 5) */}
              <div className="chat-seats-side">
                {row.right.map((seat) => {
                  const isSel = selectedSeats.includes(seat.id);
                  const isRec = recommendedSeats.includes(seat.id);
                  const isOcc = seat.status === 'occupied';

                  let btnClass = 'chat-seat-btn';
                  if (isOcc) btnClass += ' occupied';
                  else if (isSel) btnClass += ' selected';
                  else if (isRec) btnClass += ' recommended';

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={isOcc}
                      className={btnClass}
                      title={`${seat.id} • ${seat.isWindow ? 'Window' : seat.isAisle ? 'Aisle' : 'Middle'} ${seat.berth ? `(${seat.berth} berth)` : ''} • ${isOcc ? 'Occupied' : '₹' + fareNum}`}
                      onClick={() => onToggleSeat(seat.id)}
                    >
                      {isRec && !isSel && <span className="seat-rec-star">⭐</span>}
                      <span>{seat.id}</span>
                      {seat.isWindow && <span className="seat-window-tag">W</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Selection Bar */}
      <div className="chat-seatmap-footer">
        <div className="seatmap-summary-text">
          {selectedSeats.length > 0 ? (
            <>
              Selected: <strong>{selectedSeats.join(', ')}</strong> • Total: <strong>₹{totalAmount}</strong>
            </>
          ) : (
            <span style={{ color: '#64748b' }}>Click any available seat to select</span>
          )}
        </div>

        {selectedSeats.length > 0 && (
          <button
            type="button"
            className="seatmap-confirm-btn"
            onClick={() => onConfirmSeats(selectedSeats)}
          >
            Confirm Seats ({selectedSeats.length}) ⚡
          </button>
        )}
      </div>
    </div>
  );
}
