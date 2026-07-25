import React, { useState } from 'react';
import ChatModal from './ChatModal';
import './Chatbot.css';

export default function ChatbotLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Minimized Float Indicator */}
      {isMinimized && (
        <div
          className="chat-minimized-bubble"
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
          }}
          title="Open Tixie Assistant"
        >
          👩‍💼
        </div>
      )}

      {/* Floating Launcher with Premium Teal & White Female Agent Avatar */}
      {!isOpen && !isMinimized && (
        <div
          id="chat-launcher"
          onClick={() => setIsOpen(true)}
          role="button"
          tabIndex={0}
        >
          <div className="chat-icon-wrapper">
            {/* Teal & White Persistent Callout Badge */}
            <div className="chat-tooltip persistent-tooltip">
              Hey! Contact me for direct booking 💬
            </div>

            <div className="lady-avatar-teal">
              {/* Premium Female Assistant Icon */}
              <span className="lady-emoji">👩‍💼</span>
              <span className="headset-icon-teal">🎧</span>
              <span className="agent-status-dot"></span>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <ChatModal
          onClose={() => setIsOpen(false)}
          onMinimize={() => {
            setIsOpen(false);
            setIsMinimized(true);
          }}
        />
      )}
    </>
  );
}
