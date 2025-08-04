const SubscriptionService = require('./SubscriptionService');
const subscriptionRepository = require('../repositories/index');

const subscriptionService = new SubscriptionService(subscriptionRepository);

module.exports = subscriptionService;
