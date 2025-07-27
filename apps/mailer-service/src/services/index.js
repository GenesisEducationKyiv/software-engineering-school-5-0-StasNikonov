const WeatherEmailService = require('./WeatherEmailService');
const WeatherClient = require('../clients/weatherClient');
const SubscriptionClient = require('../clients/subscriptionClient');
const EmailAdapter = require('../adapters/EmailAdapter');
const NodemailerProvider = require('../providers/NodemailerProvider');

const emailProvider = new NodemailerProvider();

const emailAdapter = new EmailAdapter(emailProvider);

const weatherEmailService = new WeatherEmailService(
  WeatherClient,
  emailAdapter,
  SubscriptionClient,
);

module.exports = weatherEmailService;
