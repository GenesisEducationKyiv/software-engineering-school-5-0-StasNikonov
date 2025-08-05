const emailAdapter = require('../../adapters');
const { consumeQueue } = require('../consumeQueue');

const confirmationEmailConsumer = (channel) => {
  consumeQueue(channel, 'send_confirmation_email', async (msg) => {
    const { email, city, token } = JSON.parse(msg.content.toString());
    await emailAdapter.sendConfirmationEmail(email, city, token);
  });
};

module.exports = confirmationEmailConsumer;
