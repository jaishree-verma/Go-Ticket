import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchBuses } from '../../services/busService';
import { getRealRouteData } from '../../services/routeService';
import styles from '../../stylespages/availablebuses.module.css';

const AvailableBuses = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const fromCity   = state?.from || 'Kanpur';
  const toCity     = state?.to || 'Delhi';
  const travelDate = state?.date || new Date().toISOString().split('T')[0];
  const ampmFilter = state?.ampm || '';

  const travelRoute = state?.route || `${fromCity} → ${toCity}`;

  const [buses, setBuses]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [routeInfo, setRouteInfo]         = useState(null);
  const [activeTypeFilters, setActiveTypeFilters] = useState(
    Array.isArray(state?.selectedBusTypes) ? state.selectedBusTypes : []
  );

  const FILTER_OPTIONS = ['AC', 'Seater', 'Sleeper', 'Non AC', 'Bus Track', 'New Buses', 'Offers'];

  const toggleTypeFilter = (filterName) => {
    setActiveTypeFilters((prev) =>
      prev.includes(filterName) ? prev.filter((f) => f !== filterName) : [...prev, filterName]
    );
  };

  const clearFilters = () => setActiveTypeFilters([]);

  const filteredBuses = buses.filter((bus) => {
    if (activeTypeFilters.length === 0) return true;
    return activeTypeFilters.every((filterType) => {
      const bType = (bus.busType || '').toLowerCase();
      const amenities = (bus.amenities || []).map((a) => a.toLowerCase());

      if (filterType === 'AC') {
        return bType.includes('ac') && !bType.includes('non');
      }
      if (filterType === 'Non AC') {
        return bType.includes('non');
      }
      if (filterType === 'Seater') {
        return bType.includes('seater');
      }
      if (filterType === 'Sleeper') {
        return bType.includes('sleeper');
      }
      if (filterType === 'Bus Track') {
        return amenities.some((a) => a.includes('track') || a.includes('gps')) || bus.isRealTime;
      }
      if (filterType === 'New Buses') {
        return (parseFloat(bus.rating) || 0) >= 4.2;
      }
      if (filterType === 'Offers') {
        return (bus.price && bus.price <= 950) || (parseFloat(bus.rating) || 0) >= 4.4;
      }
      return true;
    });
  });

  const fetchBuses = () => {
    setLoading(true);
    setError(null);

    searchBuses({
      source: fromCity,
      destination: toCity,
      date: travelDate
    })
      .then((data) => {
        setBuses(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "We couldn't complete the search. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBuses();
    getRealRouteData(fromCity, toCity).then((info) => {
      if (info) setRouteInfo(info);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCity, toCity, travelDate]);

  const handleSlotClick = (bus, slot) => {
    navigate('/select-seats', {
      state: {
        ...state,
        from: fromCity,
        to: toCity,
        date: travelDate,
        route: travelRoute,
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
          <span className={styles.dateText}>
            Date: {travelDate} {ampmFilter ? `(${ampmFilter} Filter)` : ''}
          </span>
          {routeInfo && (
            <span className={styles.realtimeTelemetryBadge}>
              <span className={styles.pulsingGreenDot}></span>
              Live Highway Data: {routeInfo.distanceKm} km · ~{routeInfo.durationFormatted} transit
            </span>
          )}
        </div>
        <button className={styles.modifyBtn} onClick={() => navigate('/seatbooking')}>
          Modify Search
        </button>
      </div>

      {/* Interactive Bus Type Filters Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>
          <span className={styles.filterTitle}>🏷️ Bus Type:</span>
          <div className={styles.filterChips}>
            {FILTER_OPTIONS.map((type) => {
              const isActive = activeTypeFilters.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ''}`}
                  onClick={() => toggleTypeFilter(type)}
                >
                  {type} {isActive ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </div>
        {activeTypeFilters.length > 0 && (
          <button className={styles.clearFilterBtn} onClick={clearFilters}>
            ✕ Clear Filters ({activeTypeFilters.length})
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingCard}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Searching available buses...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className={styles.errorCard}>
          <h2 className={styles.errorTitle}>Search Failed</h2>
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={fetchBuses}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty State (No buses from search) */}
      {!loading && !error && buses.length === 0 && (
        <div className={styles.emptyStateCard}>
          <div className={styles.emptyIcon}>🚌</div>
          <h2 className={styles.emptyTitle}>No buses found</h2>
          <p className={styles.emptyText}>
            We couldn't find a bus for <strong>{fromCity} → {toCity}</strong> on {travelDate}.
          </p>
          <p className={styles.emptySubtext}>Try selecting another travel date or searching a different route.</p>
          <button className={styles.modifyBtnPrimary} onClick={() => navigate('/seatbooking')}>
            Modify Search
          </button>
        </div>
      )}

      {/* Success State - Buses List */}
      {!loading && !error && buses.length > 0 && (
        <>
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

          {/* Filtered Out State */}
          {filteredBuses.length === 0 ? (
            <div className={styles.emptyStateCard}>
              <div className={styles.emptyIcon}>🔍</div>
              <h2 className={styles.emptyTitle}>No Buses Match Filters</h2>
              <p className={styles.emptyText}>
                No buses match active filters: <strong>{activeTypeFilters.join(', ')}</strong>
              </p>
              <button className={styles.modifyBtnPrimary} onClick={clearFilters}>
                Clear Filters &amp; View All Buses ({buses.length})
              </button>
            </div>
          ) : (
            /* Bus Cards List */
            <div className={styles.busGrid}>
              {filteredBuses.map((bus) => {
              const displaySlots = ampmFilter
                ? bus.slots.filter((slot) => slot.time.includes(ampmFilter))
                : bus.slots;

              return (
                <div key={bus.id} className={styles.busCard}>
                  {/* Left Column: Operator details & ratings */}
                  <div className={styles.busInfo}>
                    <div className={styles.titleRow}>
                      <h3>{bus.operator} - {bus.busName}</h3>
                      <span className={styles.ratingBadge}>{bus.rating}</span>
                    </div>
                    <div className={styles.busSubRow}>
                      <span className={styles.busTypeTag}>{bus.busType}</span>
                      <span className={styles.busRegNo}>Bus Reg: <strong>{bus.id}</strong></span>
                    </div>
                    <div className={styles.amenitiesRow}>
                      {bus.amenities.map((item, idx) => (
                        <span key={idx} className={styles.amenityTag}>{item}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#444' }}>
                      <strong>Duration:</strong> {bus.duration} | <strong>Fare:</strong> ₹{bus.price} | <strong>Seats:</strong> {bus.availableSeats} available
                    </div>
                  </div>

                  {/* Right Column: Time Slot Bubbles */}
                  <div className={styles.slotsWrapper}>
                    <div className={styles.timeSlotsHeader}>
                      Select Departure Time Slot {ampmFilter ? `(${ampmFilter})` : ''}
                    </div>
                    <div className={styles.timeSlots}>
                      {displaySlots && displaySlots.length > 0 ? (
                        displaySlots.map((slot, i) => (
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
                    
                    {displaySlots && displaySlots.length > 0 && (
                      <div className={styles.cancellationWrapper}>
                        <span className={styles.cancellationNote}>Free Cancellation available up to 4 hrs before departure</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    )}
  </div>
);
};

export default AvailableBuses;
