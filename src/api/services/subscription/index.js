const SubscriptionService = require('./SubscriptionService');
const SubscriptionRepository = require('./SubscriptionRepository');
const subscriptionRepository = new SubscriptionRepository();

const EmailAdapter = require('../../adapters/EmailAdapter');

const emailAdapter = new EmailAdapter();

const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  emailAdapter,
);

module.exports = subscriptionService;
