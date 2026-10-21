const { getConnection } = require('../config/db');
const { AppError } = require('../middleware/error');
const QRCode = require('qrcode');
const { generateQrPayload } = require('../utils/bookingCode');
const { emitSeatUpdate } = require('../config/socket');

async function createBooking(data) {
  const { event_id, customer_name, customer_email, customer_phone, seats_booked } = data;
  const conn = await getConnection();
  try {
    await conn.beginTransaction();
    const [events] = await conn.query('SELECT * FROM events WHERE id = ? FOR UPDATE', [event_id]);
    if (!events.length) throw new AppError('Event not found', 404);
    const event = events[0];
    if (new Date(event.date) <= new Date()) throw new AppError('Event has already started or passed', 400);
    if (event.available_seats < seats_booked) throw new AppError(`Only ${event.available_seats} seats available`, 409);

    const totalAmount = Number(event.price) * seats_booked;
    const [result] = await conn.query(
      'INSERT INTO bookings (event_id, name, email, mobile, quantity, total_amount, status) VALUES (?,?,?,?,?,?,?)',
      [event_id, customer_name, customer_email, customer_phone || null, seats_booked, totalAmount, 'confirmed']
    );
    await conn.query('UPDATE events SET available_seats = available_seats - ? WHERE id = ?', [seats_booked, event_id]);

    const bookingCode = `BOOKING-${result.insertId}`;
    const qrPayload = generateQrPayload({
      bookingId: result.insertId,
      bookingCode,
      eventId: event_id,
      eventTitle: event.title,
      seats: seats_booked,
      customerEmail: customer_email,
    });
    const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 320 });
    await conn.commit();

    emitSeatUpdate(event_id, { event_id, available_seats: event.available_seats - seats_booked, total_seats: event.total_seats });
    return {
      id: result.insertId,
      booking_code: bookingCode,
      event_id,
      event_title: event.title,
      customer_name,
      customer_email,
      customer_phone: customer_phone || null,
      seats_booked,
      total_amount: totalAmount,
      status: 'confirmed',
      qr_code_data: qrDataUrl,
      created_at: new Date(),
    };
  } catch (err) {
    try { await conn.rollback(); } catch { /* transaction already closed */ }
    throw err;
  } finally { conn.release(); }
}

async function getBookingById(id, email) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(`SELECT b.*, e.title AS event_title, e.location, e.date AS event_date FROM bookings b JOIN events e ON b.event_id = e.id WHERE b.id = ? AND b.email = ?`, [id, email]);
    if (!rows.length) throw new AppError('Booking not found', 404);
    return normalizeBooking(rows[0]);
  } finally { conn.release(); }
}

async function listBookingsByEmail(email) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(`SELECT b.*, e.title AS event_title, e.location, e.date AS event_date FROM bookings b JOIN events e ON b.event_id = e.id WHERE b.email = ? ORDER BY b.booking_date DESC`, [email]);
    return rows.map(normalizeBooking);
  } finally { conn.release(); }
}

function normalizeBooking(row) {
  return { ...row, booking_code: row.booking_code || `BOOKING-${row.id}`, customer_name: row.name, customer_email: row.email, customer_phone: row.mobile, seats_booked: row.quantity, created_at: row.booking_date, total_amount: Number(row.total_amount), venue_name: row.location };
}

module.exports = { createBooking, getBookingById, listBookingsByEmail };
