const { v4: uuidv4 } = require('uuid');

class SubscriptionService {
  constructor(subscriptionRepository, mailerClient) {
    this.subscriptionRepository = subscriptionRepository;
    this.mailerClient = mailerClient;
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

    await new Promise((resolve, reject) => {
      this.mailerClient.SendConfirmationEmail(
        { email, city, token },
        (err, res) => {
          if (err) {
            console.error('gRPC call failed:', err.message);
            return reject(err);
          }
          console.log('gRPC response:', res);
          resolve(res);
        },
      );
    });

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
