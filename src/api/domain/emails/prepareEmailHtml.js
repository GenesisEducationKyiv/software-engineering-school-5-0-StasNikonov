const { buildForecastEmail } = require('./buildForecastEmail');
const { BASE_URL } = require('../../../config/config');

const prepareEmailHtml = (subscriber, weather) => {
  const unsubscribeLink = `${BASE_URL}/api/unsubscribe/${subscriber.token}`;
  return buildForecastEmail({
    city: subscriber.city,
    temp_c: weather.temperature,
    humidity: weather.humidity,
    condition: weather.description,
    unsubscribeLink,
  });
};

module.exports = { prepareEmailHtml };
