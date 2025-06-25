const WeatherAPIProvider = require('../providers/WeatherAPIProvider');
const WeatherService = require('../services/weatherService');
const formatWeatherResponse = require('../../utils/formatWeatherResponse');

const weatherController = async (req, res) => {
  const { city } = req.query;

  const weatherProvider = new  WeatherAPIProvider();
  const weatherService = new WeatherService(weatherProvider);

  try {
    const weather = await weatherService.getWeather(city);
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
