const { Subscription } = require('../../../db/models');

class SubscriptionRepository {
  findSubscription = (email, city) => {
    return Subscription.findOne({ where: { email, city } });
  };
  findByToken = (token) => {
    return Subscription.findOne({ where: { token } });
  };
  getConfirmedByFrequency = (frequency) => {
    return Subscription.findAll({ where: { confirmed: true, frequency } });
  };
  createSubscription = (data) => {
    return Subscription.create(data);
  };
  confirmSubscription = (subscription) => {
    return subscription.update({ confirmed: true });
  };
  deleteSubscription = (subscription) => {
    return subscription.destroy();
  };
}

module.exports = SubscriptionRepository;
