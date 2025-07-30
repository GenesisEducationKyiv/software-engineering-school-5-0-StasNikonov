const WeatherAPIProvider = require('../../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../../providers/OpenWeatherMapProvider');
const LoggingWeatherProviderDecorator = require('../../decorators/LoggingWeatherProviderDecorator');
const ChainWeatherProvider = require('../../../application/services/weather/ChainWeatherProvider');
const WeatherService = require('../../../application/services/weather/WeatherService');
const redisClient = require('../../cache/redisClient');
const { cacheHits, cacheMisses } = require('../../metrics/metrics');

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
