const { fetchWeatherData } = require('../../api/integrations/weatherApiClient');

const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, ' ');

const validateCity = async (city) => {
  try {
    const weatherData = await fetchWeatherData(city);
    const returnedCity = weatherData.location.name;

    return normalize(returnedCity) === normalize(city);
  } catch {
    return false;
  }
};

module.exports = { validateCity };
