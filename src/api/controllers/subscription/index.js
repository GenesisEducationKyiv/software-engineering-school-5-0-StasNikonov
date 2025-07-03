const SubscriptionController = require('./SubscriptionController');
const subscriptionService = require('../../services/subscription/index');

const subscriptionController = new SubscriptionController(subscriptionService);

module.exports = subscriptionController;
