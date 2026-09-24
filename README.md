# GoTicket — Anti-Gravity Intercity Bus Reservation Platform

## Project Overview
GoTicket is an intelligent intercity bus reservation platform that unifies real-time route discovery, interactive seat locking, and live telemetry tracking into a single web application. Travelers can complete reservations manually through an intuitive web interface or converse directly with "Tixie," an autonomous AI travel agent that validates seats, enforces booking constraints, and confirms tickets.

---

## Workflow Flowchart

```mermaid
graph TD
    Start(["Start Journey"]) --> Step1["Step 1: Search & Route Discovery"]
    Step1 --> Step2["Step 2: Bus Selection & Ranking"]
    Step2 --> Step3["Step 3: Interactive Seat Selection & Locking"]
    Step3 --> Step4["Step 4: Boarding & Dropping Point Selection"]
    Step4 --> Step5["Step 5: Passenger Information & Identity Verification"]
    Step5 --> Step6["Step 6: Payment Processing & Promo Code Application"]
    Step6 --> Step7["Step 7: Ticket Confirmation & Digital QR Pass Generation"]
    Step7 --> Step8["Step 8: Live Telemetry & GPS Vehicle Tracking"]
    Step8 --> Complete(["Booking Complete & Monitored"])

    %% Conversational AI Parallel Route
    subgraph Autonomous_Agent ["Autonomous AI Agent Option (Tixie)"]
        ChatStart(["Open Tixie Chatbot"]) --> AgentStep["Natural Language Multi-Turn Goal Intent"]
        AgentStep --> Step3
    end
```

---

## Tixie AI Agent Workflows & Flowcharts

### 1. Multi-Turn Conversational State Machine (`travelAgent.js`)
Demonstrates how Tixie handles the conversational lifecycle, collects required travel parameters, gracefully adapts to midway user changes, and enforces validation gates.

```mermaid
graph TD
    S1["Step 1: IDLE / User Message Ingested"] --> S2{"Step 2: Are Mandatory Parameters Complete?"}
    S2 -- "Missing Route, Date, or Count" --> S3["Step 3: State COLLECTING_INFORMATION<br/>Prompt for Specific Missing Entity"]
    S3 --> S1
    S2 -- "Source, Destination, Date & Count Present" --> S4["Step 4: Execute 5-Factor Ranking Search<br/>State WAITING_FOR_BUS_SELECTION"]
    
    S4 --> S5{"Step 5: Bus Option Selected?"}
    S5 -- "Picks Option 1, Lowest Price, or Name" --> S6["Step 6: Display Interactive Seat Grid<br/>State WAITING_FOR_SEAT_SELECTION"]
    
    S6 --> S7{"Step 7: Seat Selection Validated?"}
    S7 -- "Partial Seat Count e.g. 1 of 2 seats" --> S8["Step 8: Retain Partial Hold<br/>Prompt for Remaining Seat"]
    S8 --> S6
    S7 -- "Seats Match Passenger Count Exactly" --> S9["Step 9: State COLLECTING_PASSENGER_INFO<br/>Collect Full Name, Phone, Email"]
    
    S9 --> S10["Step 10: Compile Itemized BOOKING_SUMMARY"]
    S10 --> S11{"Step 11: Explicit Confirmation Gate"}
    S11 -- "Question, Maybe, or Casual Chat" --> S12["Step 12: Maintain Summary State<br/>Answer Question & Re-prompt Confirmation"]
    S12 --> S10
    S11 -- "Inline Edit e.g. Change Seat to S5" --> S13["Step 13: Update Specific Entity<br/>Recalculate Summary"]
    S13 --> S10
    S11 -- "Route or Date Changed Midway" --> S14["Step 14: Invalidate Previous Search & Seats<br/>Restart Search for New Route"]
    S14 --> S4
    S11 -- "Explicit Approval e.g. Yes confirm / Book it" --> S15["Step 15: State PAYMENT_PENDING<br/>Secure Handoff to /payment"]
    S15 --> S16["Step 16: User Finalizes Payment -> State CONFIRMED"]
```

