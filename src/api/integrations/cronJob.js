const cron = require('node-cron');
const subscriptionRepository = require('../services/subscriptionRepository');
const WeatherEmailService = require('../services/weatherEmailService');
const WeatherService = require('../services/weatherService');
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
