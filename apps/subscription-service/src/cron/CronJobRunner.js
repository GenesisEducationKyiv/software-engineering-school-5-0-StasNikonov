require('dotenv').config();
const cron = require('node-cron');
const publishForecastEmails = require('../broker/publishers/publishForecastEmails');

cron.schedule('0 * * * *', async () => {
  console.log('Hourly job started');
  await publishForecastEmails('hourly', 'send_forecast_email');
});

cron.schedule('0 8 * * *', async () => {
  console.log('Daily job started');
  await publishForecastEmails('daily', 'send_forecast_email');
});
