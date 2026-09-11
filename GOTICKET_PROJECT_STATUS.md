# GoTicket — Project Status & Architectural Audit Document

> **Document Type:** Technical Baseline & AI-to-AI Handoff Report  
> **Project:** GoTicket (Indian Bus Booking & Fleet Tracking Platform)  
> **Repository Path:** `C:\Users\Hp\GoTicket\Go-Ticket`  
> **Inspection Date:** September 11, 2026  
> **Status Assessment:** Frontend Prototype with Mock Service Layer (Demo-Ready Client) — No Backend / Database Connected

---

## 1. PROJECT IDENTITY

* **Project Name:** GoTicket (Go-Ticket)
* **Project Purpose:** An end-to-end Indian intercity bus ticket booking, live bus tracking, and conversational AI travel concierge web platform.
* **One-Paragraph Description:** GoTicket is a React-based single-page application (SPA) offering users the ability to search bus routes between major Indian cities, view available buses with dynamic amenities and ratings, select seats on an interactive seat map, enter multi-passenger details with simulated mobile OTP verification, apply promotional discount coupons, simulate checkout payments, generate printable E-Tickets with QR codes, track buses on an OpenStreetMap interface with simulated real-time GPS coordinates, and interact with a multi-turn conversational AI travel assistant ("Tixie").
* **Current Development Status:** Fully functional client-side interactive prototype / demo. Core UI workflows, state transitions, client-side validation, and simulated multi-step agent flows work smoothly in the browser.
* **Demo-Ready Status:** **Yes (Demo-Ready Client)**. The visual presentation, animations, mock booking lifecycle, simulated OTPs, and chatbot interactions work end-to-end without runtime errors.
* **Current Frontend Technology:** React 19 (`react` 19.1.1, `react-dom` 19.1.1, `react-router-dom` 7.8.2, CSS Modules, Create React App / `react-scripts` 5.0.1).
* **Current Backend Technology:** **None present in codebase.** (Documented comments reference planned FastAPI / Flask endpoints, but no backend code or server files exist in the project).
* **Current Database / Storage Technology:** **No persistent database.** All data is stored in browser `localStorage` (`lastTicket`, `registeredUsers`, `authUser`, `userName`, `userEmail`, `userMobile`, `authToken`, `appliedCoupon`) and in-memory JavaScript data structures.
* **AI / NLU / Chatbot Technology:** Client-side rule-based natural language parser and deterministic state machine implemented in JavaScript (`src/services/travelAgent.js`, `src/services/recommendationEngine.js`, `src/services/agentTools.js`). No external LLM or Rasa server is connected to the frontend.
* **Deployment Technology:** Vercel SPA configuration (`vercel.json` with build output `build` and wildcard rewrites to `/index.html`).
* **Repository Remote:** `https://github.com/jaishree-verma/Go-Ticket.git` (branch `main`).

---

## 2. PROJECT DIRECTORY STRUCTURE

```text
GoTicket/
└── Go-Ticket/
    ├── .env                                  → Environment configuration (CI=false)
    ├── .gitignore                            → Git ignore rules (node_modules, build, env)
    ├── package.json                          → NPM package manifest and scripts
    ├── package-lock.json                     → NPM dependency lockfile
    ├── README.md                             → Project documentation and setup instructions
    ├── vercel.json                           → Vercel deployment & SPA routing configuration
    │
    ├── public/                               → Static public assets
    │   ├── favicon.ico                       → Web favicon
    │   ├── index.html                        → Main HTML page template
    │   ├── manifest.json                     → PWA manifest
    │   ├── robots.txt                        → Search engine crawler instructions
    │   └── images/                           → City and UI preview images (Agra, Delhi, etc.)
    │
    └── src/                                  → Application source code
        ├── App.css                           → Global application styling rules
        ├── App.js                            → Root React application component & route configuration
        ├── App.test.js                       → Basic test file
        ├── index.css                         → Global CSS reset and font variables
        ├── index.js                          → React DOM root mount entry point
        ├── logo.svg                          → React SVG logo asset
        ├── reportWebVitals.js                → Web performance metrics reporting
        ├── setupTests.js                     → Jest test setup
        │
        ├── context/                          → React Context Providers
        │   └── AuthContext.jsx               → Global authentication state, login, signup, logout
        │
        ├── data/                             → Static Mock Datasets
        │   └── mockBuses.js                  → Catalog of 14+ intercity buses across Indian routes
        │
        ├── services/                         → Client-side Business Logic & Service Layer
        │   ├── agentTools.js                 → Tool abstractions (search_buses, hold_select_seats, etc.)
        │   ├── authService.js                → Client-side auth logic, demo credentials, localStorage users
        │   ├── bookingService.js             → Ticket generation, localStorage booking committer
        │   ├── busService.js                 → Bus search filter with simulated 500ms network latency
        │   ├── notificationService.js        → Simulated SMS & Email delivery logger
        │   ├── recommendationEngine.js       → Multi-criteria scoring algorithm (Time, Price, Duration, Rating)
        │   ├── seatService.js                → 40-seat grid generator, atomic seat validator & hold logic
        │   └── travelAgent.js                → 919-line multi-turn conversational NLU & state machine
        │
        ├── components/                       → Reusable UI & Page Section Components
        │   ├── About.jsx                     → "Why Choose GoTicket" section with animated counters
        │   ├── AuthModal.jsx                 → Tabbed Sign In / Sign Up modal dialog
        │   ├── BookingSection.jsx            → 4-step booking guide card section
        │   ├── FAQ.jsx                       → Accordion-style frequently asked questions
        │   ├── Features.jsx                  → Platform feature highlight grid
        │   ├── Footer.jsx                    → Global application footer with links & contacts
        │   ├── Header.jsx                    → Main navigation bar with trust badges, auth status
        │   ├── Hero.jsx                      → Homepage search banner with city auto-suggestions
        │   ├── Info.jsx                      → Generic informational stub component
        │   ├── Layout.jsx                    → Master page layout (Header + Outlet + Footer + Chatbot)
        │   ├── OffersSection.jsx             → Interactive promotional gift banner & coupon modal
        │   ├── TestimonialsSection.jsx       → Marquee scrolling customer review carousel
        │   ├── TrackBus.jsx                  → Homepage live GPS tracking promotion card
        │   │
        │   ├── auth/                         → Authentication Helper Components
        │   │   └── ProtectedRoute.jsx        → Route protection guard rendering AuthModal when unauthenticated
        │   │
        │   └── Chatbot/                      → "Tixie" AI Travel Concierge
        │       ├── Chatbot.css               → Styles for floating launcher, modal & action cards
        │       ├── ChatbotLauncher.jsx       → Minimized bubble & floating avatar trigger button
        │       ├── ChatModal.jsx             → Interactive chat interface, chips, action buttons
        │       └── assets/
        │           └── chatbot-girl.png      → Tixie avatar image
        │
        ├── pages/                            → Routed Views & Page Controllers
        │   ├── aboutgoticket/                → Main Journey & Information Views
        │   │   ├── AvailableBuses.jsx        → Bus search results, filter by AM/PM, slot picker
        │   │   ├── ContactUs.jsx             → 24/7 hotline cards, query form, ticket status checker
        │   │   ├── DropPage.jsx              → Boarding & Dropping point selector
        │   │   ├── ETicket.jsx               → E-Ticket retrieval via OTP, PDF print, QR code
        │   │   ├── Home.jsx                  → Popular route explorer with distance, duration, fares
        │   │   ├── LiveTracking.jsx          → Bus tracking with OpenStreetMap iframe & distance calc
        │   │   ├── PaymentPage.jsx           → 4-step checkout: Summary, Multi-Passenger, Payment, Done
        │   │   ├── SeatBooking.jsx           → Standalone route & date selection page with suggestions
        │   │   └── SelectSeats.jsx           → 40-seat interactive bus grid with aisle & sold seat checks
        │   │
        │   ├── auth/                         → Authentication Pages
        │   │   ├── Login.jsx                 → Email/password login with demo autofill button
        │   │   └── Signup.jsx                → New user registration with client validation
        │   │
        │   └── Infogo-ticket/                → Legal & Policy Pages (Currently 0-byte stubs)
        │       ├── NonDisclosureAggrement.jsx→ Empty (0 bytes)
        │       ├── PrivacyPolicy.jsx         → Empty (0 bytes)
        │       ├── Refernce.jsx              → Empty (0 bytes)
        │       ├── ResponsibleClosure.jsx    → Empty (0 bytes)
        │       ├── Terms&Conditions.jsx      → Empty (0 bytes)
        │       └── WorkingCriteria.jsx       → Empty (0 bytes)
        │
        ├── styles/                           → Component-level CSS Modules
        │   ├── about.module.css
        │   ├── bookingsection.module.css
        │   ├── faq.module.css
        │   ├── features.module.css
        │   ├── footer.module.css
        │   ├── header.module.css
        │   ├── hero.module.css
        │   ├── offers.module.css
        │   ├── testimonials.module.css
        │   └── trackbus.module.css
        │
        └── stylespages/                      → Page-level CSS Modules
            ├── availablebuses.module.css
            ├── contactus.module.css
            ├── drop.module.css
            ├── eticket.module.css
            ├── home.module.css
            ├── livetracking.module.css
            ├── login-signup.module.css
            ├── payment.module.css
            ├── seatbooking.module.css
            └── selectseats.module.css
```

