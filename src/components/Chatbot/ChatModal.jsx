import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

export default function ChatModal({ onClose, onMinimize }) {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'tixie',
      text: 'Hi there! I am Tixie, your Go-Ticket assistant. How can I help you today?',
      chips: [
        'Search Buses',
        'Book Ticket',
        'Live Track Bus',
        'Generate E-Ticket & Email'
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

    // 1. Add user query message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // 2. Process Intent Engine
    setTimeout(() => {
      processBotIntent(query.toLowerCase());
    }, 400);
  };

  const processBotIntent = (q) => {
    // A. SEARCH BUSES
    if (q.includes('search') || q.includes('route') || q.includes('bus list')) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: 'I can help you search for available buses! We have active routes connecting Delhi, Jaipur, Agra, Kanpur, Chandigarh, and Gurgaon.',
          actionCard: {
            title: 'Explore Available Routes & Buses',
            btnText: 'View Available Buses Now',
            onAction: () => {
              onClose();
              navigate('/home');
            }
          },
          chips: ['Book Ticket', 'Live Track Bus', 'Generate E-Ticket']
        }
      ]);
      return;
    }

    // B. BOOK TICKET
    if (q.includes('book') || q.includes('seat') || q.includes('reservation')) {
      const userName = localStorage.getItem('userName');
      if (!userName) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: 'tixie',
            text: 'To complete your ticket booking, please sign in or create an account.',
            actionCard: {
              title: 'Authentication Required',
              btnText: 'Open Login / Booking Portal',
              onAction: () => {
                onClose();
                navigate('/seatbooking');
              }
            },
            chips: ['Search Buses', 'Live Track Bus']
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: 'tixie',
            text: `Welcome back, ${userName}! Ready to reserve your seats? Choose your route and cabin layout below.`,
            actionCard: {
              title: 'Interactive Seat Selection',
              btnText: 'Proceed to Seat Layout Map',
              onAction: () => {
                onClose();
                navigate('/seatbooking');
              }
            },
            chips: ['Live Track Bus', 'Generate E-Ticket']
          }
        ]);
      }
      return;
    }

    // C. LIVE TRACK BUS
    if (q.includes('track') || q.includes('location') || q.includes('gps') || q.includes('where is')) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: 'You can track any active bus live on OpenStreetMap with real-time GPS speed, ETA, and distance calculations! Try bus numbers UP-78-EX-2026 or DL-01-AB-1234.',
          actionCard: {
            title: 'Live GPS Bus Tracker',
            btnText: 'Open Live Bus Map',
            onAction: () => {
              onClose();
              navigate('/livetracking');
            }
          },
          chips: ['Search Buses', 'Generate E-Ticket & Email']
        }
      ]);
      return;
    }

    // D. GENERATE E-TICKET & SEND EMAIL / SMS
    if (q.includes('ticket') || q.includes('mail') || q.includes('pdf') || q.includes('sms') || q.includes('download')) {
      const lastTicket = localStorage.getItem('lastTicket');
      if (lastTicket) {
        try {
          const parsed = JSON.parse(lastTicket);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: 'tixie',
              text: `Found active ticket #${parsed.pnr || 'GT-987654'} for ${parsed.passengers?.[0]?.name || 'Passenger'}! I can dispatch it to your registered mobile/email and generate your printable PDF.`,
              actionCard: {
                title: 'E-Ticket & Dispatch Portal',
                btnText: 'Generate & Email E-Ticket',
                onAction: () => {
                  onClose();
                  navigate('/eticket');
                }
              },
              chips: ['Live Track Bus', 'Book Another Ticket']
            }
          ]);
          return;
        } catch (e) {}
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: 'You can verify your mobile number via OTP on our E-Ticket portal to retrieve, email, or print your PDF e-ticket instantly.',
          actionCard: {
            title: 'E-Ticket Lookup Portal',
            btnText: 'Open E-Ticket Verification',
            onAction: () => {
              onClose();
              navigate('/eticket');
            }
          },
          chips: ['Search Buses', 'Book Ticket']
        }
      ]);
      return;
    }

    // DEFAULT FALLBACK
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'tixie',
        text: 'I can assist you with searching available buses, interactive seat booking, live GPS tracking, and generating PDF e-tickets to your mobile/email.',
        chips: [
          'Search Buses',
          'Book Ticket',
          'Live Track Bus',
          'Generate E-Ticket & Email'
        ]
      }
    ]);
  };

  return (
    <div id="chat-modal">
      {/* Header */}
      <div className="chat-header">
        Ask Tixie...
        <div className="chat-controls">
          <button className="chat-minimize" onClick={onMinimize} title="Minimize">
            –
          </button>
          <button className="chat-close" onClick={onClose} title="Close">
            ×
          </button>
        </div>
      </div>

      <div className="chat-subtext">Book, Track, and Manage Tickets Directly Here</div>

      {/* Message History */}
      <div className="chat-messages-container">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-msg ${
              m.sender === 'tixie' ? 'chat-msg-tixie' : 'chat-msg-user'
            }`}
          >
            <div>{m.text}</div>

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
          placeholder="Ask Tixie (e.g. search bus, book ticket, live track)..."
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
