const emailAdapter = require('../../adapters');
const { getWeather } = require('../../services/weatherService');
const { consumeQueue } = require('../consumeQueue');

function forecastEmailConsumer(channel) {
  consumeQueue(channel, 'send_forecast_email', async ({ email, city }) => {
    const weather = await getWeather(city);
    await emailAdapter.sendWeatherEmail({ email, city }, weather);
  });
}

module.exports = forecastEmailConsumer;
