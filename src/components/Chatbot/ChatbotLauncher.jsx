// import React, { useState } from 'react';
// import ChatModal from './ChatModal';
// import './Chatbot.css';
// import girlIcon from './assets/chatbot-girl.png';

// export default function ChatbotLauncher() {
//   const [open, setOpen] = useState(false);
//   const [minimized, setMinimized] = useState(false);

//   const handleOpen = () => {
//     setOpen(true);
//     setMinimized(false);
//   };

//   return (
//     <>
//       <div id="chat-launcher" onClick={handleOpen}>
//         <div className="chat-icon-wrapper">
//           <img src={girlIcon} alt="Chatbot Girl" className="wave" />
//           <div className="chat-tooltip">For bookings, talk to me directly!</div>
//         </div>
//         {/* <div className="chat-text">Hey! Let's have a chat for direct booking</div> */}
//       </div>

//       {open && !minimized && (
//         <ChatModal
//           onClose={() => setOpen(false)}
//           onMinimize={() => setMinimized(true)}
//         />
//       )}
//     </>
//   );
// }
import React, { useState } from 'react';
import ChatModal from './ChatModal';
import './Chatbot.css';
import girlIcon from './assets/chatbot-girl.png';

export default function ChatbotLauncher() {
  const [chatOpen, setChatOpen] = useState(false);

  const handleOpenChat = () => setChatOpen(true);
  const handleCloseChat = () => setChatOpen(false);

  return (
    <>
      {/* ✅ Always-visible waving girl — now clickable */}
      <div id="chat-launcher" onClick={handleOpenChat}>
        <div className="chat-icon-wrapper">
          <img src={girlIcon} alt="Chatbot Girl" className="wave" />
          {/* ✅ Tooltip only when chat is closed */}
          {!chatOpen && (
            <div className="chat-tooltip">For bookings, talk to me directly!</div>
          )}
        </div>
      </div>

      {/* ✅ Blue bubble launcher — hidden when chat is open */}
      {!chatOpen && (
        <div className="chat-minimized-bubble" onClick={handleOpenChat} title="">
          –
        </div>
      )}

      {/* ✅ Chat modal appears when chatOpen is true */}
      {chatOpen && (
        <ChatModal
          onClose={handleCloseChat}
          onMinimize={handleCloseChat}
        />
      )}
    </>
  );
}
