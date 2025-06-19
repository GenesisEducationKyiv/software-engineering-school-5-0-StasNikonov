const { getWeather } = require('../adapters/weatherAdapter');
const { fetchWeatherData } = require('../integrations/weatherApiClient');
const formatWeatherResponse = require('../../utils/formatWeatherResponse');

const weatherController = async (req, res) => {
  const { city } = req.query;

  try {
    const weather = await getWeather(city, fetchWeatherData);
    const formatted = formatWeatherResponse(weather);
    res.status(200).json(formatted);
  } catch (error) {
    console.error('❌ getWeather error:', error.message);
    res.status(500).json({ message: `Error in getWeather: ${error.message}` });
  }
};

module.exports = {
  weatherController,
};
