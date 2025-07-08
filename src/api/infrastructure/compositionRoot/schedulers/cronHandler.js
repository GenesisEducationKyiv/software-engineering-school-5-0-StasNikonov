const cron = require('node-cron');
const CronWeatherHandler = require('../../../presentation/controllers/cron/CronWeatherHandler');

const subscriptionRepository = require('../../repositories/SubscriptionRepository');
const WeatherService = require('../services/weatherService');
const EmailAdapter = require('../../adapters/EmailAdapter');
const WeatherEmailService = require('../../../application/services/email/WeatherEmailService');

const emailAdapter = new EmailAdapter();
const weatherEmailService = new WeatherEmailService(
  WeatherService,
  emailAdapter,
  subscriptionRepository,
);

const cronHandler = new CronWeatherHandler(weatherEmailService);

cron.schedule('0 * * * *', cronHandler.runHourly);
cron.schedule('0 8 * * *', cronHandler.runDaily);
