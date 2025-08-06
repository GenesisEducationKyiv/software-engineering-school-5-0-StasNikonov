const client = require('prom-client');

class MetricsService {
  constructor() {
    this.subscriptionsCreatedSuccess = new client.Counter({
      name: 'subscriptions_created_success_total',
      help: 'Total number of success created subscriptions',
    });

    this.subscriptionsCreatedError = new client.Counter({
      name: 'subscriptions_created_failed_total',
      help: 'Total number of failed created subscriptions',
    });

    this.subscriptionCreateDuration = new client.Histogram({
      name: 'subscription_create_duration_seconds',
      help: 'Duration of subscription create requests in seconds',
      labelNames: ['source'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    });

    this.subscriptionsConfirmedSuccess = new client.Counter({
      name: 'subscriptions_confirmed_success_total',
      help: 'Total number of success confirmed subscriptions',
    });

    this.subscriptionsConfirmedError = new client.Counter({
      name: 'subscriptions_confirmed_failed_total',
      help: 'Total number of failed confirmed subscriptions',
    });

    this.subscriptionConfirmDuration = new client.Histogram({
      name: 'subscription_confirm_duration_seconds',
      help: 'Duration of subscription confirm requests in seconds',
      labelNames: ['source'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    });

    this.subscriptionsUnsubscribedSuccess = new client.Counter({
      name: 'subscriptions_unsubscribed_success_total',
      help: 'Total number of success unsubscribed subscriptions',
    });

    this.subscriptionsUnsubscribedError = new client.Counter({
      name: 'subscriptions_unsubscribed_failed_total',
      help: 'Total number of failed unsubscribed subscriptions',
    });

    this.subscriptionUnsubscribeDuration = new client.Histogram({
      name: 'subscription_unsubscribe_duration_seconds',
      help: 'Duration of subscription unsubscribe requests in seconds',
      labelNames: ['source'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    });

    this.hourlyJobSuccess = new client.Counter({
      name: 'hourly_job_success_total',
      help: 'Total number of successful hourly jobs',
    });

    this.hourlyJobError = new client.Counter({
      name: 'hourly_job_error_total',
      help: 'Total number of failed hourly jobs',
    });

    this.dailyJobSuccess = new client.Counter({
      name: 'daily_job_success_total',
      help: 'Total number of successful daily jobs',
    });

    this.dailyJobError = new client.Counter({
      name: 'daily_job_error_total',
      help: 'Total number of failed daily jobs',
    });
  }

  incSuccessCreated() {
    this.subscriptionsCreatedSuccess.inc();
  }

  incErrorCreated() {
    this.subscriptionsCreatedError.inc();
  }

  startSubscriptionCreateTimer(labels = {}) {
    return this.subscriptionCreateDuration.startTimer(labels);
  }

  incSuccessConfirmed() {
    this.subscriptionsConfirmedSuccess.inc();
  }

  incErrorConfirmed() {
    this.subscriptionsConfirmedError.inc();
  }

  startSubscriptionConfirmTimer(labels = {}) {
    return this.subscriptionConfirmDuration.startTimer(labels);
  }

  incSuccessUnsubscribed() {
    this.subscriptionsUnsubscribedSuccess.inc();
  }

  incErrorUnsubscribed() {
    this.subscriptionsUnsubscribedError.inc();
  }

  startSubscriptionUnsubscribeTimer(labels = {}) {
    return this.subscriptionUnsubscribeDuration.startTimer(labels);
  }

  incHourlyJobSuccess() {
    this.hourlyJobSuccess.inc();
  }

  incHourlyJobError() {
    this.hourlyJobError.inc();
  }

  incDailyJobSuccess() {
    this.dailyJobSuccess.inc();
  }

  incDailyJobError() {
    this.dailyJobError.inc();
  }
}

module.exports = new MetricsService();
