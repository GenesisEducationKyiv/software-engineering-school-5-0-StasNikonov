const formatWeatherResponse = (weather) => ({
  message: `Weather forecast for ${weather.city}`,
  temperature: `${weather.temperature}°C`,
  humidity: `${weather.humidity}%`,
  description: weather.description,
});

module.exports = formatWeatherResponse;
