const { buildForecastEmail } = require('../templates/buildForecastEmail');
const url = process.env.BASE_URL;

const prepareEmailHtml = (subscriber, weather) => {
  const unsubscribeLink = `${url}/api/unsubscribe/${subscriber.token}`;
  return buildForecastEmail({
    city: subscriber.city,
    temp_c: weather.temperature,
    humidity: weather.humidity,
    condition: weather.description,
    unsubscribeLink,
  });
};

module.exports = { prepareEmailHtml };
