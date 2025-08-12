const WeatherAPIProvider = require('../../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../../providers/OpenWeatherMapProvider');
const LoggingWeatherProviderDecorator = require('../../logs/LoggingWeatherProviderDecorator');
const ChainWeatherProvider = require('../../providers/ChainWeatherProvider');
const WeatherService = require('../../../application/services/weather/WeatherService');
const redisProvider = require('../../cache/index');
const metrics = require('../../metrics/MetricsService');

const weatherAPIProvider = new LoggingWeatherProviderDecorator(
  new WeatherAPIProvider(),
  WeatherAPIProvider.BASE_URL,
);

const openWeatherMapProvider = new LoggingWeatherProviderDecorator(
  new OpenWeatherMapProvider(),
  OpenWeatherMapProvider.BASE_URL,
);

const chainProvider = new ChainWeatherProvider([
  weatherAPIProvider,
  openWeatherMapProvider,
]);

const weatherService = new WeatherService(
  chainProvider,
  redisProvider,
  metrics,
);

module.exports = weatherService;
