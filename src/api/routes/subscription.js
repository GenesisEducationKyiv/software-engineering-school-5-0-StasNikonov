const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const {
  validateSubscriptionInput,
} = require('../middlewares/validateSubscriptionInput');

router.post(
  '/subscribe',
  validateSubscriptionInput,
  subscriptionController.subscribeController,
);
router.get('/confirm/:token', subscriptionController.confirmController);
router.get('/unsubscribe/:token', subscriptionController.unsubscribeController);

module.exports = router;
