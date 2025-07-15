const WeatherService = require('./WeatherService');
const WeatherAPIProvider = require('../providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('../providers/OpenWeatherMapProvider');
const dataFormatter = require('../utils/formatResponse');
const createCityValidator = require('../validation/cityValidator');
const Redis = require('redis');
const { cacheHits, cacheMisses } = require('../metrics/metrics');

const provider1 = new WeatherAPIProvider();
const provider2 = new OpenWeatherMapProvider();
provider1.setNext(provider2);

const cityValidator = createCityValidator();

const redisClient = Redis.createClient();
redisClient.connect();

const weatherService = new WeatherService(
  provider1,
  dataFormatter,
  cityValidator,
  redisClient,
  cacheHits,
  cacheMisses,
);

module.exports = weatherService;
