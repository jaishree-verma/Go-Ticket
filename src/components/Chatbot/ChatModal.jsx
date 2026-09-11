import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { processAgentMessage } from '../../services/travelAgent';
import { useAuth } from '../../context/AuthContext';
import './Chatbot.css';

export default function ChatModal({ onClose, onMinimize }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentState, setAgentState] = useState({ state: 'IDLE', params: {} });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'tixie',
      text: `Hi ${user?.fullName ? user.fullName.split(' ')[0] : 'there'}! I am Tixie, your AI Travel Agent! How can I assist your travel plans today? ✨`,
      chips: [
        'Find buses from Kanpur to Delhi tomorrow',
        'Find buses from Kanpur to Delhi around 9 PM',
        'Search Kanpur to Lucknow',
        'Live Track Bus 📍'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    // Add user query message
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    // Static handlers for existing non-search shortcuts
    const qLower = query.toLowerCase();

    if (qLower.includes('contact') || qLower.includes('direct') || qLower.includes('call')) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: '📞 Contact Me For Direct Booking! Connect directly with our 24/7 travel desk (+91 1800-123-4567) for VIP seat allocation and group discounts.',
          actionCard: {
            title: '24/7 Direct Travel Desk',
            btnText: 'Call Booking Agent (+91 1800-123-4567)',
            onAction: () => {
              onClose();
              navigate('/contact');
            }
          },
          chips: ['Find buses from Kanpur to Delhi tomorrow', 'Search Kanpur to Lucknow']
        }
      ]);
      return;
    }

    if (qLower.includes('track') || qLower.includes('where is')) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: 'Please share your Bus ID or Ticket Number, and I will track your live vehicle location right away! 🚌📍',
          chips: ['GT-1048', 'UP-78-EX-2026', 'Find buses from Kanpur to Delhi tomorrow']
        }
      ]);
      return;
    }

    // Only intercept 'ticket' keyword if not in an active booking/collection flow
    const activeBookingStates = [
      'COLLECTING_PASSENGER_INFO', 'BOOKING_SUMMARY', 'BOOKING', 'CONFIRMED'
    ];
    const isInBookingFlow = activeBookingStates.includes(agentState.state);

    if (!isInBookingFlow && (qLower.includes('ticket') || qLower.includes('eticket'))) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'tixie',
          text: 'Manage and download your official E-Ticket PDF instantly using your mobile number or Ticket ID.',
          actionCard: {
            title: 'E-Ticket Portal',
            btnText: 'View & Download E-Ticket',
            onAction: () => {
              onClose();
              navigate('/eticket');
            }
          },
          chips: ['Find buses from Kanpur to Delhi tomorrow', 'Contact Me for Direct Booking 📞']
        }
      ]);
      return;
    }

    // PROCESS QUERY WITH GO TICKET TRAVEL AGENT
    try {
      const response = await processAgentMessage(query, agentState);
      setAgentState(response.agentState);

      const botMsg = {
        id: Date.now() + 1,
        sender: 'tixie',
        text: response.text,
        statusTrace: response.statusTrace || [],
        chips: response.chips || [],
        actionCard: response.actionCard
          ? {
              title: response.actionCard.title,
              btnText: response.actionCard.btnText,
              onAction: () => {
                if (response.actionCard.chatQuery) {
                  handleSend(response.actionCard.chatQuery);
                } else if (response.actionCard.navigateTo) {
                  onClose();
                  navigate(response.actionCard.navigateTo, {
                    state: response.actionCard.state
                  });
                } else if (response.actionCard.routeState) {
                  onClose();
                  const targetRoute = response.actionCard.routeState?.selectedSeats?.length > 0
                    ? '/select-seats'
                    : '/available-buses';
                  navigate(targetRoute, {
                    state: response.actionCard.routeState
                  });
                } else if (typeof response.actionCard.onAction === 'function') {
                  response.actionCard.onAction();
                }
              }
            }
          : null
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'tixie',
          text: 'We couldn\'t complete the search. Please try again.',
          chips: ['Find buses from Kanpur to Delhi tomorrow']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="chat-modal">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-bot-info">
          <span className="chat-avatar">👩‍💼</span>
          <div>
            <span className="chat-title">Tixie - AI Travel Agent</span>
            <span className="chat-online-badge">● Online 24/7 Agent</span>
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

      <div className="chat-subtext">🌸 AI Travel Agent — Search, Select, Book &amp; Get Your Ticket</div>

      {/* Direct Booking Callout Banner */}
      <div className="chat-direct-banner" onClick={() => handleSend('Contact Me for Direct Booking 📞')}>
        <span>📞 <strong>Contact me for direct booking</strong></span>
        <small>Connect with travel concierge desk</small>
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
            {/* Status execution trace if present */}
            {m.statusTrace && m.statusTrace.length > 0 && (
              <div className="chat-status-trace">
                <span>⚙️ Agent status:</span>
                <span>{m.statusTrace[m.statusTrace.length - 1]}</span>
              </div>
            )}

            <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>

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

        {/* Loading Indicator */}
        {loading && (
          <div className="chat-msg chat-msg-tixie">
            <div className="chat-status-trace">
              <span>⚙️ Tixie agent is working...</span>
            </div>
            <div>Thinking and processing your request...</div>
          </div>
        )}

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
          placeholder="Ask Tixie (e.g. Find buses from Kanpur to Delhi tomorrow)..."
          className="chat-input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="chat-send-btn" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
