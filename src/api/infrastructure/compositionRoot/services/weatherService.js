const WeatherAPIProvider = require('../../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../../providers/OpenWeatherMapProvider');
const WeatherService = require('../../../application/services/weather/WeatherService');
const redisClient = require('../../cache/redisClient');
const { cacheHits, cacheMisses } = require('../../metrics/metrics');

const weatherAPIProvider = new WeatherAPIProvider();
const openWeatherMapProvider = new OpenWeatherMapProvider();

weatherAPIProvider.setNext(openWeatherMapProvider);

const weatherService = new WeatherService(
  weatherAPIProvider,
  redisClient,
  cacheHits,
  cacheMisses,
);

module.exports = weatherService;
