const cron = require('node-cron');
const subscriptionRepository = require('../services/subscription/SubscriptionRepository');
const WeatherEmailService = require('../services/WeatherEmailService');
const WeatherService = require('../services/weather/WeatherService');
const emailAdapter = require('../adapters/EmailAdapter');

const weatherEmailService = new WeatherEmailService(
  WeatherService,
  emailAdapter,
  subscriptionRepository,
);

cron.schedule('0 * * * *', async () => {
  console.log('⏰ Hourly weather update');
  await weatherEmailService.sendEmails('hourly');
});

cron.schedule('0 8 * * *', async () => {
  console.log('📩 Daily weather update');
  await weatherEmailService.sendEmails('daily');
});
