import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/toproutesdirectory.module.css';

// ── Tab 1: Top Bus Routes (from User Image 1) ───────────
const TOP_BUS_ROUTES = [
  'Delhi to Manali Bus', 'Hyderabad to Bangalore Bus', 'Bangalore to Hyderabad Bus', 'Bangalore to Chennai Bus',
  'Chennai to Bangalore Bus', 'Delhi to Dehradun Bus', 'Delhi to Jaipur Bus', 'Delhi to Rishikesh Bus',
  'Bangalore to Goa Bus', 'Bangalore to Tirupati Bus', 'Delhi to Haridwar Bus', 'Jaipur to Delhi Bus',
  'Bangalore to Pondicherry Bus', 'Chandigarh to Delhi Bus', 'Dehradun to Delhi Bus', 'Delhi to Chandigarh Bus',
  'Delhi to Lucknow Bus', 'Delhi to Shimla Bus', 'Kolkata to Siliguri Bus', 'Lucknow to Delhi Bus',
  'Pune to Bangalore Bus', 'Pune to Goa Bus', 'Pune to Mumbai Bus', 'Bangalore to Mumbai Bus',
  'Bangalore to Pune Bus', 'Bhopal to Indore Bus', 'Chandigarh to Manali Bus', 'Chennai to Coimbatore Bus',
  'Chennai to Pondicherry Bus', 'Coimbatore to Chennai Bus', 'Delhi to Nainital Bus', 'Delhi to Varanasi Bus',
  'Hyderabad to Tirupati Bus', 'Indore to Bhopal Bus', 'Kolkata to Digha Bus', 'Mumbai to Goa Bus',
  'Mumbai to Pune Bus', 'Nagpur to Pune Bus', 'Pune to Nagpur Bus', 'Bangalore to Ooty Bus',
  'Chennai to Madurai Bus', 'Coimbatore to Bangalore Bus', 'Delhi to Dharamshala Bus', 'Delhi to Khatushyamji Bus',
  'Delhi to Ujjain Bus', 'Hyderabad to Chennai Bus', 'Hyderabad to Goa Bus', 'Hyderabad to Mumbai Bus',
  'Hyderabad to Srisailam Bus', 'Hyderabad to Vijayawada Bus'
];

// ── Tab 2: Buses From Top Cities (from User Image 2) ─────
const BUSES_FROM_TOP_CITIES = [
  'Hyderabad Bus Tickets', 'Vijayawada Bus Tickets', 'Tirupathi Bus Tickets', 'Bangalore Bus Ticket',
  'Mangalore Bus Tickets', 'Bellary Bus Tickets', 'Chennai Bus Tickets', 'Madurai Bus Tickets',
  'Coimbatore Bus Tickets', 'Goa Bus Tickets', 'Mumbai Bus Tickets', 'Pune Bus Tickets',
  'Indore Bus Tickets', 'Bhopal Bus Tickets', 'Surat Bus Tickets', 'Ahmedabad Bus Tickets',
  'Rajkot Bus Tickets', 'Udaipur Bus Tickets', 'Jodhpur Bus Tickets', 'Jaipur Bus Tickets',
  'Gorakhpur Bus Tickets', 'Lucknow Bus Tickets', 'Chandigarh Bus Tickets', 'Manali Bus Tickets',
  'Shimla Bus Tickets'
];

// ── Tab 3: Top RTC Buses (from User Image 3) ─────────────
const TOP_RTC_BUSES = [
  'APSRTC', 'TGSRTC', 'KSRTC', 'GSRTC',
  'Kerala RTC', 'HRTC', 'RSRTC', 'OSRTC',
  'UPSRTC', 'BSRTC', 'PRTC', 'JKSRTC',
  'WBTC', 'KTCL', 'UTC', 'MTC',
  'SBSTC', 'SNT', 'ASTC'
];