---

## 3. TECHNOLOGY STACK

| Layer | Technology | Verified From |
|---|---|---|
| **Frontend Framework** | React 19 (`19.1.1`) | `package.json` |
| **DOM Renderer** | React DOM (`19.1.1`) | `package.json` |
| **Client Routing** | React Router DOM (`7.8.2`) | `package.json`, `src/App.js` |
| **Build & Scripts** | Create React App / `react-scripts` (`5.0.1`) | `package.json` |
| **HTTP Client** | Axios (`1.12.2`) *(Installed but currently unused)* | `package.json` |
| **Language** | JavaScript (ES6+ / JSX) | `src/**/*.jsx`, `src/**/*.js` |
| **Styling** | CSS Modules + Global CSS Variables | `src/styles/*.module.css`, `src/stylespages/*.module.css` |
| **Backend** | **None** *(Client-side simulated service layer only)* | Whole repository scan |
| **Database** | **None** *(No persistent SQL / NoSQL database)* | Whole repository scan |
| **Storage** | Browser `localStorage` | `src/services/authService.js`, `src/services/bookingService.js` |
| **NLU / AI** | Custom Client-side Regex Parser & State Machine | `src/services/travelAgent.js`, `src/services/recommendationEngine.js` |
| **Authentication** | Client-side Session in `localStorage` + `AuthContext` | `src/context/AuthContext.jsx`, `src/services/authService.js` |
| **Maps / Tracking** | OpenStreetMap `iframe` Embed + Geolocation API | `src/pages/aboutgoticket/LiveTracking.jsx` |
| **Deployment** | Vercel Static Hosting (`vercel.json`) | `vercel.json` |
| **Version Control** | Git (`main` branch tracking GitHub origin) | `.git/config`, `git status` |

---

## 4. FRONTEND ARCHITECTURE & COMPONENTS

### Main Entry Point & Routing
* **Entry Point:** `src/index.js` renders `<App />` inside `React.StrictMode`.
* **Root Application:** `src/App.js` wraps everything inside `<AuthProvider>` and `<Router>`, utilizing a nested `<Layout />` route structure.

### Page Routes Defined in `App.js`

| Path | Component | Description | Status |
|---|---|---|---|
| `/` | `<Hero />`, `<OffersSection />`, `<About />`, `<Booking />`, `<TrackBus />`, `<TestimonialsSection />`, `<FAQ />` | Main Landing Page | ✅ Implemented |
| `/home` | `<Home />` | Popular Route Guide & City Explorer | ✅ Implemented |
| `/booking` | `<BookingPage />` (`BookingSection.jsx`) | 4-step booking workflow information | ✅ Implemented |
| `/seatbooking` | `<SeatBooking />` | Route & Travel Date Search Form with Suggestions | ✅ Implemented |
| `/available-buses` | `<AvailableBuses />` | Bus Search Results & Time Slot Selection | ✅ Implemented |
| `/select-seats` | `<SelectSeats />` | 40-Seat Bus Layout Selection Grid | ✅ Implemented |
| `/drop` | `<DropPage />` | Boarding & Dropping Point Radio Selection | ✅ Implemented |
| `/payment` | `<PaymentPage />` | Multi-Passenger Details, OTP, Coupon, Simulated Checkout | ✅ Implemented |
| `/eticket` | `<ETicket />` | E-Ticket Lookup by Mobile, OTP Verification & Printable Pass | ✅ Implemented |
| `/livetracking` | `<LiveTracking />` | Live Bus GPS Map Simulation & Distance Calculator | ✅ Implemented |
| `/contact` | `<ContactUs />` | Support Contacts, Ticket Status Lookup, Query Submission | ✅ Implemented |
| `/login` | `<Login />` | Standalone Login Page with Demo Autofill | ✅ Implemented |
| `/signup` | `<Signup />` | Standalone User Registration Page | ✅ Implemented |
| `/networking` | `<Info />` | Info Placeholder View | 🟡 Partial (Stub) |
| `/privacy`, `/terms` | *(Unrouted)* | Target files in `Infogo-ticket/` are 0-byte empty files | ❌ Not Implemented |

