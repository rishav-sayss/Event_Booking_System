const { body } = require('express-validator');

const createEventRules = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('location').trim().isLength({ min: 3, max: 255 }).withMessage('Location is required'),
  body('address').optional({ values: 'falsy' }).trim().isLength({ max: 255 }),
  body('city').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
  body('area').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
  body('sector').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
  body('latitude').optional({ values: 'falsy' }).isFloat({ min: -90, max: 90 }).toFloat().withMessage('Latitude must be between -90 and 90'),
  body('longitude').optional({ values: 'falsy' }).isFloat({ min: -180, max: 180 }).toFloat().withMessage('Longitude must be between -180 and 180'),
  body('date').isISO8601().withMessage('Valid event date is required'),
  body('price').isFloat({ min: 0 }).toFloat().withMessage('Price must be >= 0'),
  body('total_seats').isInt({ min: 1 }).toInt().withMessage('Total seats must be >= 1'),
  body('img').optional({ values: 'falsy' }).isURL().withMessage('img must be a valid URL'),
];

const updateEventRules = [
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('location').optional().trim().isLength({ min: 3, max: 255 }),
  body('address').optional({ values: 'falsy' }).trim().isLength({ max: 255 }),
  body('city').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
  body('area').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
  body('sector').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
  body('latitude').optional({ values: 'falsy' }).isFloat({ min: -90, max: 90 }).toFloat().withMessage('Latitude must be between -90 and 90'),
  body('longitude').optional({ values: 'falsy' }).isFloat({ min: -180, max: 180 }).toFloat().withMessage('Longitude must be between -180 and 180'),
  body('date').optional().isISO8601(),
  body('price').optional().isFloat({ min: 0 }).toFloat(),
  body('total_seats').optional().isInt({ min: 1 }).toInt(),
  body('img').optional({ values: 'falsy' }).isURL(),
];

const createBookingRules = [
  body('event_id').isInt({ min: 1 }).toInt().withMessage('Valid event_id is required'),
  body('customer_name').trim().isLength({ min: 2, max: 120 }).withMessage('Customer name is required'),
  body('customer_email').isEmail().normalizeEmail().withMessage('Valid customer email is required'),
  body('customer_phone').optional().trim().isLength({ max: 30 }),
  body('seats_booked').isInt({ min: 1, max: 10 }).toInt().withMessage('Seats must be between 1 and 10'),
];

const loginRules = [body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')];
module.exports = { createEventRules, updateEventRules, createBookingRules, loginRules };
