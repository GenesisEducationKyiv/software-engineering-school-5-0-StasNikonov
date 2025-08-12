const { v4: uuidv4 } = require('uuid');
const publishToQueue = require('../broker/publishToQueue');

class SubscriptionService {
  constructor(subscriptionRepository, logger, metrics) {
    this.subscriptionRepository = subscriptionRepository;
    this.logger = logger;
    this.metrics = metrics;
  }

  async subscribe({ email, city, frequency }) {
    const timer = this.metrics.startSubscriptionCreateTimer();
    this.logger.info(`Subscribe attempt`);

    const existing = await this.subscriptionRepository.findSubscription(
      email,
      city,
    );
    if (existing) {
      this.metrics.incErrorCreated();

      this.logger.warn(`Subscription already exists`);

      return { status: 409, message: 'Email already exists' };
    }

    const token = uuidv4();
    await this.subscriptionRepository.createSubscription({
      email,
      city,
      frequency,
      token,
    });

    this.logger.info(`Subscription created`);
    timer({ source: 'api' });
    this.metrics.incSuccessCreated();

    await publishToQueue('send_confirmation_email', { email, city, token });

    this.logger.debug(`Published confirmation email task to queue`);

    return {
      status: 200,
      message: 'Subscription successful. Confirmation email sent.',
    };
  }

  async confirm({ token }) {
    const timer = this.metrics.startSubscriptionConfirmTimer();
    this.logger.info(`Confirmation attempt`);

    const subscription = await this.subscriptionRepository.findByToken(token);
    if (!subscription) {
      this.metrics.incErrorConfirmed();

      this.logger.warn(`Token not found`);

      return { status: 404, message: 'Token not found' };
    }

    if (subscription.confirmed) {
      this.metrics.incErrorConfirmed();

      this.logger.warn(`Subscription already confirmed`);

      return { status: 409, message: 'Already confirmed' };
    }

    await this.subscriptionRepository.confirmSubscription(subscription);

    this.logger.info(`Subscription confirmed`);
    timer({ source: 'api' });
    this.metrics.incSuccessConfirmed();

    return { status: 200, message: 'Subscription confirmed successfully' };
  }

  async unsubscribe({ token }) {
    const timer = this.metrics.startSubscriptionUnsubscribeTimer();
    this.logger.info(`Unsubscribe attempt`);

    const subscription = await this.subscriptionRepository.findByToken(token);
    if (!subscription) {
      this.metrics.incErrorUnsubscribed();

      this.logger.warn(`Unsubscribe failed — token not found`);

      return { status: 404, message: 'Token not found' };
    }

    await this.subscriptionRepository.deleteSubscription(subscription);

    this.logger.info(`Unsubscribed successfully`);
    timer({ source: 'api' });
    this.metrics.incSuccessUnsubscribed();

    return { status: 200, message: 'Unsubscribed successfully' };
  }

  async getConfirmedByFrequency(frequency) {
    this.logger.debug(
      `Fetching confirmed subscriptions with frequency=${frequency}`,
    );
    return this.subscriptionRepository.getConfirmedByFrequency(frequency);
  }
}

module.exports = SubscriptionService;
