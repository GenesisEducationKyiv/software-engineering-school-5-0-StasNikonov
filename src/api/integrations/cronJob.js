const cron = require('node-cron');
const WeatherEmailService = require('../services/weatherEmailService');
const WeatherService = require('../services/weatherService');
const EmailAdapter = require('../adapters/EmailAdapter');
const subscriptionRepository = require('../services/subscriptionRepository');

const WeatherAPIProvider = require('../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../providers/OpenWeatherMapProvider');

const weatherAPIProvider = new WeatherAPIProvider();
const openWeatherMapProvider = new OpenWeatherMapProvider();
weatherAPIProvider.setNext(openWeatherMapProvider);

const weatherService = new WeatherService(weatherAPIProvider);

const emailAdapter = new EmailAdapter();

const weatherEmailService = new WeatherEmailService(
  weatherService,
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
