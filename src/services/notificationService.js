// GoTicket Notification Service
// Demo-mode abstraction for email and SMS delivery.
// NEVER hardcodes API keys or SMTP credentials — all delivery is simulated in the browser.
// Returns { attempted, success, mode } — never falsely claims delivery succeeded.
// Replace internals only when a real backend API is wired up.

/**
 * Masks an email for display e.g. "aniket@gmail.com" => "an***@gmail.com"
 */
export const maskEmail = (email = '') => {
  const parts = email.split('@');
  if (parts.length < 2 || parts[0].length <= 2) return email;
  return parts[0].slice(0, 2) + '***@' + parts[1];
};

/**
 * Masks a mobile number e.g. "9876543210" => "••••••3210"
 */
export const maskMobile = (mobile = '') => {
  const clean = mobile.replace(/\D/g, '');
  if (clean.length < 4) return mobile;
  return '\u2022'.repeat(clean.length - 4) + clean.slice(-4);
};

/**
 * Simulates sending a ticket confirmation email (demo mode).
 * @param {{ email: string, ticket: Object }} opts
 * @returns {Promise<{ attempted: boolean, success: boolean, mode: string, preview?: string }>}
 */
export const sendTicketEmail = async ({ email, ticket }) => {
  if (!email || !ticket) {
    return { attempted: false, success: false, mode: 'demo', error: 'Email or ticket missing.' };
  }
  try {
    const preview = [
      '--- GoTicket Booking Confirmation ---',
      `Ticket ID   : ${ticket.ticketId}`,
      `Passenger   : ${ticket.passenger?.fullName || '---'}`,
      `Route       : ${ticket.route}`,
      `Bus         : ${ticket.name} (${ticket.type})`,
      `Date        : ${ticket.date}`,
      `Departure   : ${ticket.time}`,
      `Seats       : ${(ticket.seats || []).join(', ')}`,
      `Total Fare  : Rs.${ticket.totalFare}`,
      `Booked At   : ${ticket.bookedAt}`,
      '--- Demo Notification Generated ---',
      `(In production this email would be sent to ${email} via a secure backend API)`
    ].join('\n');

    console.info('[GoTicket] Demo email preview for:', email);
    console.info(preview);
    await new Promise((r) => setTimeout(r, 400));
    return { attempted: true, success: true, mode: 'demo', preview };
  } catch (err) {
    return { attempted: true, success: false, mode: 'demo', error: err.message };
  }
};

/**
 * Simulates sending an SMS/WhatsApp ticket notification (demo mode).
 * @param {{ mobile: string, ticket: Object }} opts
 * @returns {Promise<{ attempted: boolean, success: boolean, mode: string, preview?: string }>}
 */
export const sendTicketSMS = async ({ mobile, ticket }) => {
  if (!mobile || !ticket) {
    return { attempted: false, success: false, mode: 'demo', error: 'Mobile or ticket missing.' };
  }
  try {
    const preview = `GoTicket: Booking Confirmed! Ticket ${ticket.ticketId} | ${ticket.name} | ${ticket.route} | ${ticket.date} ${ticket.time} | Seats: ${(ticket.seats || []).join(', ')} | Rs.${ticket.totalFare} [Demo - not sent to ${mobile}]`;

    console.info('[GoTicket] Demo SMS preview for:', mobile);
    console.info(preview);
    await new Promise((r) => setTimeout(r, 300));
    return { attempted: true, success: true, mode: 'demo', preview };
  } catch (err) {
    return { attempted: true, success: false, mode: 'demo', error: err.message };
  }
};