### Major UI Components & Features

1. **Header Navigation (`Header.jsx`):** Displays branding, golden trust laurel badge, category links (Bus tickets, Bus tracking, E-Ticket, Routes), login/signup toggle, user avatar, and logout handler. Includes an automatic 800ms initial popup prompt for unauthenticated users.
2. **Hero Search Bar (`Hero.jsx`):** Form with 50+ Indian cities in dropdown auto-suggestions, quick-date buttons (Today, Tomorrow), recent searches, and validation preventing identical source/destination or past travel dates.
3. **Interactive Seat Map (`SelectSeats.jsx`):** 8 rows × 5 columns (40 seats: 2 left + aisle + 2 right) with visual states: Available (green border), Sold (gray disabled), Selected (solid green).
4. **Checkout & Multi-Passenger Flow (`PaymentPage.jsx`):** 4-step wizard (Summary → Passenger Details → Payment Method → Confirmed). Supports dynamic passenger addition/removal, individual simulated OTP verification per phone number, Aadhaar masking, promo coupons (`FIRSTGO`, `GTWEEKEND`, `UPIPAY`), and UPI/Card forms.
5. **Conversational Concierge (`ChatModal.jsx`):** Floating avatar with persistent tooltip (`ChatbotLauncher.jsx`), multi-turn dialogue, execution status traces, quick-reply chip buttons, dynamic action cards with navigation triggers, and full conversational booking flow.
6. **Live GPS Tracking UI (`LiveTracking.jsx`):** Live OpenStreetMap iframe, animated bus marker, 3-second simulation timer moving the bus along route waypoints, driver details card, and browser HTML5 Geolocation distance calculator.
7. **Offers & Testimonials:** Interactive gift box modal saving applied coupons to `localStorage` (`OffersSection.jsx`) and continuous CSS marquee carousel of verified customer reviews (`TestimonialsSection.jsx`).

---

## 5. BACKEND & API STATUS

### Current Backend Status: **NO BACKEND EXISTS**
There is **no active backend server** (no Node/Express, Python/FastAPI, or Python/Flask files) in the repository.
All data fetching and mutations are executed by client-side JavaScript services simulating asynchronous API responses via `Promise` and `setTimeout`.

### Simulated Service Endpoints (Internal Service Layer)

| Internal Service Function | Mock Latency | Purpose | Input Parameters | Output Structure | Implementation Status |
|---|---|---|---|---|---|
| `busService.searchBuses` | 500ms | Searches buses by source, destination, date, time filter | `{ source, destination, date, preferredTime, maxPrice, busType }` | `Promise<Array<BusObject>>` | ✅ Implemented (Client Mock) |
| `seatService.getAvailableSeats` | Synchronous | Returns available & occupied seat lists | `(busId, date, slot)` | `{ busId, totalSeats: 40, availableSeats: [], occupiedSeats: [] }` | ✅ Implemented (Client Mock) |
| `seatService.validateAndHoldSeats` | Synchronous | Atomically validates requested seats against occupied list | `(busId, date, slot, requestedSeats, farePerSeat)` | `{ success, atomicityHeld, seats, totalFare, error }` | ✅ Implemented (Client Mock) |
| `bookingService.createAgentBooking` | Synchronous | Generates ticket object and persists to `localStorage` | `{ busDetails, slot, seats, boarding, dropping, passenger, totalFare }` | `{ success: true, ticketId, ticket }` | ✅ Implemented (Client Mock) |
| `authService.login` | Synchronous | Validates credentials against demo data & `registeredUsers` | `(email, password)` | `Promise<{ name, email, mobile, token }>` | ✅ Implemented (Client Mock) |
| `authService.signup` | Synchronous | Validates uniqueness and registers user to `localStorage` | `{ name, email, mobile, password }` | `Promise<{ name, email, mobile, token }>` | ✅ Implemented (Client Mock) |
| `notificationService.sendTicketEmail` | 400ms | Simulates email dispatch and logs preview to console | `{ email, ticket }` | `Promise<{ attempted, success, mode: 'demo', preview }>` | ✅ Implemented (Client Mock) |
| `notificationService.sendTicketSMS` | 300ms | Simulates SMS dispatch and logs preview to console | `{ mobile, ticket }` | `Promise<{ attempted, success, mode: 'demo', preview }>` | ✅ Implemented (Client Mock) |

---

## 6. DATABASE & STORAGE IMPLEMENTATION

> **Verification Statement:** **No persistent database was verified in the current implementation.** There is no MySQL, PostgreSQL, MongoDB, SQLite, or Firebase connected.

### Storage Mechanisms in Use

| Storage Location | Key / Variable | Data Stored | Access Method | Survives Page Refresh? | Survives Server Restart? | Persistence Type |
|---|---|---|---|---|---|---|
| **`localStorage`** | `lastTicket` | JSON object of most recent confirmed booking | `getItem('lastTicket')` / `setItem` | **Yes** | **Yes** (Client device only) | Browser Persistent |
| **`localStorage`** | `registeredUsers` | Array of registered user objects `{ name, email, mobile, password, registeredAt }` | `getItem('registeredUsers')` / `setItem` | **Yes** | **Yes** (Client device only) | Browser Persistent |
| **`localStorage`** | `authUser` | Currently logged-in user object `{ name, email, mobile, token }` | `getItem('authUser')` / `setItem` | **Yes** | **Yes** (Client device only) | Browser Persistent |
| **`localStorage`** | `userName`, `userEmail`, `userMobile`, `authToken` | Redundant individual session string keys | `getItem(...)` / `setItem` | **Yes** | **Yes** (Client device only) | Browser Persistent |
| **`localStorage`** | `appliedCoupon` | Selected coupon discount code `{ code, discountText, ... }` | `getItem('appliedCoupon')` / `setItem` | **Yes** | **Yes** (Client device only) | Browser Persistent |
| **In-Memory JS** | `MOCK_BUSES` | Master dataset of 14+ bus schedules and amenities | Imported from `src/data/mockBuses.js` | Reset on reload | Reset on reload | Volatile JS Memory |
| **In-Memory JS** | `MOCK_TICKETS` | Default seed tickets for demo mobile numbers | Constant in `src/pages/aboutgoticket/ETicket.jsx` | Reset on reload | Reset on reload | Volatile JS Memory |
| **In-Memory JS** | `BUS_FLEET` | Fleet tracking coordinates, waypoints, drivers | Constant in `src/pages/aboutgoticket/LiveTracking.jsx` | Reset on reload | Reset on reload | Volatile JS Memory |
| **In-Memory JS** | `DEFAULT_SOLD_SEATS` | Array `['S2', 'S7', 'S12', 'S18', 'S24', 'S31']` | Constant in `src/services/seatService.js` | Reset on reload | Reset on reload | Volatile JS Memory |

