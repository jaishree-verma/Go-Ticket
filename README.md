# GoTicket

GoTicket is a modern bus ticket reservation and transport management web application built using React and CSS Modules. It offers users an intuitive booking experience with route searching, seat layout selection, live bus tracking, e-ticket generation, and promotional gift voucher management.

## Overview

The platform simplifies intercity travel booking through an integrated search widget, route filters, interactive seat selection grids, and automated checkout processing.

## Core Features

- Search Widget - Single-row transport search bar supporting source city filtering, destination city selection, and date pickers with city selection dropdowns for major Indian routes.
- Seat Selection Engine - Interactive bus layout rendering lower and upper sleeper berths, seater arrangements, gender-specific pricing indicators, and real-time total fare calculations.
- Live Bus Tracking - Route status tracking with visual timeline checkpoints, vehicle movement metrics, estimated arrival times, and driver contact details.
- E-Ticket Generation - Digital ticket confirmation with downloadable pass summaries, QR verification codes, boarding point guidelines, and cancellation policies.
- Offers and Gift Vouchers - Interactive promotion section offering instant discounts, cashbacks, and automated coupon application during checkout.
- Authentication - Integrated login and user signup modal supporting local session persistence.

## Tech Stack

- Frontend Framework - React 18
- Routing - React Router DOM v6
- Styling - CSS Modules with custom design tokens
- Icons - Standard Unicode typography
- State Management - React Context API and Local Storage

## Getting Started

### Prerequisites

Ensure Node.js (v16.0 or higher) and npm are installed on your machine.

### Installation

1. Clone the repository:
   git clone https://github.com/jaishree-verma/go-ticket.git

2. Navigate into the project directory:
   cd go-ticket

3. Install project dependencies:
   npm install

4. Start the development server:
   npm start

5. Open your browser and navigate to:
   http://localhost:3000

## Available Scripts

In the project directory, you can execute:

- `npm start` - Runs the application in development mode.
- `npm run build` - Builds the optimized production bundle in the `build` folder.
- `npm test` - Executes the test runner in interactive watch mode.

## Project Structure

```
go-ticket/
├── public/
│   └── images/          - Static assets and bus fleet banner media
├── src/
│   ├── components/      - Core UI components (Header, Hero, BookingSection, OffersSection, TrackBus, Chatbot)
│   ├── pages/           - Application view pages (SeatBooking, DropPage, PaymentPage)
│   ├── styles/          - Component-level CSS module stylesheets
│   ├── stylespages/     - Page-level CSS module stylesheets
│   ├── App.js           - Application routing layout definition
│   └── index.js         - React DOM entry point
└── package.json         - Dependency definitions and project scripts
```

## License

This project is open source and available under the MIT License.
