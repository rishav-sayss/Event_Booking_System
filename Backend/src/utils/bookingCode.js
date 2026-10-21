const crypto = require('crypto');

function generateBookingCode() {
  const raw = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `EVB-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 16)}`;
}

function generateQrPayload({ bookingId, bookingCode, eventId, eventTitle, seats, customerEmail }) {
  return JSON.stringify({
    id: bookingId,
    code: bookingCode,
    eventId,
    event: eventTitle,
    seats,
    email: customerEmail,
    issuedAt: new Date().toISOString(),
  });
}

module.exports = { generateBookingCode, generateQrPayload };
