const SubscriptionService = require('./SubscriptionService');
const SubscriptionRepository = require('../repositories/SubscriptionRepository');
const subscriptionRepository = new SubscriptionRepository();

const mailerClient = require('../clients/mailerClient');

const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  mailerClient,
);

module.exports = subscriptionService;
