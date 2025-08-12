const emailAdapter = require('../../adapters');
const { consumeQueue } = require('../consumeQueue');

const confirmationEmailConsumer = (channel) => {
  consumeQueue(channel, 'send_confirmation_email', async (data) => {
    const { email, city, token } = data;
    await emailAdapter.sendConfirmationEmail(email, city, token);
  });
};

module.exports = confirmationEmailConsumer;
