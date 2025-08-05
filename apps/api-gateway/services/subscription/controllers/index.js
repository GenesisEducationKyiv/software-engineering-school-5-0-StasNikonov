const SubscriptionController = require('./SubscriptionController');
const subscriptionClient = require('../clients/subscriptionClient');
const logger = require('shared');

const subscriptionController = new SubscriptionController(
  subscriptionClient,
  logger,
);

module.exports = subscriptionController;