### 2. NLU Intent Classification & Entity Extraction Pipeline (`nluService.js`)
Illustrates how Tixie cleans raw user text, identifies user intent, extracts travel entities, and manages dialogue context across conversational turns.

```mermaid
graph TD
    N1["Step 1: Raw Natural Language Input"] --> N2["Step 2: Sanitization & Alias Normalization<br/>Maps BOM to Mumbai, BLR to Bangalore"]
    N2 --> N3["Step 3: Multi-Intent Pattern Scoring<br/>SEARCH_BUSES, SELECT_SEAT, PROVIDE_INFO, CONFIRM, CANCEL"]
    N3 --> N4["Step 4: Specialized Entity Extractors"]
    
    subgraph Extractors ["Entity Extraction Engine"]
        E1["Origin & Destination Cities"]
        E2["Travel Date: Relative or Absolute"]
        E3["Passenger Count: Digits & Words"]
        E4["Filters: Budget, Sleeper, AC, Timing"]
        E5["Seat IDs: S1..S40 Regex Matcher"]
        E6["Passenger Data: Name, 10-Digit Mobile, Email"]
    end
    
    N4 --> Extractors
    Extractors --> N5["Step 5: Context Manager Merge & Diff Evaluation"]
    N5 --> N6{"Step 6: Did Travel Corridor or Date Change?"}
    N6 -- "Yes" --> N7["Step 7: Clear Cached Results & Invalidate Seats"]
    N6 -- "No" --> N8["Step 8: Merge New Entities into Active Session"]
    N7 --> N9["Step 9: Dispatch Structured Request to Agent Tool Handlers"]
    N8 --> N9
```

### 3. Atomic Seat Allocation & Confirmation Gate Architecture (`seatService.js`)
Depicts how Tixie guarantees seat inventory integrity, detects double-booking collisions, suggests adjacent alternatives, and protects travelers from accidental checkout.

```mermaid
graph TD
    A1["Step 1: Traveler Selects Seats via Chat e.g. S3, S4"] --> A2["Step 2: Inspect Live Occupied Map & Active Hold Cache"]
    A2 --> A3{"Step 3: Atomic Collision Check"}
    
    A3 -- "ANY Requested Seat is Occupied" --> A4["Step 4: Atomic Rollback<br/>Reject Full Request Without Partial Allocation"]
    A4 --> A5["Step 5: Locate Adjacent Available Seats e.g. S1 and S2"]
    A5 --> A1
    
    A3 -- "ALL Requested Seats are Open" --> A6{"Step 6: Passenger-to-Seat Ratio Check"}
    A6 -- "Selected Count Exceeds Passenger Count" --> A7["Step 7: Reject Excess Seats with Ratio Guidance"]
    A6 -- "Selected Count Matches Passenger Count" --> A8["Step 8: Issue 10-Minute Atomic Hold Token LCK_..."]
    
    A8 --> A9["Step 9: Render Transparent Booking Overview"]
    A9 --> A10{"Step 10: Confirmation Security Gate"}
    A10 -- "Ambiguous Text e.g. What is the operator? / Ok" --> A11["Step 11: Block Checkout Handoff<br/>Preserve State & Require Affirmative Response"]
    A10 -- "Explicit Affirmative e.g. Confirm Booking / Proceed" --> A12["Step 12: Commit Pending Reservation to Storage"]
    A12 --> A13["Step 13: Forward Booking Payload to /payment Gateway"]
```

---

## Step-by-Step Guide

### Step 1: Search & Route Discovery
* **Description**: The user enters departure city (Source), destination city, travel date, and optional filters (e.g., departure time, bus type, maximum budget).
* **Prerequisites**: Source and destination cities selected from supported corridors (50+ Indian cities supported with automated city-alias matching).
* **Expected Output**: A list of verified schedules matching the chosen route and date.

