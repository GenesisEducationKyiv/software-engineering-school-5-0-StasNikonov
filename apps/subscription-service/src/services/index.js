const SubscriptionService = require('./SubscriptionService');
const subscriptionRepository = require('../repositories/index');
const logger = require('../../../shared/logger/index');

const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  logger,
);

module.exports = subscriptionService;
