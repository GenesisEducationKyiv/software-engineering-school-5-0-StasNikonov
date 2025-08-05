const WeatherAPIProvider = require('../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../providers/OpenWeatherMapProvider');
const LoggingWeatherProviderDecorator = require('../logging/LoggingWeatherProviderDecorator');
const ChainWeatherProvider = require('../providers/ChainWeatherProvider');
const WeatherService = require('./WeatherService');
const redisClient = require('../redis/redisClient');
const { cityValidator } = require('../validation/cityValidator');
const formatWeatherResponse = require('../utils/formatResponse');
const { cacheHits, cacheMisses } = require('../metrics/metrics');
const logger = require('../../../shared/logger/index');

const weatherAPIProvider = new LoggingWeatherProviderDecorator(
  new WeatherAPIProvider(logger),
  'weatherapi.com/v1/current.json',
);

const openWeatherMapProvider = new LoggingWeatherProviderDecorator(
  new OpenWeatherMapProvider(logger),
  'openweathermap.org/data',
);

const chainProvider = new ChainWeatherProvider([
  weatherAPIProvider,
  openWeatherMapProvider,
]);

const weatherService = new WeatherService(
  chainProvider,
  formatWeatherResponse,
  cityValidator,
  redisClient,
  cacheHits,
  cacheMisses,
);

module.exports = weatherService;
