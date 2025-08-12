/**
<<<<<<<< HEAD:apps/subscription-service/src/repositories/ISubscriptionRepository.js
 * @typedef {import('../../db/models/subscription').Subscription} Subscription
========
 * @typedef {import('../../../../db/models/subscription').Subscription} Subscription
>>>>>>>> hw8-service-communication:src/api/domain/interfaces/repositories/ISubscriptionRepository.js
 */

/**
 * @interface
 */
class ISubscriptionRepository {
  /**
   * @param {string} _email
   * @param {string} _city
   * @returns {Promise<Subscription|null>}
   */
  findSubscription(_email, _city) {
    throw new Error('Method findSubscription() must be implemented');
  }

  /**
   * @param {string} _token
   * @returns {Promise<Subscription|null>}
   */
  findByToken(_token) {
    throw new Error('Method findByToken() must be implemented');
  }

  /**
   * @param {string} _frequency
   * @returns {Promise<Subscription[]>}
   */
  getConfirmedByFrequency(_frequency) {
    throw new Error('Method getConfirmedByFrequency() must be implemented');
  }

  /**
   * @param {{ email: string, city: string, token: string, frequency: 'daily' | 'hourly' }} _data
   * @returns {Promise<Subscription>}
   */
  createSubscription(_data) {
    throw new Error('Method createSubscription() must be implemented');
  }

  /**
   * @param {Subscription} _subscription
   * @returns {Promise<Subscription>}
   */
  confirmSubscription(_subscription) {
    throw new Error('Method confirmSubscription() must be implemented');
  }

  /**
   * @param {Subscription} _subscription
   * @returns {Promise<void>}
   */
  deleteSubscription(_subscription) {
    throw new Error('Method deleteSubscription() must be implemented');
  }
}

module.exports = ISubscriptionRepository;
