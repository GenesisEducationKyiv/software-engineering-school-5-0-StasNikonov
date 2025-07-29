const WeatherAPIProvider = require('../../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../../providers/OpenWeatherMapProvider');
const LoggingWeatherProviderDecorator = require('../../../utils/logs/LoggingWeatherProviderDecorator');
const ChainWeatherProvider = require('../../providers/ChainWeatherProvider');
const WeatherService = require('./WeatherService');
const redisClient = require('../../../utils/redisClient');
const { cacheHits, cacheMisses } = require('../../../utils/metrics');

const weatherAPIProvider = new LoggingWeatherProviderDecorator(
  new WeatherAPIProvider(),
  'weatherapi.com/v1/current.json',
);

const openWeatherMapProvider = new LoggingWeatherProviderDecorator(
  new OpenWeatherMapProvider(),
  'openweathermap.org/data',
);

const chainProvider = new ChainWeatherProvider([
  weatherAPIProvider,
  openWeatherMapProvider,
]);

const weatherService = new WeatherService(
  chainProvider,
  redisClient,
  cacheHits,
  cacheMisses,
);

module.exports = weatherService;
