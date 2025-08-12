const SubscriptionController = require('./SubscriptionController');
const subscriptionClient = require('../clients/subscriptionClient');

const subscriptionController = new SubscriptionController(subscriptionClient);

module.exports = subscriptionController;
