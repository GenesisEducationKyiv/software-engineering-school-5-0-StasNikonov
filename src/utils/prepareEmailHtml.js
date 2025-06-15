const { forecastEmail } = require('./forecastTemplates');

const prepareEmailHtml = (subscriber, weather) => {
  const unsubscribeLink = `${process.env.BASE_URL}/api/unsubscribe/${subscriber.token}`;
  return forecastEmail({
    city: subscriber.city,
    temp_c: weather.temperature,
    humidity: weather.humidity,
    condition: weather.description,
    unsubscribeLink,
  });
};

module.exports = { prepareEmailHtml };
