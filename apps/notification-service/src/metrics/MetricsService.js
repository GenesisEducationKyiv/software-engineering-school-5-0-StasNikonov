const client = require('prom-client');

class MetricsService {
  constructor() {
    this.weatherEmailSuccess = new client.Counter({
      name: 'weather_email_sent_success_total',
      help: 'Total number of successfully sent weather emails',
    });

    this.weatherEmailError = new client.Counter({
      name: 'weather_email_sent_failed_total',
      help: 'Total number of failed weather emails',
    });

    this.confirmationEmailSuccess = new client.Counter({
      name: 'confirmation_email_sent_success_total',
      help: 'Total number of successfully sent confirmation emails',
    });

    this.confirmationEmailError = new client.Counter({
      name: 'confirmation_email_sent_failed_total',
      help: 'Total number of failed confirmation emails',
    });
  }

  incSuccessWeatherEmail() {
    this.weatherEmailSuccess.inc();
  }

  incErrorWeatherEmail() {
    this.weatherEmailError.inc();
  }

  incSuccessConfirmationEmail() {
    this.confirmationEmailSuccess.inc();
  }

  incErrorConfirmationEmail() {
    this.confirmationEmailError.inc();
  }
}

module.exports = new MetricsService();
