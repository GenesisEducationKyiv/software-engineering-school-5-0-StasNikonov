const SubscriptionService = require('./SubscriptionService');
const subscriptionRepository = require('./SubscriptionRepository');
const EmailAdapter = require('../../adapters/EmailAdapter');

const emailAdapter = new EmailAdapter();

const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  emailAdapter,
);

module.exports = { subscriptionService };
