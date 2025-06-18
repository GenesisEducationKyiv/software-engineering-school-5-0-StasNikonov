const cron = require('node-cron');
const { sendWeatherEmailToSubscribers } = require('./weatherEmailService');

cron.schedule('0 * * * *', async () => {
  console.log('⏰ Hourly weather update');
  await sendWeatherEmailToSubscribers('hourly');
});

cron.schedule('0 8 * * *', async () => {
  console.log('📩 Daily weather update');
  await sendWeatherEmailToSubscribers('daily');
});