---

## 7. COMPLETE USER BOOKING FLOW

The application features two complete parallel booking flows: **(A) Manual Web UI Flow** and **(B) Conversational AI Flow**.

### Flow A: Manual Web UI Booking Workflow

```text
1. Search (Hero.jsx or SeatBooking.jsx)
   └─ User selects Source, Destination, Date
   └─ Validates non-empty, distinct cities, non-past date
   └─ Navigates to /available-buses with route state
         ↓
2. Bus Selection (AvailableBuses.jsx)
   └─ Fetches bus list via busService.searchBuses()
   └─ User views operators, ratings, bus type, amenities, time slots
   └─ User clicks time slot button
   └─ Navigates to /select-seats with bus & slot state
         ↓
3. Seat Selection (SelectSeats.jsx)
   └─ Renders 40-seat layout (8 rows × 5 cols with aisle)
   └─ Checks seatService.DEFAULT_SOLD_SEATS (S2, S7, S12, S18, S24, S31 disabled)
   └─ User toggles available seats (S1..S40)
   └─ Fare dynamically calculated (Seat Count × Slot Fare)
   └─ User clicks "Proceed to Select Boarding / Drop Point"
   └─ Navigates to /drop with selected seats
         ↓
4. Boarding & Dropping Points (DropPage.jsx)
   └─ User selects radio options for Boarding and Dropping points
   └─ Validates both points selected
   └─ Navigates to /payment with bookingData
         ↓
5. Passenger Details & OTP (PaymentPage.jsx — Step 1 & 2)
   └─ Step 1: Displays trip summary banner
   └─ Step 2: Passenger form (Full Name, Gender, Age, Mobile, Email, Aadhaar)
   └─ User clicks "Send OTP" → Generates 6-digit random OTP shown via alert()
   └─ User enters OTP & clicks "Verify" → Marks mobileVerified = true
   └─ Validates 12-digit Aadhaar, valid email format
         ↓
6. Payment & Promo Code (PaymentPage.jsx — Step 3)
   └─ User applies promo code (FIRSTGO: ₹150 OFF, GTWEEKEND: ₹200 OFF, UPIPAY: ₹50 OFF)
   └─ User selects UPI (validates @upi) or Card (validates 16 digits, CVV, expiry)
   └─ User clicks "Confirm & Pay"
         ↓
7. Confirmation & Ticket Storage (PaymentPage.jsx — Step 4 & ETicket.jsx)
   └─ Generates Ticket ID (e.g. GT7AX9KP)
   └─ Persists full ticket JSON to localStorage under 'lastTicket'
   └─ Displays verified confirmation card with printable layout
   └─ User can navigate to /eticket to view QR code and download/print
```

---

## 8. CONVERSATIONAL / CHATBOT SYSTEM ("TIXIE")

The chatbot is implemented client-side in `src/services/travelAgent.js` (orchestrator) and `src/components/Chatbot/ChatModal.jsx` (UI).

```text
[IDLE]
  ↓ (User query: e.g. "Find buses from Kanpur to Delhi tomorrow")
[COLLECTING_INFORMATION] (if missing source/dest)
  ↓
[WAITING_FOR_BUS_SELECTION] (presents ranked recommended buses & chips)
  ↓ (User picks bus / "cheapest" / "recommended")
[BUS_SELECTED]
  ↓ (User checks seats)
[WAITING_FOR_SEAT_SELECTION]
  ↓ (User picks "S3 and S4" -> Atomic validation hold)
[WAITING_FOR_BOOKING_CONFIRMATION]
  ↓
[COLLECTING_PASSENGER_INFO] (Sequential: Name -> Email -> Mobile)
  ↓
[BOOKING_SUMMARY] (Masked display of Name, Email, Mobile, Fare)
  ↓ (Explicit confirmation: "Confirm" / "Book it")
[BOOKING] (Duplicate protection lock)
  ↓
[CONFIRMED] (Ticket persisted to localStorage + Demo notifications + E-Ticket button)
```

### Conversational Architecture Details

1. **Input Processing & NLU:**
   * **City Matcher:** Matches against 16 recognized Indian cities (`Kanpur`, `Delhi`, `Lucknow`, `Agra`, `Jaipur`, `Mumbai`, `Pune`, `Bangalore`, etc.).
   * **Route Patterns:** Regex matches `from <city> to <city>`, `<city> to <city>`, `<city> -> <city>`.
   * **Date Parser:** Resolves `today`, `tomorrow`, `day after tomorrow`, and named days of the week (`monday`..`sunday`).
   * **Time & Constraints:** Extracts specific times (e.g. `9 PM`, `08:30 AM`) and relative slots (`morning`, `afternoon`, `evening`, `night`).
   * **Seat Label Extractor:** Regex `\bS[-_\s]?\d{1,2}\b` extracts seat IDs (e.g. `S3 and S4`).
2. **Deterministic Recommendation Engine (`recommendationEngine.js`):**
   * Multi-factor scoring formula: **Time Match (30%) + Price (25%) + Duration (20%) + Seat Availability (15%) + Customer Rating (10%)**.
3. **Atomic Seat Holding & Validation:**
   * Handled by `hold_select_seats` in `agentTools.js`.
   * **Atomicity Rule:** If any requested seat is occupied (e.g. `S7`), the entire request is rejected with a descriptive message; partial reservations are never committed.
4. **Missing-Field Sequential Passenger Collection:**
   * Sequential step collection: **Name → Email → Mobile**.
   * Validates name length (>= 2 chars), email regex (`*@*.*`), and Indian mobile regex (`^[6-9]\d{9}$`).
   * Allows inline modification commands: `"change email"`, `"change phone"`, `"change name"`, `"change seats"`, or `"cancel"`.
