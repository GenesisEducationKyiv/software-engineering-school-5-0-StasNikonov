const WeatherAPIProvider = require('../../api/providers/WeatherAPIProvider');

const weatherProvider = new WeatherAPIProvider();

const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, ' ');

const validateCity = async (city) => {
  try {
    const weatherData = await weatherProvider.fetch(city);
    const returnedCity = weatherData.location.name;

    return normalize(returnedCity) === normalize(city);
  } catch {
    return false;
  }
};

module.exports = { validateCity };
