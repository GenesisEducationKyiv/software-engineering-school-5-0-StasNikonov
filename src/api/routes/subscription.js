const express = require('express');
const router = express.Router();
const subscriptionController = require('../infrastructure/compositionRoot/subscriptionController');
const validateSubscriptionInput = require('../infrastructure/compositionRoot/validateSubscriptionInput');

router.post(
  '/subscribe',
  validateSubscriptionInput,
  subscriptionController.subscribe,
);
router.get('/confirm/:token', subscriptionController.confirm);
router.get('/unsubscribe/:token', subscriptionController.unsubscribe);

module.exports = router;