5. **Confirmation Gate & Notification:**
   * Requires explicit confirmation phrases (`"confirm"`, `"book it"`, `"yes book it"`, `"go ahead"`, `"proceed"`).
   * Commits ticket to `localStorage.setItem('lastTicket', ...)` via `bookingService.createAgentBooking`.
   * Simulates notification dispatch via `notificationService.sendTicketEmail` and `sendTicketSMS`.

---

## 9. BUS / TRIP TRACKING IMPLEMENTATION

* **Tracking Nature:** **100% Client-Side Simulation with Mock Coordinates** (No physical GPS hardware, driver app, or backend telemetry stream).
* **Location Data Source:** Static predefined waypoint arrays in `src/pages/aboutgoticket/LiveTracking.jsx` under `BUS_FLEET`:
  * `UP32AB1234` (Lucknow → Kanpur): Lucknow ISBT (`26.8467, 80.9462`), Unnao (`26.7000, 80.6500`), Kanpur Central (`26.4499, 80.3319`).
  * `DL01CD5678` (Delhi → Agra): Delhi ISBT (`28.6420, 77.2167`), Mathura (`27.4924, 77.6737`), Agra Fort (`27.1767, 78.0081`).
  * `MH12EF9012` (Mumbai → Pune): Mumbai Dadar (`19.0760, 72.8777`), Lonavala (`18.7481, 73.4072`), Pune Swargate (`18.5204, 73.8567`).
* **Simulation Engine:**
  * Uses `setInterval` running every 3000ms.
  * Advances vehicle progress by `+0.3%` per tick.
  * Linear position interpolation between waypoints.
* **Map Renderer:**
  * Embedded OpenStreetMap export iframe:
    `https://www.openstreetmap.org/export/embed.html?bbox={lng-0.15},{lat-0.15},{lng+0.15},{lat+0.15}&layer=mapnik&marker={lat},{lng}`
  * Custom animated CSS bus pin overlay positioned above the iframe.
* **User Distance Calculation:**
  * Uses browser HTML5 `navigator.geolocation.getCurrentPosition`.
  * Computes great-circle distance between user position and simulated bus position using the **Haversine formula**.

---

## 10. SEAT MANAGEMENT

* **Seat Layout & Count:** Standard 40-seat bus layout (`S1` to `S40`), arranged in 8 rows × 5 seats (2 Left + Aisle + 2 Right).
* **Availability Source:** Hardcoded mock array in `src/services/seatService.js`:
  `DEFAULT_SOLD_SEATS = ['S2', 'S7', 'S12', 'S18', 'S24', 'S31']`.
* **Selection State:** Managed via React component local state in `SelectSeats.jsx` and agent conversation state in `travelAgent.js`.
* **Seat Persistence:** Selected seats are passed via React Router navigation state (`location.state`) to `/drop` and `/payment`, and persisted into `localStorage.lastTicket` upon booking completion.
* **Concurrency & Duplicate Prevention:**
  * Real-time multi-user concurrency is **NOT implemented** (since there is no shared backend/database).
  * In-session duplicate booking protection is handled atomically during the session check.

---

## 11. VALIDATION AND ERROR HANDLING

| Area | Field / Action | Validation Rule | Error Feedback Mechanism |
|---|---|---|---|
| **Auth** | Email | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | Form error alert banner |
| **Auth** | Password | Minimum 6 characters | Form error alert banner |
| **Auth** | Signup Mobile | `^[6-9]\d{9}$` (10-digit Indian mobile) | Form error alert banner |
| **Auth** | Signup Confirm | `password === confirm` | Form error alert banner |
| **Search** | Cities | `from !== '' && to !== '' && from !== to` | Inline warning text under search input |
| **Search** | Travel Date | `date >= today` | Inline warning text |
| **Seat Booking** | Seats | At least 1 seat selected; not in `DEFAULT_SOLD_SEATS` | Disabled button state / Toast warning |
| **Payment** | Passenger Name | `/^[a-zA-Z\s]{3,}$/` (at least 3 alphabetic characters) | Inline form validation message |
| **Payment** | Mobile OTP | Verified matching simulated OTP code | OTP input error message + disabled proceed button |
| **Payment** | Aadhaar | `/^\d{12}$/` (12 numeric digits) | Inline form validation message |
| **Payment** | Age | Integer between `1` and `99` | Inline form validation message |
| **Payment** | UPI ID | Must contain `@` (e.g. `user@okhdfcbank`) | Error alert on submit |
| **Payment** | Card | 16-digit card number, CVV >= 3 digits, valid expiry | Error alert on submit |
| **Chatbot** | Unknown Intent | Default fallback handler prompting example queries | Returns friendly fallback suggestions & chips |

---

## 12. API & FRONTEND-BACKEND INTEGRATION

* **Current Architecture:** Standalone Client-Side Application (Zero network API calls).
* **Base URL Configuration:** None configured. (No `REACT_APP_API_URL` or `VITE_API_URL` in `.env`).
* **Environment File (`.env`):** Contains only `CI=false`.
* **CORS Configuration:** Not applicable (no backend server).
* **Future Integration Blueprint:**
  * To connect a real backend (e.g. FastAPI / Flask), replace `authService.js`, `busService.js`, `seatService.js`, and `bookingService.js` with Axios requests pointing to an environment-configured API gateway.

---

## 13. AUTHENTICATION AND SECURITY

* **Authentication Model:** Client-Side Mock Authentication via React `AuthContext` and `authService.js`.
* **Pre-Configured Demo Account:**
  * **Email:** `demo@goticket.in`
  * **Password:** `demo123`
* **Registration Storage:** Newly registered accounts are stored in plain text inside browser `localStorage['registeredUsers']`.
* **Session Persistence:** Active user object is stored in `localStorage['authUser']` with a dummy token `token-demo-<timestamp>`.
* **Route Protection:** `ProtectedRoute.jsx` exists and displays the `AuthModal` if `isAuthenticated` is false.
* **Security Observations (To Address in Backend Phase):**
  * Passwords in `localStorage` are stored in plain text without hashing (e.g., bcrypt).
  * Tokens are client-generated mock strings, not cryptographic JWTs signed by a backend secret.
  * Sensitive passenger data (Aadhaar numbers, emails, phone numbers) are stored in client `localStorage`.

---

## 14. EXTERNAL SERVICES & THIRD-PARTY APIS

