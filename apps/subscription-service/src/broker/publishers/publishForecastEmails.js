const publishToQueue = require('../publishToQueue');
const subscriptionService = require('../../services');

const publishForecastEmails = async (frequency, queueName) => {
  const subscribers =
    await subscriptionService.getConfirmedByFrequency(frequency);

  for (let subscriber of subscribers) {
    await publishToQueue(queueName, {
      email: subscriber.email,
      city: subscriber.city,
    });
  }
};

module.exports = publishForecastEmails;
