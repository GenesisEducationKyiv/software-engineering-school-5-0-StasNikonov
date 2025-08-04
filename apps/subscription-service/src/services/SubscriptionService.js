const { v4: uuidv4 } = require('uuid');
const { publishToQueue } = require('../broker/publishToQueue');

class SubscriptionService {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async subscribe({ email, city, frequency }) {
    const existing = await this.subscriptionRepository.findSubscription(
      email,
      city,
    );
    if (existing) return { status: 409, message: 'Email already exists' };

    const token = uuidv4();
    await this.subscriptionRepository.createSubscription({
      email,
      city,
      frequency,
      token,
    });

    publishToQueue('send_confirmation_email', { email, city, token });

    return {
      status: 200,
      message: 'Subscription successful. Confirmation email sent.',
    };
  }

  async confirm({ token }) {
    const subscription = await this.subscriptionRepository.findByToken(token);
    if (!subscription) return { status: 404, message: 'Token not found' };
    if (subscription.confirmed)
      return { status: 409, message: 'Already confirmed' };

    await this.subscriptionRepository.confirmSubscription(subscription);
    return { status: 200, message: 'Subscription confirmed successfully' };
  }

  async unsubscribe({ token }) {
    const subscription = await this.subscriptionRepository.findByToken(token);
    if (!subscription) return { status: 404, message: 'Token not found' };

    await this.subscriptionRepository.deleteSubscription(subscription);
    return { status: 200, message: 'Unsubscribed successfully' };
  }

  async getConfirmedByFrequency(frequency) {
    return this.subscriptionRepository.getConfirmedByFrequency(frequency);
  }
}

module.exports = SubscriptionService;
