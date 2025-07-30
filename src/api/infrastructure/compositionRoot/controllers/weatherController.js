const WeatherController = require('../../../presentation/controllers/weather/WeatherController');
const weatherService = require('../services/weatherService');
const formatWeatherResponse = require('../../../application/formatters/formatWeatherResponse');

const weatherController = new WeatherController(
  weatherService,
  formatWeatherResponse,
);

module.exports = weatherController;
