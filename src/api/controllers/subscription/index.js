const SubscriptionController = require('./SubscriptionController');
const SubscriptionService = require('../../services/subscription/SubscriptionService');
const SubscriptionRepository = require('../../services/subscription/SubscriptionRepository');
const EmailAdapter = require('../../adapters/EmailAdapter');

const subscriptionRepository = new SubscriptionRepository();
const emailAdapter = new EmailAdapter();
const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  emailAdapter,
);

const subscriptionController = new SubscriptionController(subscriptionService);

module.exports = subscriptionController;
