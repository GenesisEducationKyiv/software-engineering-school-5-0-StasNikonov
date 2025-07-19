const WeatherEmailService = require('./WeatherEmailService');
const WeatherClient = require('../clients/weatherClient');
const SubscriptionClient = require('../clients/subscriptionClient');
const EmailAdapter = require('../adapters/EmailAdapter');

const emailAdapter = new EmailAdapter();

const weatherEmailService = new WeatherEmailService(
  WeatherClient,
  emailAdapter,
  SubscriptionClient,
);

module.exports = weatherEmailService;
