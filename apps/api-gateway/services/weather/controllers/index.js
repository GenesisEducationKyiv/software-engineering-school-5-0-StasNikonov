const WeatherController = require('./WeatherController');
const weatherClient = require('../clients/weatherClient');
const logger = require('../../../../../shared/logger/index');

const weatherController = new WeatherController(weatherClient, logger);

module.exports = weatherController;
