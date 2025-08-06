require('dotenv').config();
const cron = require('node-cron');
const publishForecastEmails = require('../broker/publishers/publishForecastEmails');
const logger = require('../../../../shared/logger/index');
const MetricsService = require('../metrics/MetricsService');

cron.schedule('0 * * * *', async () => {
  logger.info('Hourly job started');
  try {
    await publishForecastEmails('hourly', 'send_forecast_email');
    MetricsService.incHourlyJobSuccess();
  } catch (err) {
    logger.error('Hourly job failed', err);
    MetricsService.incHourlyJobError();
  }
});

cron.schedule('0 8 * * *', async () => {
  logger.info('Daily job started');
  try {
    await publishForecastEmails('daily', 'send_forecast_email');
    MetricsService.incDailyJobSuccess();
  } catch (err) {
    logger.error('Hourly job failed', err);
    MetricsService.incDailyJobError();
  }
});
