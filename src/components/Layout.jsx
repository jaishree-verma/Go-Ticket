import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatbotLauncher from './Chatbot/ChatbotLauncher';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      <Header />
      <Outlet />
      {isLandingPage && <Footer />}
      <ChatbotLauncher />
    </>
  );
};

export default Layout;
