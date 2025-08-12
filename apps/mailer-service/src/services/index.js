const WeatherEmailService = require('./WeatherEmailService');
const WeatherClient = require('../clients/weatherClient');
const SubscriptionClient = require('../clients/subscriptionClient');
const emailAdapter = require('../adapters/index');

const weatherEmailService = new WeatherEmailService(
  WeatherClient,
  emailAdapter,
  SubscriptionClient,
);

module.exports = weatherEmailService;
