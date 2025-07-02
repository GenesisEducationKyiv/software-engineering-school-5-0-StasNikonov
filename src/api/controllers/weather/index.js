const WeatherController = require('./WeatherController');
const WeatherService = require('../../services/weather/WeatherService');
const WeatherProvider = require('../../providers/WeatherAPIProvider');
const formatWeatherResponse = require('../../../utils/formatWeatherResponse');

const weatherProvider = new WeatherProvider();
const weatherService = new WeatherService(weatherProvider);

const weatherController = new WeatherController(
  weatherService,
  formatWeatherResponse,
);

module.exports = { weatherController };
