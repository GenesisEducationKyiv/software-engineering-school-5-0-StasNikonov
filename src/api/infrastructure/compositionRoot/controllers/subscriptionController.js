const SubscriptionController = require('../../../presentation/controllers/subscription/SubscriptionController');
const subscriptionService = require('../services/subscriptionService');

const subscriptionController = new SubscriptionController(subscriptionService);

module.exports = subscriptionController;
