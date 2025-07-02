const WeatherAPIProvider = require('../../providers/WeatherAPIProvider');
const WeatherService = require('./WeatherService');

const weatherProvider = new WeatherAPIProvider();
const weatherService = new WeatherService(weatherProvider);

module.exports = weatherService;
