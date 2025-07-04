const cron = require('node-cron');
const CronWeatherHandler = require('./CronWeatherHandler');

const subscriptionRepository = require('../../services/subscription/SubscriptionRepository');
const WeatherService = require('../../services/weather/index');
const EmailAdapter = require('../../adapters/EmailAdapter');
const WeatherEmailService = require('../../services/WeatherEmailService');

const emailAdapter = new EmailAdapter();
const weatherEmailService = new WeatherEmailService(
  WeatherService,
  emailAdapter,
  subscriptionRepository,
);

const cronHandler = new CronWeatherHandler(weatherEmailService);

cron.schedule('0 * * * *', cronHandler.runHourly);
cron.schedule('0 8 * * *', cronHandler.runDaily);
