class ISubscriptionRepository {
  findSubscription(_email, _city) {
    throw new Error('Method findSubscription() must be implemented');
  }

  findByToken(_token) {
    throw new Error('Method findByToken() must be implemented');
  }

  getConfirmedByFrequency(_frequency) {
    throw new Error('Method getConfirmedByFrequency() must be implemented');
  }

  createSubscription(_data) {
    throw new Error('Method createSubscription() must be implemented');
  }

  confirmSubscription(_subscription) {
    throw new Error('Method confirmSubscription() must be implemented');
  }

  deleteSubscription(_subscription) {
    throw new Error('Method deleteSubscription() must be implemented');
  }
}

module.exports = ISubscriptionRepository;
