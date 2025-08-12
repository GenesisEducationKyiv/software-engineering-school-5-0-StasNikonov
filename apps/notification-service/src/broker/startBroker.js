const connectRabbit = require('./connectRabbit');
const forecastEmailConsumer = require('./consumers/forecastEmailConsumer');
const confirmationEmailConsumer = require('./consumers/confirmationEmailConsumer');

async function startBroker() {
  const channel = await connectRabbit();

  forecastEmailConsumer(channel);
  confirmationEmailConsumer(channel);
}

module.exports = startBroker;