| Service / Provider | Purpose | Where Used | Required for Core App? | Operational Status |
|---|---|---|---|---|
| **OpenStreetMap** | Tile map embed for bus tracking | `LiveTracking.jsx` (iframe) | Yes (for map view) | ✅ Working (Public Embed) |
| **HTML5 Geolocation API** | User GPS coordinates for distance calculation | `LiveTracking.jsx` | Optional | ✅ Working (Browser Native) |
| **Axios** | HTTP Client library | `package.json` | No (Currently unused) | 🟡 Installed, not utilized |
| **SMS / Email Gateways** | Notification delivery | `notificationService.js` | No (Simulated in browser) | 🟡 Simulated Demo Mode |
| **Payment Gateways** | Payment processing | `PaymentPage.jsx` | No (Simulated in browser) | 🟡 Simulated Demo Mode |

---

## 15. ENVIRONMENT VARIABLES

* **File Inspected:** `C:\Users\Hp\GoTicket\Go-Ticket\.env`
* **Variables Present:**
  * `CI=false` — Disables Create React App from treating ESLint warnings as fatal build errors in CI/CD pipelines.
* **Mandatory Variables for Current App:** None (Application executes entirely out-of-the-box).

---

## 16. CURRENT FEATURE STATUS MATRIX

| Feature | Status | Evidence / File | Notes |
|---|---|---|---|
| **Homepage & Landing Experience** | ✅ Implemented | `Hero.jsx`, `About.jsx`, `Layout.jsx` | Dynamic city auto-suggestions, counters |
| **Trip Search** | ✅ Implemented | `Hero.jsx`, `SeatBooking.jsx`, `busService.js` | Source/Dest autocomplete, date validation |
| **Bus Results Listing** | ✅ Implemented | `AvailableBuses.jsx`, `mockBuses.js` | AM/PM filter, ratings, amenities |
| **Seat Selection Map** | ✅ Implemented | `SelectSeats.jsx`, `seatService.js` | 40-seat interactive grid, sold seat locks |
| **Boarding & Dropping Selector** | ✅ Implemented | `DropPage.jsx` | Radio selection with popular tags |
| **Multi-Passenger Details** | ✅ Implemented | `PaymentPage.jsx` | Dynamic add/remove passenger cards |
| **Mobile OTP Verification** | ✅ Implemented | `PaymentPage.jsx`, `ETicket.jsx` | Simulated 6-digit OTP popup |
| **Aadhaar & Passenger Validation**| ✅ Implemented | `PaymentPage.jsx` | 12-digit Aadhaar, email, age checks |
| **Promotional Coupon Engine** | ✅ Implemented | `OffersSection.jsx`, `PaymentPage.jsx` | `FIRSTGO`, `GTWEEKEND`, `UPIPAY` |
| **Checkout & Simulated Payment** | ✅ Implemented | `PaymentPage.jsx` | UPI ID, Credit/Debit card form validation |
| **E-Ticket Generation & Printing**| ✅ Implemented | `PaymentPage.jsx`, `ETicket.jsx` | Printable layout, QR code, Ticket ID |
| **E-Ticket Mobile Retrieval** | ✅ Implemented | `ETicket.jsx` | Lookup by mobile + simulated OTP |
| **Live Bus Tracking Simulation** | ✅ Implemented | `LiveTracking.jsx`, `TrackBus.jsx` | OpenStreetMap iframe, 3s position updates |
| **User Geolocation Distance** | ✅ Implemented | `LiveTracking.jsx` | Haversine formula calculation |
| **Conversational Agent ("Tixie")**| ✅ Implemented | `travelAgent.js`, `ChatModal.jsx` | Multi-turn search, seat pick & booking |
| **Deterministic Recommendation** | ✅ Implemented | `recommendationEngine.js` | 5-factor weighted bus scoring |
| **Client-side Authentication** | ✅ Implemented | `AuthContext.jsx`, `authService.js` | Demo login, user registration |
| **Popular Routes Directory** | ✅ Implemented | `Home.jsx` | 8 popular intercity corridors with stats |
| **Contact Support & Status Check**| ✅ Implemented | `ContactUs.jsx` | Hotline cards, query form, PNR status |
| **Legal & Policy Pages** | ❌ Not Implemented | `src/pages/Infogo-ticket/*.jsx` | 6 files exist but are 0-byte empty files |
| **Persistent Backend API** | ❌ Not Implemented | Repository Root | No backend server code |
| **Persistent Database** | ❌ Not Implemented | Repository Root | No SQL/NoSQL storage |

---

## 17. KNOWN BUGS, DEFECTS & ARCHITECTURAL LIMITATIONS

### Bug 1: 0-Byte Empty Policy & Legal Pages
* **Location:** `src/pages/Infogo-ticket/` (`PrivacyPolicy.jsx`, `Terms&Conditions.jsx`, `NonDisclosureAggrement.jsx`, `Refernce.jsx`, `ResponsibleClosure.jsx`, `WorkingCriteria.jsx`).
* **Observed Behavior:** Files are 0 bytes. Links in Footer/ContactUs either do not point to routes or would crash if imported.
* **Expected Behavior:** Standard legal and policy boilerplate components.
* **Severity:** Low.

### Bug 2: Standalone `/booking` Route Duplication
* **Location:** `src/App.js` (Lines 118, 120).
* **Observed Behavior:** Both `/booking` and the landing page render `<BookingSection />` (which is just an informational 4-step card section), whereas `/seatbooking` renders the actual search form (`SeatBooking.jsx`).
* **Expected Behavior:** `/booking` should either redirect to `/seatbooking` or host a dedicated search/booking view.
* **Severity:** Low.

### Bug 3: `Info.jsx` Placeholder Component
* **Location:** `src/components/Info.jsx` (Route `/networking`).
* **Observed Behavior:** Renders a bare `<h2>Info Section</h2><p>This is the Info component.</p>`.
* **Expected Behavior:** Either complete networking/partner information or remove unused route.
* **Severity:** Low.

### Bug 4: Plain-Text LocalStorage User Credentials
* **Location:** `src/services/authService.js` (`registeredUsers`).
* **Observed Behavior:** Registered passwords stored unhashed in `localStorage`.
* **Expected Behavior:** Acceptable for client-only demo; must be moved to backend password hashing (bcrypt) in production.
* **Severity:** Medium (Security consideration for production).

---

## 18. INCOMPLETE & PLANNED FEATURES

1. **Real Backend Integration (FastAPI / Flask / Express):** Replacing mock services with REST API endpoints.
2. **Real Database Integration (MySQL / PostgreSQL / MongoDB):** Persisting users, buses, live bookings, and seat locks across sessions and devices.
3. **Real Payment Gateway Integration:** Razorpay / Stripe / Cashfree webhooks for processing actual payments.
4. **Real SMS / WhatsApp / Email Delivery:** Twilio / Gupshup / SendGrid integration for live ticket dispatch.
5. **Real GPS Telemetry Ingestion:** WebSocket or MQTT feed for real bus GPS coordinates.

