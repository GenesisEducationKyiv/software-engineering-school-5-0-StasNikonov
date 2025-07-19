require('dotenv').config();
const cron = require('node-cron');
const weatherEmailService = require('../services/index');

cron.schedule('0 * * * *', async () => {
  console.log('Hourly job started');
  await weatherEmailService.sendEmails('hourly');
});

cron.schedule('0 8 * * *', async () => {
  console.log('Daily job started');
  await weatherEmailService.sendEmails('daily');
});
