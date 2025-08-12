const SubscriptionService = require('./SubscriptionService');
const subscriptionRepository = require('../repositories/index');
const logger = require('../../../../shared/logger/index');
const metricsService = require('../metrics/MetricsService');

const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  logger,
  metricsService,
);

module.exports = subscriptionService;
