require('dotenv').config();
const cron = require('node-cron');
const publishForecastEmails = require('../broker/publishers/publishForecastEmails');
const logger = require('../../../shared/logger/index');

cron.schedule('0 * * * *', async () => {
  logger.info('Hourly job started');
  await publishForecastEmails('hourly', 'send_forecast_email');
});

cron.schedule('0 8 * * *', async () => {
  logger.info('Daily job started');
  await publishForecastEmails('daily', 'send_forecast_email');
});
