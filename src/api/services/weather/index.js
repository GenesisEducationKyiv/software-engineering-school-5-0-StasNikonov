const WeatherAPIProvider = require('../../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../../providers/OpenWeatherMapProvider');
const WeatherService = require('./WeatherService');
const redisClient = require('../../../utils/redisClient');
const { cacheHits, cacheMisses } = require('../../../utils/metrics');

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
