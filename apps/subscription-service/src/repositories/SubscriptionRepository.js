const ISubscriptionRepository = require('./ISubscriptionRepository');

class SubscriptionRepository extends ISubscriptionRepository {
  constructor(SubscriptionModel) {
    super();
    this.Subscription = SubscriptionModel;
  }

  findSubscription = (email, city) => {
    return this.Subscription.findOne({ where: { email, city } });
  };
  findByToken = (token) => {
    return this.Subscription.findOne({ where: { token } });
  };
  getConfirmedByFrequency = (frequency) => {
    return this.Subscription.findAll({ where: { confirmed: true, frequency } });
  };
  createSubscription = (data) => {
    return this.Subscription.create(data);
  };
  confirmSubscription = (subscription) => {
    return subscription.update({ confirmed: true });
  };
  deleteSubscription = (subscription) => {
    return subscription.destroy();
  };
}

module.exports = SubscriptionRepository;
