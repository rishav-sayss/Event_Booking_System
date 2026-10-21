const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validate } = require('../middleware/validate');
const { userAuth } = require('../middleware/auth');
const { createBookingRules } = require('../validation/eventValidation');

router.post('/', userAuth, createBookingRules, validate, bookingController.create);
router.get('/my', userAuth, bookingController.myBookings);
router.get('/:id', userAuth, bookingController.detail);

module.exports = router;
