
# GoTicket — AI-Agent-Based Intercity Bus Booking Platform

> An autonomous conversational AI travel concierge alongside an end-to-end manual bus reservation and live tracking web platform.

## 🌟 Key Highlights & Features

### 1. 🤖 Tixie — Autonomous Conversational AI Travel Agent
* **Natural Language Route Search:** Recognizes 22+ Indian cities, relative dates (*"tomorrow"*, *"next Friday"*, *"day after tomorrow"*), and departure preferences (*"evening"*, *"around 9 PM"*, *"cheapest"*, *"fastest"*).
* **Deterministic Multi-Criteria Ranking:** Ranks search results using a 5-factor scoring engine (Time fit: 30%, Price: 25%, Duration: 20%, Availability: 15%, Operator rating: 10%).
* **Atomic Seat Selection & Validation:** Validates seat requests against occupied seat maps (rejects conflicts like `S7` atomically without partial state corruption).
* **Flexible Passenger Extraction:** Extracts passenger name, email, and 10-digit mobile number from a single sentence or step-by-step.
* **Transparent Booking Summary:** Displays an itemized overview of bus, operator, date, departure time, seat numbers, masked contact info, discounts, and total payable amount.
* **Strict Explicit Confirmation Gate:** **Tixie NEVER finalizes a booking until the user explicitly approves the final booking summary** (e.g., *"Yes, confirm"*, *"Confirm booking"*, *"Book it"*). Non-committal phrases (*"maybe"*, *"what is the bus type?"*) and inline modifications (*"change seat to S5"*, *"change email"*) preserve conversational state without committing.
* **In-Flight Duplicate Guard:** Prevents rapid double-clicks or multiple simultaneous confirmation submissions from creating duplicate tickets.

### 2. 💺 End-to-End Manual Booking Workflow
* **Hero Search Widget:** Source and destination city selectors with date pickers and auto-suggestions for 50+ Indian corridors.
* **Available Buses Listing:** Filter and sort by operator, price, time slot, and bus type (AC Sleeper, Volvo Multi-Axle, AC Seater).
* **Interactive Seat Map:** Visual 40-seat bus layout (2 Left + Aisle + 2 Right) with occupied seat locks and live pricing.
* **Boarding & Dropping Points:** Select pickup and drop locations along the travel corridor.
* **Checkout & Simulated Payment:** Net Banking, UPI, and Card options with simulated 6-digit mobile OTP verification and coupon discounting (`FIRSTGO`, `GTWEEKEND`, `UPIPAY`).
* **Digital E-Ticket Generation:** Instant pass with QR verification code, ticket reference ID (`GTXXXXXX`), passenger details, and print/download capabilities.

### 3. 📡 Live Bus Telemetry & Tracking
* Visual OpenStreetMap embed with waypoint interpolation, simulated vehicle speed, driver details, and browser Geolocation distance calculation via the **Haversine formula**.

---

## 🏗️ Architecture & State Machine

### Conversational State Machine (`travelAgent.js`)

```text
[IDLE]
  │ (User: "Find buses from Kanpur to Delhi tomorrow evening")
  ▼
[WAITING_FOR_BUS_SELECTION]
  │ (User: "I want the second one" / "Select SwiftLine")
  ▼
[WAITING_FOR_SEAT_SELECTION]
  │ (Atomic seat validation: checks availability, rejects conflicts)
  │ (User: "Book S3 and S4")
  ▼
[COLLECTING_PASSENGER_INFO]
  │ (Extracts: Name, Email, 10-digit Phone)
  │ (User: "Name is Anshika, email anshika@example.com, mobile 9876543210")
  ▼
[BOOKING_SUMMARY] ◄─── (Modifications: "Change seat to S5", "Change email")
  │
  ├──────────────────────────────┬──────────────────────────────┐
  │ (Explicit Confirmation)      │ (Cancellation)               │ (Inquiry / "Maybe")
  ▼                              ▼                              ▼
[PAYMENT_PENDING]             [CANCELLED / IDLE]          [BOOKING_SUMMARY]
  │                              │                              │
  • Prepares pendingBooking      • Clears pending state         • Prompts for explicit
  • Hands off to /payment        • No booking created             confirmation
  • Finalizes ticket on checkout
```

