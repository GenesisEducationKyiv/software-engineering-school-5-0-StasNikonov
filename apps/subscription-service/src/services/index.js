const SubscriptionService = require('./SubscriptionService');
const subscriptionRepository = require('../repositories/index');

const mailerClient = require('../clients/mailerClient');

const subscriptionService = new SubscriptionService(
  subscriptionRepository,
  mailerClient,
);

module.exports = subscriptionService;
