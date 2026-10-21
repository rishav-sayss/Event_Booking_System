const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { validate } = require('../middleware/validate');
const { adminAuth } = require('../middleware/auth');
const { loginRules } = require('../validation/eventValidation');

router.post('/login', loginRules, validate, adminController.login);
router.get('/stats', adminAuth, adminController.stats);

module.exports = router;