### Clean Service Layer Architecture

| Service File | Primary Responsibility |
| :--- | :--- |
| `src/services/travelAgent.js` | Conversational NLU orchestrator, state transitions, confirmation gate |
| `src/services/recommendationEngine.js` | Deterministic 5-factor scoring algorithm for ranking search results |
| `src/services/agentTools.js` | Standard tool interface (`search_buses`, `get_bus_details`, `check_seat_availability`, `hold_select_seats`, `prepare_booking`) |
| `src/services/busService.js` | Route query filter and transport search abstraction with mock latency |
| `src/services/seatService.js` | Single source of truth for seat grids and atomic availability validation |
| `src/services/bookingService.js` | Ticket creation, ID generation (`GTXXXXXX`), and `localStorage` persistence |
| `src/services/authService.js` | Session state, demo login verification, and profile management |
| `src/services/notificationService.js` | Simulated email & SMS notification formatting and dispatch logging |

---

## 💡 Demo Mode & Simulation Disclosures

To run self-contained in any environment without requiring external credentials or paid APIs:
* **Authentication:** Use demo credentials `demo@goticket.in` / `demo123` or register a local profile.
* **Payment Gateway:** Simulated payment processor with instant approval or demo OTP (`123456`).
* **Notifications:** Simulated email and SMS generation with console logging and masked recipient display.
* **GPS Bus Tracking:** Simulated real-time route checkpoints and telemetry on OpenStreetMap.
* **Backend Persistence:** Active client-side architecture using browser `localStorage`.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18.0 or higher recommended)
* npm (v9.0 or higher)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jaishree-verma/Go-Ticket.git
   cd Go-Ticket
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build production bundle:**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
Go-Ticket/
├── docs/                     # Academic & technical documentation suite
│   ├── PROJECT_REPORT.md     # Master project report
│   ├── TECHNICAL_DOCUMENTATION.md # Service layer & developer guide
│   ├── ARCHITECTURE.md       # Architectural diagrams & flows
│   ├── VIVA_QUESTIONS.md     # Viva exam questions & answers
│   ├── DEMO_SCRIPT.md        # Presentation & demo script
│   └── TEAM_CONTRIBUTION.md  # 4-member workload matrix
├── public/
│   ├── images/               # Fleet images, bus banners, payment badges
│   └── index.html            # HTML template
├── src/
│   ├── components/           # Reusable UI & section components
│   │   ├── AuthModal.jsx     # Login & Signup modal dialog
│   │   ├── BookingSection.jsx# 4-step booking guide card section
│   │   ├── Chatbot/          # Tixie conversational AI chat interface
│   │   ├── Header.jsx        # Navigation bar with auth status
│   │   ├── Hero.jsx          # Promotional search banner & city auto-complete
│   │   ├── OffersSection.jsx # Discount vouchers & coupon modal
│   │   └── TrackBus.jsx      # Live GPS tracking promotion card
│   ├── data/
│   │   └── mockBuses.js      # Intercity transport dataset (Kanpur, Delhi, Lucknow, etc.)
│   ├── pages/
│   │   ├── aboutgoticket/    # Core routed views (AvailableBuses, SelectSeats, DropPage, PaymentPage, ETicket, LiveTracking)
│   │   ├── auth/             # Login and Signup pages
│   │   └── Infogo-ticket/    # Legal, policy, and reference pages
│   ├── services/             # Domain business services (travelAgent, recommendationEngine, etc.)
│   ├── styles/               # Component-level CSS Modules
│   ├── stylespages/          # Page-level CSS Modules
│   ├── App.js                # React Router route registry
│   └── index.js              # React application entry point
├── package.json
├── vercel.json
└── README.md
```

---

## 🛡️ License

This project is open-source and developed for academic and demonstration purposes under the MIT License.
