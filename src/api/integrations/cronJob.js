const cron = require('node-cron');
const db = require('../services/subscriptionRepository');
const {
  sendWeatherEmailToSubscribers,
} = require('../services/weatherEmailService');
const { getWeather } = require('../adapters/weatherAdapter');
const transporter = require('./nodemailerClient');

cron.schedule('0 * * * *', async () => {
  console.log('⏰ Hourly weather update');
  await sendWeatherEmailToSubscribers('hourly', getWeather, transporter, db);
});

cron.schedule('0 8 * * *', async () => {
  console.log('📩 Daily weather update');
  await sendWeatherEmailToSubscribers('daily', getWeather, transporter, db);
});