// ── Tab 4: Top Bus Services (from User Image 4) ──────────
const TOP_BUS_SERVICES = [
  'Flixbus', 'Zingbus', 'Vrl Travels', 'A1 Travels',
  'Nuego', 'Rathimeena Travels', 'Srs Travels', 'Sugama Travels',
  'Gujarat Travels', 'Hans Travels', 'Intrcity Smartbus', 'Orange Tours And Travels',
  'Laxmi Holidays', 'Morning Star Travels', 'Chalo Bus', 'Jabbar Travels',
  'Jakhar Travels', 'National Travels', 'Neeta Travels', 'Patel Tours Travels',
  'Royal Travels', 'Kallada Travels', 'Ybm Travels', 'Ganesh Travels',
  'Kaveri Travels', 'Seabird Travels', 'Sharma Transports', 'Shyamoli Paribahan',
  'Dolphin Travel House', 'Dolphin Travels', 'Greenline Travels', 'Humsafar Travels',
  'Mrm Travels', 'Verma Travels', 'Vkv Travels', 'Yadav Bus Services',
  'Fresh Bus'
];

// ── Tab 5: Quick Links ──────────────────────────────────
const QUICK_LINKS = [
  'All RTC Buses', 'Top Bus Routes', 'Bus Booking Online', 'Bus Timings & Schedule',
  'Live Bus Tracking', 'Train Ticket Booking', 'Cab Booking Online', 'Offers & Discount Coupons',
  'Cancellation & Refund Policy', 'Passenger Help & Support'
];

const TABS = [
  { id: 'routes',   label: 'Top Bus Routes' },
  { id: 'cities',   label: 'Buses From Top Cities' },
  { id: 'rtc',      label: 'Top RTC Buses' },
  { id: 'services', label: 'Top Bus Services' },
  { id: 'quick',    label: 'Quick Links' },
];

const TopRoutesDirectory = () => {
  const [activeTab, setActiveTab] = useState('routes');
  const navigate = useNavigate();

  const handleLinkClick = (item) => {
    // If it's a route e.g. "Delhi to Manali Bus"
    if (activeTab === 'routes' && item.includes(' to ')) {
      const parts = item.replace(/ Bus$/i, '').split(' to ');
      if (parts.length === 2) {
        navigate('/available-buses', {
          state: {
            from: parts[0].trim(),
            to: parts[1].trim(),
            date: new Date().toISOString().split('T')[0],
            route: `${parts[0].trim()} → ${parts[1].trim()}`,
          }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // If it's a city e.g. "Hyderabad Bus Tickets"
    if (activeTab === 'cities') {
      const city = item.replace(/ Bus Ticket(s)?$/i, '').trim();
      navigate('/seatbooking', { state: { from: city } });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If it's RTC or Private Operator
    if (activeTab === 'rtc' || activeTab === 'services') {
      navigate('/available-buses', {
        state: {
          from: 'Delhi',
          to: 'Lucknow',
          date: new Date().toISOString().split('T')[0],
          operatorFilter: item
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (item === 'Live Bus Tracking') {
      navigate('/livetracking');
    } else {
      navigate('/seatbooking');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveItems = () => {
    switch (activeTab) {
      case 'routes':   return TOP_BUS_ROUTES;
      case 'cities':   return BUSES_FROM_TOP_CITIES;
      case 'rtc':      return TOP_RTC_BUSES;
      case 'services': return TOP_BUS_SERVICES;
      case 'quick':    return QUICK_LINKS;
      default:         return TOP_BUS_ROUTES;
    }
  };

  return (
    <section className={styles.directoryContainer} aria-label="Bus Routes Directory">
      <div className={styles.directoryInner}>
        {/* Navigation Tabs */}
        <div className={styles.tabsBar}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Links Grid */}
        <div className={styles.linksGrid}>
          {getActiveItems().map((item, idx) => (
            <button
              key={`${activeTab}-${idx}`}
              className={styles.directoryLink}
              onClick={() => handleLinkClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRoutesDirectory;
