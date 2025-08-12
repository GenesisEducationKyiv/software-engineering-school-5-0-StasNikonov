const WeatherAPIProvider = require('../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../providers/OpenWeatherMapProvider');
const LoggingWeatherProviderDecorator = require('../logging/LoggingWeatherProviderDecorator');
const ChainWeatherProvider = require('../providers/ChainWeatherProvider');
const WeatherService = require('./WeatherService');
const redisProvider = require('../cache/index');
const { cityValidator } = require('../validation/cityValidator');
const formatWeatherResponse = require('../utils/formatResponse');
const metrics = require('../metrics/MetricsService');

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
  formatWeatherResponse,
  cityValidator,
  redisProvider,
  metrics,
);

module.exports = weatherService;
