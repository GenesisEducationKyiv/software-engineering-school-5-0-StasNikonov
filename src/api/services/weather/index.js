const WeatherAPIProvider = require('../../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../../providers/OpenWeatherMapProvider');
const LoggingWeatherProviderDecorator = require('../../../utils/logs/LoggingWeatherProviderDecorator');
const ChainWeatherProvider = require('../../providers/ChainWeatherProvider');
const WeatherService = require('./WeatherService');

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

const weatherService = new WeatherService(chainProvider);

module.exports = weatherService;
