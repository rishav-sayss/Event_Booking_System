const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate } = require('../middleware/validate');

const registerRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name must be 2-120 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 8, max: 72 }).withMessage('Password must be at least 8 characters'),
];
const loginRules = [body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 8 })];

router.post('/register', registerRules, validate, userController.register);
router.post('/login', loginRules, validate, userController.login);
module.exports = router;
