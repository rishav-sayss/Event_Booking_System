const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { AppError } = require('../middleware/error');
const { signAdminToken } = require('../middleware/auth');

async function login(email, password) {
  const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
  if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) throw new AppError('Invalid credentials', 401);
  const admin = rows[0];
  return { token: signAdminToken(admin), admin: { id: admin.id, name: admin.name, email: admin.email } };
}

async function getStats() {
  const [[events]] = await pool.query('SELECT COUNT(*) AS total FROM events');
  const [[bookings]] = await pool.query("SELECT COUNT(*) AS total FROM bookings WHERE status = 'confirmed'");
  const [[revenue]] = await pool.query("SELECT COALESCE(SUM(total_amount), 0) AS total FROM bookings WHERE status = 'confirmed'");
  const [[seats]] = await pool.query("SELECT COALESCE(SUM(quantity), 0) AS total FROM bookings WHERE status = 'confirmed'");
  const [recentBookings] = await pool.query(`SELECT b.id, b.id AS booking_code, b.name AS customer_name, b.email AS customer_email, b.quantity AS seats_booked, b.total_amount, b.status, b.booking_date AS created_at, e.title AS event_title FROM bookings b JOIN events e ON b.event_id = e.id ORDER BY b.booking_date DESC LIMIT 10`);
  return { events: Number(events.total), bookings: Number(bookings.total), revenue: Number(revenue.total), seatsSold: Number(seats.total), recentBookings };
}
module.exports = { login, getStats };
