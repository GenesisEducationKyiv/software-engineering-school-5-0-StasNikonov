const WeatherAPIProvider = require('../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../providers/OpenWeatherMapProvider');
const WeatherService = require('../services/weatherService');
const formatWeatherResponse = require('../../utils/formatWeatherResponse');

const weatherController = async (req, res) => {
  const { city } = req.query;

  const weatherAPIProvider = new WeatherAPIProvider();
  const openWeatherProvider = new OpenWeatherMapProvider();

  weatherAPIProvider.setNext(openWeatherProvider);
  const weatherService = new WeatherService(weatherAPIProvider);

  try {
    const weather = await weatherService.getWeather(city);
    const formatted = formatWeatherResponse(weather);
    res.status(200).json(formatted);
  } catch (error) {
    console.error('❌ getWeather error:', error.message);

    if (error.status === 400) {
      res.status(404).json({ message: 'City not found' });
    } else {
      res
        .status(500)
        .json({ message: `Error in getWeather: ${error.message}` });
    }
  }
};

module.exports = {
  weatherController,
};