---

## 19. RUNNING & BUILD STATUS

### Running the Application

* **Prerequisites:** Node.js (v18+ or v20+ recommended) and npm.
* **Development Server Command:**
  ```powershell
  cd C:\Users\Hp\GoTicket\Go-Ticket
  npm start
  ```
  *(Launches on `http://localhost:3000`)*

* **Production Build Command:**
  ```powershell
  cd C:\Users\Hp\GoTicket\Go-Ticket
  npm run build
  ```
  *(Outputs static build to `C:\Users\Hp\GoTicket\Go-Ticket\build`)*

* **Test Suite Command:**
  ```powershell
  cd C:\Users\Hp\GoTicket\Go-Ticket
  npm test
  ```

---

## 20. TEAM WORKLOAD & CONTRIBUTION MODULES

| Module / Member | Primary Scope | Core Files Assigned |
|---|---|---|
| **Member 1: Frontend & UI/UX** | Visual layout, responsive design, landing sections, seat grid, theme styling | `src/components/Hero.jsx`<br>`src/components/Header.jsx`<br>`src/components/Footer.jsx`<br>`src/pages/aboutgoticket/SelectSeats.jsx`<br>`src/styles/*.module.css`<br>`src/stylespages/*.module.css` |
| **Member 2: Booking Engine & Checkout** | Search workflows, multi-passenger forms, OTP simulation, coupon discounts, payment page, E-Ticket generation | `src/pages/aboutgoticket/AvailableBuses.jsx`<br>`src/pages/aboutgoticket/DropPage.jsx`<br>`src/pages/aboutgoticket/PaymentPage.jsx`<br>`src/pages/aboutgoticket/ETicket.jsx`<br>`src/services/bookingService.js`<br>`src/services/busService.js` |
| **Member 3: AI Concierge & State Machine** | Conversational NLU, multi-turn dialogue, recommendation scoring algorithm, atomic seat validation tools | `src/components/Chatbot/ChatModal.jsx`<br>`src/components/Chatbot/ChatbotLauncher.jsx`<br>`src/services/travelAgent.js`<br>`src/services/recommendationEngine.js`<br>`src/services/agentTools.js` |
| **Member 4: Tracking, Auth & Future Backend** | OpenStreetMap tracking, distance calculations, auth context, session persistence, API/backend integration | `src/pages/aboutgoticket/LiveTracking.jsx`<br>`src/components/TrackBus.jsx`<br>`src/context/AuthContext.jsx`<br>`src/services/authService.js`<br>`src/services/notificationService.js`<br>`vercel.json` |

---

## 21. CURRENT PROJECT MATURITY ASSESSMENT

* **Overall Project Status:** **Medium (Functional Client Prototype / Demo-Ready)**
* **Frontend UI / UX:** **High (90%)** — Modern, polished styling, interactive animations, responsive layouts.
* **Booking & Checkout Flow:** **High (85%)** — Complete end-to-end multi-step flow with simulated validation.
* **Conversational AI ("Tixie"):** **High (85%)** — Sophisticated multi-turn state machine and atomic seat booking.
* **Bus Tracking:** **Medium (60%)** — Realistic simulation with OpenStreetMap and Haversine distance, but mock coordinates.
* **Authentication:** **Medium (50%)** — Functional client session management, but stored in `localStorage`.
* **Storage & Persistence:** **Low (25%)** — Relies purely on browser `localStorage`; no database.
* **Backend API:** **Low (0%)** — No backend server or endpoints implemented.
* **Testing & CI/CD:** **Low (15%)** — Basic CRA test harness present; no comprehensive unit/integration test coverage.

---

## 22. PRIORITY ROADMAP (TODO LIST)

### P0 — Must Have Before Final Academic / Production Demo
1. **Fix Empty Policy Files:** Populate or cleanly handle the 6 0-byte files in `src/pages/Infogo-ticket/` (`PrivacyPolicy.jsx`, `Terms&Conditions.jsx`, etc.).
2. **Harmonize `/booking` vs `/seatbooking` Routing:** Update `App.js` so that `/booking` navigates to `SeatBooking.jsx` rather than duplicating the static `BookingSection.jsx`.
3. **Consolidate Legacy Fallback Keys:** Standardize `localStorage` user keys across `authService.js` and `AuthContext.jsx` to prevent session desynchronization.

### P1 — Should Have (High Value Improvements)
1. **Develop Real REST Backend:** Build a lightweight FastAPI or Express backend providing real `/api/buses`, `/api/seats`, `/api/bookings`, and `/api/auth` endpoints.
2. **Connect Database (SQLite / PostgreSQL / MySQL):** Persist registered users, bookings, and active seat states across multiple browser sessions.
3. **True JWT Authentication:** Replace client-generated tokens with cryptographically signed JSON Web Tokens and password hashing (`bcrypt`).

### P2 — Nice to Have (Enhancements)
1. **Real GPS WebSocket Stream:** Ingest live vehicle telemetry into `LiveTracking.jsx`.
2. **Third-Party Payment Gateway Sandbox:** Integrate Razorpay test mode on `PaymentPage.jsx`.
3. **External LLM Integration:** Connect Tixie (`travelAgent.js`) to Gemini / OpenAI API with function calling while preserving fallback deterministic rules.

---

## 23. SAFE MODIFICATION GUIDELINES

To ensure multiple developers or AI agents can collaborate on this codebase without introducing breaking regressions, adhere to the following architectural constraints:

1. **Do NOT Change Ticket Object Schema:**
   * Both `PaymentPage.jsx` and `travelAgent.js` commit booking tickets to `localStorage.getItem('lastTicket')`.
   * `ETicket.jsx` and `ContactUs.jsx` rely strictly on this exact object structure (`ticketId`, `route`, `name`, `type`, `date`, `time`, `totalFare`, `seats`, `passenger: { fullName, mobile, email, aadhaar }`, `passengers: [...]`).
   * Modifying field names will break ticket rendering and PDF generation in `ETicket.jsx`.
2. **Do NOT Alter State Names in `travelAgent.js`:**
   * State names (`IDLE`, `COLLECTING_INFORMATION`, `WAITING_FOR_BUS_SELECTION`, `BUS_SELECTED`, `WAITING_FOR_SEAT_SELECTION`, `WAITING_FOR_BOOKING_CONFIRMATION`, `COLLECTING_PASSENGER_INFO`, `BOOKING_SUMMARY`, `BOOKING`, `CONFIRMED`) are tightly coupled between `travelAgent.js` and `ChatModal.jsx`.
