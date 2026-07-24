
// import React, { useEffect } from 'react';
// import './Chatbot.css';

// export default function ChatModal({ onClose }) {
//   useEffect(() => {
//     if (!window.WebChat) return;

//     const existing = document.querySelector('#rasa-webchat .rw-conversation-container');
//     if (existing) existing.remove();

//     window.WebChat.default(
//       {
//         initPayload: '/get_started',
//         customData: { language: 'en' },
//         socketUrl: 'http://localhost:5005', // Replace with your RASA server
//         title: 'GoBot',
//         subtitle: 'Your travel assistant',
//         profileAvatar: '/assets/chatbot-girl.png',
//         showCloseButton: false,
//         embedded: true,
//         container: document.querySelector('#rasa-webchat'),
//       },
//       null
//     );
//   }, []);

//   return (
//     <div id="chat-modal">
//       <div className="chat-header">
//         Ask Tixie
//         <button className="chat-close" onClick={onClose}>
//           <input
//           type="textbox"
//           placeholder="book directly from here"
//           className="chat"
//           disabled
//         />
//         </button>
//       </div>

//       <div className="chat-body">
//         <div id="rasa-webchat" />
//       </div>

//       {/* ✅ Custom input bar below chat-body */}
//       <div className="chat-input-bar">
//         {/* <span className="icon-left">🔍</span> */}
//         <input
//           type="text"
//           placeholder="🔍 Type here... "
//           className="chat-input"
//           disabled
//         />
//         {/* <span className="icon-right">🎤</span> */}
//       </div>
//     </div>
//   );
// }
import React, { useEffect } from 'react';
import './Chatbot.css';

export default function ChatModal({ onClose, onMinimize }) {
  useEffect(() => {
    if (!window.WebChat) return;

    const existing = document.querySelector('#rasa-webchat .rw-conversation-container');
    if (existing) existing.remove();

    window.WebChat.default(
      {
        initPayload: '/get_started',
        customData: { language: 'en' },
        socketUrl: 'http://localhost:5005',
        title: 'GoBot',
        subtitle: 'Your travel assistant',
        profileAvatar: '/assets/chatbot-girl.png',
        showCloseButton: false,
        embedded: true,
        container: document.querySelector('#rasa-webchat'),
      },
      null
    );
  }, []);

  return (
    <div id="chat-modal">
      <div className="chat-header">
        AskTixie...
        <div className="chat-controls">
          <button className="chat-minimize" onClick={onMinimize}></button>
          <button className="chat-close" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="chat-subtext"> Book directly from here</div>

      <div className="chat-body">
        <div id="rasa-webchat" />
      </div>

      <div className="chat-input-bar">
        {/* <span className="icon-left">🔍</span> */}
        <input
          type="text"
          placeholder="🔍 Type here..."
          className="chat-input"
        />
        
        {/* <span className="icon-right">🎤</span> */}
      </div>
    </div>
  );
}
