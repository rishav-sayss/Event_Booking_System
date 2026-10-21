const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { validate } = require('../middleware/validate');
const { adminAuth } = require('../middleware/auth');
const { createEventRules, updateEventRules } = require('../validation/eventValidation');

router.get('/', eventController.list);
router.get('/categories', eventController.categories);
router.get('/cities', eventController.cities);
router.get('/:id', eventController.detail);

router.post('/', adminAuth, createEventRules, validate, eventController.create);
router.put('/:id', adminAuth, updateEventRules, validate, eventController.update);
router.delete('/:id', adminAuth, eventController.remove);

module.exports = router;
