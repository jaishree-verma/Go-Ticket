
# GoTicket - AI Based Bus Booking Platform
=======
# GoTicket — AI-Agent-Based Intercity Bus Booking Platform
>>>>>>> feature/ai-agent-booking

GoTicket is a modern, responsive Indian intercity bus reservation platform featuring **Tixie**, an autonomous AI conversational travel agent, alongside an end-to-end manual booking workflow.

The application allows users to search routes, compare bus operators with deterministic ranking, interactively pick seats, apply discount coupons, preview simulated live GPS tracking, and complete ticket bookings either manually or conversationally with strict user confirmation safeguards.

---

## 🌟 Key Highlights & Features

### 1. 🤖 Tixie — Conversational AI Travel Agent
- **Natural Language Route Search:** Recognizes Indian cities, dates (*"tomorrow"*, *"next Friday"*, *"day after tomorrow"*), and departure preferences (*"evening"*, *"around 9 PM"*, *"cheapest"*, *"fastest"*).
- **Deterministic Multi-Criteria Ranking:** Ranks search results using a 5-factor scoring engine (Time fit: 30%, Price: 25%, Duration: 20%, Availability: 15%, Operator rating: 10%).
- **Atomic Seat Selection & Validation:** Validates seat requests against occupied seat maps (e.g. rejects occupied seats like `S7` without partial state corruption).
- **Single-Message & Multi-Turn Passenger Collection:** Extracts passenger name, email, and 10-digit mobile number from a single sentence or step-by-step.
- **Transparent Final Booking Summary:** Presents an itemized overview of bus, operator, date, departure time, seat numbers, masked passenger contact, base fare, discounts, and total payable amount.
- **Strict Explicit Confirmation Gate:** **Tixie NEVER finalizes a booking until the user explicitly approves the final booking summary** (e.g., *"Yes, confirm"*, *"Confirm booking"*, *"Book it"*). Non-committal phrases (*"maybe"*, *"what is the bus type?"*) and modifications (*"change seat to S5"*, *"change email"*) block booking finalization and update details interactively.
- **In-Flight Duplicate Guard:** Prevents multiple rapid clicks or simultaneous confirmation submissions from creating duplicate bookings.

### 2. 💺 End-to-End Manual Booking Workflow
- **Hero Search Widget:** Source and destination city selectors with date pickers for major Indian corridors.
- **Available Buses Listing:** Filter and sort by operator, price, time, and bus type (AC Sleeper, Volvo Multi-Axle, Seater).
- **Interactive Seat Map:** Visual lower and upper deck seat layout with live pricing, occupied indicators, and max-seat limits.
- **Boarding & Dropping Points:** Select pickup and drop locations along the travel route.
- **Checkout & Simulated Payment:** Net Banking, UPI, and Card options with simulated 6-digit OTP verification.
- **E-Ticket Generation:** Digital ticket pass with QR verification code, ticket reference ID (`GTXXXXXX`), passenger details, and print/download capabilities.

### 3. 📡 Live Bus Telemetry & Tracking
- Visual timeline with route checkpoints, vehicle speed, driver contact, and arrival estimates.

### 4. 📜 Information & Compliance Hub
- Dedicated policy pages: Privacy Policy, Terms & Conditions, Non-Disclosure Agreement (NDA), References, Responsible Disclosure, and Working Criteria.

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
  │ (Atomic seat validation: check availability, reject conflicts)
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
[CONFIRMED]                  [CANCELLED / IDLE]          [BOOKING_SUMMARY]
  │                              │                              │
  • Generates Ticket ID          • Clears pending state         • Prompts for explicit
  • Saves to localStorage        • No booking created             confirmation
  • Generates demo alerts