### Step 2: Bus Selection & Ranking
* **Description**: Users view available services sorted by departure time, fare, or operator rating. An intelligent 5-factor scoring engine highlights the recommended best option based on price, timing, and travel duration.
* **Prerequisites**: Valid route results retrieved from Step 1.
* **Expected Output**: One bus schedule selected with verified operator details, bus category (AC Sleeper, Volvo Multi-Axle, AC Seater), and base fare.

### Step 3: Interactive Seat Selection & Locking
* **Description**: An interactive 40-seat bus layout (2 Left + Aisle + 2 Right) allows travelers to click and select open seats. The system executes an atomic hold request to lock seats for 10 minutes, preventing double-booking.
* **Prerequisites**: Minimum of 1 available (unsold) seat chosen.
* **Expected Output**: Selected seats highlighted with calculated subtotal and an active seat hold token (`LCK_...`).

### Step 4: Boarding & Dropping Point Selection
* **Description**: Travelers designate exact pickup stops and final destination drop-off points along the travel corridor, complete with local landmark addresses and scheduled stop times.
* **Prerequisites**: Successful seat hold from Step 3.
* **Expected Output**: Selected pickup and drop locations saved to the active booking payload.

### Step 5: Passenger Information & Identity Verification
* **Description**: The traveler provides primary and co-passenger details including full name, age, gender, contact phone number, email address, and masked Aadhaar proof for security compliance.
* **Prerequisites**: Boarding points confirmed from Step 4.
* **Expected Output**: Validated passenger profiles attached to the pending reservation record.

### Step 6: Payment Processing & Promo Code Application
* **Description**: The checkout screen presents an itemized fare breakdown. Users can apply instant discount coupons (such as `FIRSTGO` or `UPIPAY`) and select a preferred payment method (UPI, Debit/Credit Card, or Cash on Board).
* **Prerequisites**: Valid passenger information from Step 5.
* **Expected Output**: Total fare recomputed with any applied discount, followed by payment validation.

### Step 7: Ticket Confirmation & Digital QR Pass Generation
* **Description**: Upon payment confirmation, the system creates a verified reservation, generates a unique PNR (`GTXXXXXX`), stores the record in persistent storage, and displays a printable digital pass featuring a scannable QR boarding pass.
* **Prerequisites**: Successful payment or cash reservation selection from Step 6.
* **Expected Output**: Confirmation screen presenting the confirmed PNR, passenger manifest, route details, and links to download PDF passes or view the E-Ticket.

### Step 8: Live Telemetry & GPS Vehicle Tracking
* **Description**: Travelers can track their allocated bus on an embedded interactive OpenStreetMap interface showing live vehicle GPS coordinates, estimated speed, route waypoints, and distance to destination using the Haversine formula.
* **Prerequisites**: Confirmed PNR or valid bus registration number from Step 7.
* **Expected Output**: Live telemetry map displaying real-time bus position and route progress checkpoints.

---

## Quick Start

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18.0 or higher)
* **npm** (v9.0 or higher)

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/jaishree-verma/Go-Ticket.git
cd Go-Ticket
npm install
```

### 3. Environment Configuration
Verify your local environment file (`.env`):
```env
PORT=5001
BACKEND_PORT=5002
BACKEND_URL=http://localhost:5002
```

### 4. Run the Application
Start the frontend development server and backend proxy:

```bash
# Terminal 1: Start the backend API proxy (runs on port 5002)
node server/server.js

# Terminal 2: Start the React frontend application (runs on port 5001)
npm run dev
```

Open [http://localhost:5001](http://localhost:5001) in your browser.

### 5. Running the Test Suites
Run unit, seat-locking, and conversational workflow integration tests:

```bash
# Run seat locking and payment validation integration test
npm test -- src/services/seatAndBookingFlow.test.js

# Run the 12-scenario conversational AI test suite
npm run test:workflow
```

---

## License
This project is open-source and available under the [MIT License](LICENSE).
