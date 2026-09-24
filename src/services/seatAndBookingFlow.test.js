import { holdSeatsApi, fetchLiveSeatLayout, validateAndHoldSeats } from './seatService';
import { bookTicketApi, getTicketByPnrApi, cancelTicketApi, getBooking } from './bookingService';

describe('Seat Locking & Payment Flow Verification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('holdSeatsApi locks seats and returns hold token without hanging', async () => {
    const tripId = 'TEST_TRIP_AUTO_' + Date.now();
    const seats = ['S15', 'S16'];
    const passenger = { fullName: 'Arun Kumar', mobile: '9876543210' };

    const res = await holdSeatsApi(tripId, seats, passenger);

    expect(res).toBeDefined();
    expect(res.success).toBe(true);
    expect(res.holdToken || res.lockId).toBeTruthy();
    expect(res.lockedSeats || res.seats).toEqual(expect.arrayContaining(['S15', 'S16']));
  });

  test('bookTicketApi confirms booking and produces valid PNR without hanging', async () => {
    const bookingPayload = {
      tripId: 'TEST_TRIP_AUTO_' + Date.now(),
      name: 'KN Speed Express',
      route: 'Kanpur → Lucknow',
      seats: ['S15', 'S16'],
      totalFare: 1198,
      paymentMethod: 'cod',
      passenger: {
        fullName: 'Arun Kumar',
        mobile: '9876543210',
        email: 'arun@example.com'
      },
      boarding: { location: 'Rania Toll Plaza' },
      dropping: { location: 'Transport Nagar Metro' }
    };

    const res = await bookTicketApi(bookingPayload);

    expect(res).toBeDefined();
    expect(res.success).toBe(true);
    expect(res.pnr || res.ticketId).toBeTruthy();

    const pnr = res.pnr || res.ticketId;
    const stored = getBooking(pnr);
    expect(stored).toBeDefined();
    expect(stored.pnr).toBe(pnr);
    expect(stored.status).toBe('CONFIRMED');
  });

  test('getTicketByPnrApi retrieves booking and cancelTicketApi cancels properly', async () => {
    const bookingPayload = {
      tripId: 'TRIP_CANCEL_TEST',
      name: 'Royal Travels',
      seats: ['S20'],
      totalFare: 599,
      passenger: { fullName: 'Priya Sharma', mobile: '9123456789', email: 'priya@example.com' }
    };

    const bookRes = await bookTicketApi(bookingPayload);
    const pnr = bookRes.pnr || bookRes.ticketId;

    // Fetch ticket
    const ticketRes = await getTicketByPnrApi(pnr);
    expect(ticketRes.success).toBe(true);
    expect(ticketRes.ticket).toBeDefined();

    // Cancel ticket
    const cancelRes = await cancelTicketApi(pnr, 'Change of schedule');
    expect(cancelRes.success).toBe(true);

    // Verify cancellation in local store
    const cancelled = getBooking(pnr);
    expect(cancelled.status).toBe('CANCELLED');
  });

  test('validateAndHoldSeats enforces atomic seat locking integrity', () => {
    // Attempting to book already occupied seat S2
    const result = validateAndHoldSeats('UP78KN1234', '2026-09-25', '05:05 PM', ['S1', 'S2']);
    expect(result.success).toBe(false);
    expect(result.atomicityHeld).toBe(false);
    expect(result.unavailableSeats).toContain('S2');

    // Booking valid open seats
    const successResult = validateAndHoldSeats('UP78KN1234', '2026-09-25', '05:05 PM', ['S3', 'S4']);
    expect(successResult.success).toBe(true);
    expect(successResult.atomicityHeld).toBe(true);
    expect(successResult.seats).toEqual(['S3', 'S4']);
  });
});
