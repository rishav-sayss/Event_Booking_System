const bookingService = require('../services/bookingService');

async function create(req, res, next) {
  try {
    const booking = await bookingService.createBooking({ ...req.body, customer_name: req.user.name, customer_email: req.user.email });
    res.status(201).json({ success: true, data: booking });
  } catch (err) { next(err); }
}

async function detail(req, res, next) {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user.email);
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
}

async function myBookings(req, res, next) {
  try {
    const bookings = await bookingService.listBookingsByEmail(req.user.email);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) { next(err); }
}

module.exports = { create, detail, myBookings };
