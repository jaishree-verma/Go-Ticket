
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';

// // Homepage sections (only for landing page)
// import Hero from './components/Hero';
// import About from './components/About';
// // import Features from './components/Features';
// import Booking from './components/BookingSection';
// import TrackBus from './components/TrackBus';
// import FAQ from './components/FAQ';

// // Static pages
// import Home from './pages/aboutgoticket/Home';
// import ETicket from './pages/aboutgoticket/ETicket';
// import SeatBooking from './pages/aboutgoticket/SeatBooking';
// import LiveTracking from './pages/aboutgoticket/LiveTracking';
// import ContactUs from './pages/aboutgoticket/ContactUs';
// import Info from './components/Info';


// // Auth pages
// import Login from './pages/auth/Login';
// import Signup from './pages/auth/Signup';

// // Dedicated booking page
// import BookingPage from './components/BookingSection';


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route element={<Layout />}>
//           {/* Landing page only */}
//           <Route
//             index
//             element={
//               <>
//                 <Hero />
//                 <About />
               
//                 <Booking />
//                 <TrackBus />
//                 <FAQ />
//               </>
//             }
//           />

//           {/* Routed pages */}
//           <Route path="home" element={<Home />} />
//           <Route path="booking" element={<BookingPage />} />
//           <Route path="eticket" element={<ETicket />} />
//           <Route path="seatbooking" element={<SeatBooking />} />
//           <Route path="livetracking" element={<LiveTracking />} />
//           <Route path="contact" element={<ContactUs />} />
//           <Route path="networking" element={<Info />} />

//           {/* Auth */}
//           <Route path="login" element={<Login />} />
//           <Route path="signup" element={<Signup />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Hero from './components/Hero';
import OffersSection from './components/OffersSection';
import About from './components/About';
import Booking from './components/BookingSection';
import TrackBus from './components/TrackBus';
import TestimonialsSection from './components/TestimonialsSection';
import FAQ from './components/FAQ';

import Home from './pages/aboutgoticket/Home';
import ETicket from './pages/aboutgoticket/ETicket';
import SeatBooking from './pages/aboutgoticket/SeatBooking';
import SelectSeats from './pages/aboutgoticket/SelectSeats';
import LiveTracking from './pages/aboutgoticket/LiveTracking';
import ContactUs from './pages/aboutgoticket/ContactUs';
import AvailableBuses from './pages/aboutgoticket/AvailableBuses';
import Info from './components/Info';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

import BookingPage from './components/BookingSection';
import DropPage from './pages/aboutgoticket/DropPage';
import PaymentPage from './pages/aboutgoticket/PaymentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <>
                <Hero />
                <OffersSection />
                <About />
                <Booking />
                <TrackBus />
                <TestimonialsSection />
                <FAQ />
              </>
            }
          />
          <Route path="home" element={<Home />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="eticket" element={<ETicket />} />
          <Route path="seatbooking" element={<SeatBooking />} />
          <Route path="select-seats" element={<SelectSeats />} />
          <Route path="drop" element={<DropPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="livetracking" element={<LiveTracking />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="networking" element={<Info />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="available-buses" element={<AvailableBuses />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