```

### Clean Service Layer Architecture

| Service File | Responsibility |
| :--- | :--- |
| `src/services/travelAgent.js` | Conversational NLU orchestrator, state transitions, confirmation gate |
| `src/services/recommendationEngine.js` | Deterministic 5-factor scoring algorithm for ranking search results |
| `src/services/agentTools.js` | Standard tool interface (`search_buses`, `get_bus_details`, `check_seat_availability`, `hold_select_seats`, `create_booking`) |
| `src/services/busService.js` | Route query filter and transport search abstraction |
| `src/services/seatService.js` | Single source of truth for seat grids and atomic availability validation |
| `src/services/bookingService.js` | Ticket creation, ID generation (`GTXXXXXX`), and `localStorage` persistence |
| `src/services/authService.js` | Session state, demo login verification, and profile management |
| `src/services/notificationService.js` | Simulated email & SMS notification formatting and dispatch logging |

---

## 💡 Demo Mode & Simulation Disclosures

To run self-contained in any environment without requiring external credentials or paid APIs:
- **Authentication:** Use demo credentials `demo@goticket.in` / `demo123` or register a local profile.
- **Payment Gateway:** Simulated payment processor with instant approval or demo OTP (`123456`).
- **Notifications:** Simulated email and SMS generation with console logging and masked recipient display.
- **GPS Bus Tracking:** Simulated real-time route checkpoints and telemetry.
- **Backend Persistence:** Active client-side architecture using browser `localStorage`. (Backend API ready for FastAPI + MySQL integration).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm (v9.0 or higher)

### Installation & Run

1. **Clone or navigate to the repository:**
   ```bash
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

5. **Run automated test suite:**
   ```bash
   node ../.gemini/antigravity/brain/3174ed00-2f15-4023-add1-b64f4dffa765/scratch/test_scenarios.mjs
   ```

---

## 📂 Project Structure

```text
Go-Ticket/
├── public/
│   ├── images/               # Fleet images, bus banners, payment badges
│   └── index.html            # HTML template
├── src/
│   ├── components/
│   │   ├── Authentication/   # Login & Signup modal with demo support
│   │   ├── AvailableBuses/   # Bus search results and filters
│   │   ├── BookingSection/   # Hero search bar and quick routes
│   │   ├── Chatbot/          # Tixie conversational AI chat interface & action cards
│   │   ├── Header/           # Navigation bar with active route highlight
│   │   ├── Hero/             # Promotional hero banners & carousel
│   │   ├── OffersSection/    # Discount vouchers & promo code apply
│   │   ├── SelectSeats/      # Interactive bus seat layout selector
│   │   └── TrackBus/         # Simulated live bus GPS tracking
│   ├── data/
│   │   └── mockBuses.js      # Intercity transport dataset (Kanpur, Delhi, Lucknow, Jaipur, etc.)
│   ├── pages/
│   │   ├── DropPage.jsx      # Boarding & dropping points selection
│   │   ├── ETicket.jsx       # E-Ticket view, QR code, and print pass
│   │   ├── PaymentPage.jsx   # Checkout, payment methods, and OTP modal
│   │   ├── SeatBooking.jsx   # Seat selection page container
│   │   └── Infogo-ticket/    # Legal, policy, and reference pages
│   │       ├── PrivacyPolicy.jsx
│   │       ├── Terms&Conditions.jsx
│   │       ├── NonDisclosureAggrement.jsx
│   │       ├── Refernce.jsx
│   │       ├── ResponsibleClosure.jsx
│   │       └── WorkingCriteria.jsx
│   ├── services/
│   │   ├── agentTools.js           # Tool abstraction layer for agent
│   │   ├── authService.js          # Authentication & user profile state
│   │   ├── bookingService.js       # Booking creation & ticket schema
│   │   ├── busService.js           # Bus search & query filters
│   │   ├── notificationService.js  # Simulated email & SMS notifications
│   │   ├── recommendationEngine.js # 5-factor bus scoring algorithm
│   │   ├── seatService.js          # Seat map & atomic seat validation
│   │   └── travelAgent.js          # Tixie conversational state machine & confirmation gate
│   ├── styles/                     # CSS Modules for components
│   ├── stylespages/                # CSS Modules for pages
│   ├── App.js                      # React Router route registry
│   └── index.js                    # React application entry point
├── package.json
└── README.md
```

---

## 🛡️ License

This project is open-source and developed for academic and demonstration purposes under the MIT License.
