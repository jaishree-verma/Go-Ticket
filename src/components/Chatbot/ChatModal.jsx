import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

export default function ChatModal({ onClose, onMinimize }) {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');
  const [awaitingBusId, setAwaitingBusId] = useState(false);
  const [bookingStep, setBookingStep] = useState(0); // 0: None, 1: Passengers, 2: Cities, 3: Date/Time, 4: Payment
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    from: '',
    to: '',
    date: '',
    time: '',
    paymentMethod: ''
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'tixie',
      text: 'Hi there! I am Tixie, your personal travel coordinator! How can I help you today? ✨',
      chips: [
        'Contact Me for Direct Booking 📞',
        'Book a Ticket Step-by-Step 🎟️',
        'Search Buses 🚌',
        'Live Track Bus 📍',
        'Generate E-Ticket 📄'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    // Add user query message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Process intent
    setTimeout(() => {
      processBotIntent(query);
    }, 400);
  };

  const processBotIntent = (rawQuery) => {
    const q = rawQuery.toLowerCase();

    // INTERACTIVE MULTI-STEP BOOKING FLOW
    if (bookingStep === 1) { // Got Passengers -> Ask Departure & Drop Cities
      const count = parseInt(rawQuery.replace(/\D/g, '')) || 1;
      setBookingData((prev) => ({ ...prev, passengers: count }));
      setBookingStep(2);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: `Wonderful! ${count} passenger(s) set. 🎟️\n\nWhere are you traveling from and where do you want to be dropped off? (e.g. Kanpur to Lucknow, Delhi to Agra)`,
          chips: ['Kanpur to Lucknow', 'Delhi to Agra', 'Mumbai to Pune', 'Jaipur to Delhi']
        }
      ]);
      return;
    }

    if (bookingStep === 2) { // Got Cities -> Ask Date & Time
      const cities = rawQuery.split(/to|->|→|-/i);
      const fromCity = (cities[0] || 'Kanpur').trim();
      const toCity = (cities[1] || 'Lucknow').trim();
      setBookingData((prev) => ({ ...prev, from: fromCity, to: toCity }));
      setBookingStep(3);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: `Got it! Route selected: ${fromCity} ➔ ${toCity} 🚌\n\nWhat is your preferred Departure Date & Time? (e.g. Tomorrow 08:00 AM, 26th July 09:30 PM)`,
          chips: ['Tomorrow 08:00 AM', 'Tomorrow 02:00 PM', 'Today 09:00 PM']
        }
      ]);
      return;
    }

    if (bookingStep === 3) { // Got Date/Time -> Ask Payment Method
      setBookingData((prev) => ({ ...prev, date: rawQuery }));
      setBookingStep(4);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: `Schedule confirmed for ${rawQuery} 📅\n\nWhich Payment Method would you prefer to complete your booking?`,
          chips: ['UPI (GPay / PhonePe / Paytm)', 'Credit / Debit Card', 'Net Banking', 'Cash at Boarding']
        }
      ]);
      return;
    }

    if (bookingStep === 4) { // Completed All Information -> Summary & Proceed
      setBookingData((prev) => ({ ...prev, paymentMethod: rawQuery }));
      const finalFrom = bookingData.from || 'Kanpur';
      const finalTo = bookingData.to || 'Lucknow';
      const finalPass = bookingData.passengers || 1;
      const finalDate = bookingData.date || 'Tomorrow';

      setBookingStep(0);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: `🎉 Booking Details Saved Successfully!\n\n📋 Trip Summary:\n• Passengers: ${finalPass}\n• Route: ${finalFrom} ➔ ${finalTo}\n• Departure: ${finalDate}\n• Payment: ${rawQuery}\n\nClick below to select your seats and finalize payment!`,
          actionCard: {
            title: `Proceed to Seat Selection (${finalPass} Passenger)`,
            btnText: 'Open Seat Map & Complete Booking',
            onAction: () => {
              onClose();
              navigate('/available-buses', {
                state: {
                  from: finalFrom,
                  to: finalTo,
                  date: new Date().toISOString().split('T')[0],
                  passengers: finalPass,
                  route: `${finalFrom} → ${finalTo}`
                }
              });
            }
          },
          chips: ['Contact Me for Direct Booking 📞', 'Search More Buses 🚌']
        }
      ]);
      return;
    }

    // IF BOT IS AWAITING BUS ID FOR TRACKING
    if (awaitingBusId && !q.includes('track') && !q.includes('contact') && !q.includes('search')) {
      setAwaitingBusId(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: `🔍 Fetching live GPS location for Bus ID "${rawQuery.toUpperCase()}"...\n\nYour bus is currently near Expressway Toll, traveling at 65 km/h on schedule. Estimated arrival: 45 minutes.`,
          actionCard: {
            title: `Live Tracking for ${rawQuery.toUpperCase()}`,
            btnText: 'View On Interactive Live Map',
            onAction: () => {
              onClose();
              navigate('/livetracking');
            }
          },
          chips: ['Contact Me for Direct Booking 📞', 'Search Buses 🚌']
        }
      ]);
      return;
    }

    // START BOOKING CONVERSATION FLOW
    if (q.includes('book') || q.includes('seat') || q.includes('reservation') || q.includes('passenger')) {
      setAwaitingBusId(false);
      setBookingStep(1);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: 'I can assist you with instant seat reservations! 🎟️\n\nFirst, how many passengers will be traveling?',
          chips: ['1 Passenger', '2 Passengers', '3 Passengers', '4+ Passengers']
        }
      ]);
      return;
    }

    // DIRECT BOOKING / CONTACT ME INTENT
    if (q.includes('contact') || q.includes('direct') || q.includes('call') || q.includes('agent') || q.includes('help')) {
      setAwaitingBusId(false);
      setBookingStep(0);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: '📞 Contact Me For Direct Booking! I can connect you directly with our 24/7 travel desk for VIP seat allocation, sleeper cabins, and exclusive group discounts.',
          actionCard: {
            title: '24/7 Direct Travel Desk',
            btnText: 'Call Booking Agent (+91 1800-123-4567)',
            onAction: () => {
              onClose();
              navigate('/contact');
            }
          },
          chips: ['Book a Ticket Step-by-Step 🎟️', 'Search Buses 🚌', 'Live Track Bus 📍']
        }
      ]);
      return;
    }

    // SEARCH BUSES
    if (q.includes('search') || q.includes('route') || q.includes('bus list')) {
      setAwaitingBusId(false);
      setBookingStep(0);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: 'I can help you search for available buses across Delhi, Jaipur, Agra, Kanpur, Chandigarh, and Gurgaon.',
          actionCard: {
            title: 'Explore Available Routes & Buses',
            btnText: 'View Available Buses Now',
            onAction: () => {
              onClose();
              navigate('/home');
            }
          },
          chips: ['Book a Ticket Step-by-Step 🎟️', 'Contact Me for Direct Booking 📞', 'Live Track Bus 📍']
        }
      ]);
      return;
    }

    // LIVE TRACK BUS INTENT
    if (q.includes('track') || q.includes('location') || q.includes('gps') || q.includes('where is')) {
      setAwaitingBusId(true);
      setBookingStep(0);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: 'Please share your Bus ID or Ticket Number, and I will track your live vehicle location right away! 🚌📍',
          chips: ['GT-1048', 'UP-78-EX-2026', 'DL-01-AB-1234']
        }
      ]);
      return;
    }

    // GENERATE E-TICKET
    if (q.includes('ticket') || q.includes('pdf') || q.includes('mail')) {
      setAwaitingBusId(false);
      setBookingStep(0);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: 'Manage and download your official E-Ticket PDF instantly using your mobile number or PNR.',
          actionCard: {
            title: 'E-Ticket Portal',
            btnText: 'View & Download E-Ticket',
            onAction: () => {
              onClose();
              navigate('/eticket');
            }
          },
          chips: ['Book a Ticket Step-by-Step 🎟️', 'Contact Me for Direct Booking 📞']
        }
      ]);
      return;
    }

    // DEFAULT FALLBACK
    setAwaitingBusId(false);
    setBookingStep(0);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'tixie',
        text: 'Hi there! I am Tixie. How can I assist your trip today? Feel free to ask about direct booking, routes, or live GPS tracking!',
        chips: [
          'Book a Ticket Step-by-Step 🎟️',
          'Contact Me for Direct Booking 📞',
          'Search Buses 🚌',
          'Live Track Bus 📍'
        ]
      }
    ]);
  };

  return (
    <div id="chat-modal">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-bot-info">
          <span className="chat-avatar">👩‍💼</span>
          <div>
            <span className="chat-title">Tixie - Travel Specialist</span>
            <span className="chat-online-badge">● Online 24/7 Support</span>
          </div>
        </div>
        <div className="chat-controls">
          <button className="chat-minimize" onClick={onMinimize} title="Minimize">
            –
          </button>
          <button className="chat-close" onClick={onClose} title="Close">
            ×
          </button>
        </div>
      </div>

      <div className="chat-subtext">🌸 Instant Booking & Live GPS Travel Assistant</div>

      {/* Direct Booking Callout Card */}
      <div className="chat-direct-banner" onClick={() => handleSend('Contact Me for Direct Booking 📞')}>
        <span>📞 <strong>Contact me for direct booking</strong></span>
        <small>Connect with female travel concierge desk</small>
      </div>

      {/* Message History */}
      <div className="chat-messages-container">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-msg ${
              m.sender === 'tixie' ? 'chat-msg-tixie' : 'chat-msg-user'
            }`}
          >
            <div style={{ whitespace: 'pre-line' }}>{m.text}</div>

            {/* Action Trigger Card */}
            {m.actionCard && (
              <div className="chat-action-card">
                <div className="chat-action-title">{m.actionCard.title}</div>
                <button
                  className="chat-action-btn"
                  onClick={m.actionCard.onAction}
                >
                  ⚡ {m.actionCard.btnText}
                </button>
              </div>
            )}

            {/* Interactive Chip Buttons */}
            {m.chips && (
              <div className="chat-chips-row">
                {m.chips.map((chip, idx) => (
                  <button
                    key={idx}
                    className="chat-chip-btn"
                    onClick={() => handleSend(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        className="chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          placeholder={
            bookingStep === 1
              ? "How many passengers? (e.g. 2)..."
              : bookingStep === 2
              ? "From and Drop city (e.g. Kanpur to Lucknow)..."
              : bookingStep === 3
              ? "Departure Date & Time (e.g. Tomorrow 8 AM)..."
              : bookingStep === 4
              ? "Payment Method (e.g. UPI, Card)..."
              : awaitingBusId
              ? "Enter Bus ID / Ticket No (e.g. GT-1048)..."
              : "Ask Tixie (e.g. direct booking, search bus)..."
          }
          className="chat-input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="chat-send-btn">
          Send
        </button>
      </form>
    </div>
  );
}