3. **Preserve Atomic Seat Checking Logic:**
   * `seatService.validateAndHoldSeats` and `agentTools.hold_select_seats` enforce atomic rejection if any seat is unavailable. Do not weaken this to partial selection without updating conversational fallback messages.
4. **CSS Modules Isolation:**
   * Styling is scoped via `*.module.css`. Modifying class names in CSS files requires updating the corresponding JSX `styles.className` references.
5. **Keep Demo Credentials Accessible:**
   * Maintain `demo@goticket.in` / `demo123` in `authService.js` and `Login.jsx` for testing and reviewer convenience.

---

## AI HANDOFF SUMMARY

### 1. What exactly is GoTicket?
GoTicket is a comprehensive Indian intercity bus reservation and tracking web application featuring an interactive seat selection map, multi-step passenger verification with simulated mobile OTPs, dynamic coupon discounting, simulated payment checkout, instant digital E-Ticket generation, OpenStreetMap GPS tracking simulation, and a full-featured conversational AI travel concierge ("Tixie").

### 2. What currently works?
* Homepage search with 50+ Indian city autocomplete suggestions and date validation.
* Route search querying mock bus fleet with AM/PM time filters, amenities, and ratings.
* 40-seat interactive bus visualizer with sold seat locks and real-time total fare tallying.
* Boarding and dropping point selection.
* Multi-passenger detail entry with individual simulated 6-digit OTP verification and Aadhaar validation.
* Coupon discount application (`FIRSTGO`, `GTWEEKEND`, `UPIPAY`).
* Checkout simulation with UPI ID and Card forms.
* E-Ticket portal with QR code display, printable layout, and OTP-based mobile lookup.
* Live bus tracking with animated vehicle marker on OpenStreetMap and Haversine distance calculator.
* Multi-turn conversational AI travel concierge ("Tixie") capable of searching routes, selecting buses, atomically validating seats, collecting passenger info sequentially, and finalizing bookings.
* Client-side user authentication (Login, Signup, Logout, Demo credentials).

### 3. What currently doesn't work?
* No persistent backend database (all bookings, users, and seats reset upon clearing browser `localStorage`).
* Real-time multi-device seat synchronization is not possible without a backend server.
* The 6 legal/policy files in `src/pages/Infogo-ticket/` are empty 0-byte stubs.
* No actual SMS, Email, or WhatsApp messages are transmitted over the cellular/SMTP network (simulated in-browser/console).
* Real GPS coordinates are not ingested (simulated via static waypoints and `setInterval`).

### 4. What technologies are actually used?
* **Frontend:** React 19.1.1, React DOM 19.1.1, React Router DOM 7.8.2, CSS Modules, Create React App.
* **Mapping:** OpenStreetMap embed iframe + HTML5 Geolocation API.
* **AI/NLU:** Custom client-side deterministic regex/rule parser and state machine in JavaScript.
* **Build/Deploy:** Vercel static hosting (`vercel.json`).

### 5. What storage is actually used?
* Browser `localStorage` (keys: `lastTicket`, `registeredUsers`, `authUser`, `userName`, `userEmail`, `userMobile`, `authToken`, `appliedCoupon`).
* In-memory JavaScript modules (`mockBuses.js`, `seatService.js`, `LiveTracking.jsx`, `ETicket.jsx`).
* **No SQL or NoSQL database exists.**

### 6. How does booking work?
* **Web UI:** Search → Select Bus → Select Seats → Select Drop/Boarding Points → Enter Passenger Details & Verify Mobile OTP → Apply Promo → Confirm Payment → Ticket object written to `localStorage.lastTicket` → Redirect to Confirmation / E-Ticket.
* **Chatbot:** Conversational query → Route extraction → Bus recommendation scoring → Atomic seat validation → Sequential collection of Name → Email → Mobile → Explicit confirmation gate → Ticket committed to `localStorage.lastTicket`.

### 7. How does the chatbot work?
`ChatModal.jsx` passes user messages and previous context to `processAgentMessage()` in `travelAgent.js`. The agent matches cities and travel intents via regex, ranks buses using `recommendationEngine.js`, validates seat availability atomically via `seatService.js`, prompts for passenger details one field at a time, and creates tickets using `bookingService.js`.

### 8. How does state management work?
* **Global Auth:** React Context API (`AuthContext.jsx`) backed by `authService.js` reading/writing `localStorage`.
* **Page Navigation State:** React Router `location.state` passing selected bus, slot, seats, and boarding data between route hops.
* **Chatbot State:** `agentState` object containing current state enum, search results, selected bus, selected seats, and passenger details.

### 9. How does bus tracking work?
`LiveTracking.jsx` queries a hardcoded `BUS_FLEET` dictionary for the entered registration number. An active timer increments journey progress by `0.3%` every 3 seconds, interpolating latitude and longitude between route waypoints. The coordinates update an OpenStreetMap embed iframe URL and compute the passenger's distance from the bus using the Haversine formula.

### 10. What are the biggest remaining tasks?
1. Populate empty legal/policy stub files in `src/pages/Infogo-ticket/`.
2. Build a real backend API (FastAPI / Express / Flask) to replace client-side mock services.
3. Integrate a persistent database (PostgreSQL / MySQL / MongoDB) for shared seat availability and user management.
4. Implement secure JWT authentication with password hashing on the server.
5. Integrate real payment (Razorpay) and SMS/Email notification APIs.

### 11. What files should be modified for each task?
* **Fixing Stubs/Routes:** `src/pages/Infogo-ticket/*.jsx`, `src/App.js`.
* **Backend API Integration:** `src/services/busService.js`, `src/services/seatService.js`, `src/services/bookingService.js`, `src/services/authService.js`.
* **Chatbot Upgrades:** `src/services/travelAgent.js`, `src/components/Chatbot/ChatModal.jsx`.
* **Live GPS Stream:** `src/pages/aboutgoticket/LiveTracking.jsx`.

### 12. What should NOT be changed because it may break existing functionality?
* The JSON shape of `ticket` in `bookingService.js` and `PaymentPage.jsx` (must maintain identical keys for `ETicket.jsx` to render).
* State enum string constants in `travelAgent.js`.
* The 40-seat label naming convention (`S1` through `S40`).
* CSS Module class mappings in existing component files.

---

```text
This document reflects the codebase as inspected on September 11, 2026.
No implementation changes were made while creating this document.
Any feature marked "Not verified" must be confirmed before being presented as implemented.
```
