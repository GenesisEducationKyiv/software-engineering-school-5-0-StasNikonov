const SubscriptionRepository = require('./SubscriptionRepository');
const { Subscription } = require('../../db/models');

const subscriptionRepository = new SubscriptionRepository(Subscription);

module.exports = subscriptionRepository;
