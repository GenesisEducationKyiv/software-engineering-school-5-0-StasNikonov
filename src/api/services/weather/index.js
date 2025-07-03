const WeatherAPIProvider = require('../../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../../providers/OpenWeatherMapProvider');
const WeatherService = require('./WeatherService');

const weatherAPIProvider = new WeatherAPIProvider();
const openWeatherMapProvider = new OpenWeatherMapProvider();

weatherAPIProvider.setNext(openWeatherMapProvider);

const weatherService = new WeatherService(weatherAPIProvider);

module.exports = weatherService;
