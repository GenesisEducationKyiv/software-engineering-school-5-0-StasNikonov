const WeatherController = require('./WeatherController');
const weatherService = require('../../services/weather/index');
const formatWeatherResponse = require('../../../utils/formatWeatherResponse');

const weatherController = new WeatherController(
  weatherService,
  formatWeatherResponse,
);

module.exports = weatherController;
