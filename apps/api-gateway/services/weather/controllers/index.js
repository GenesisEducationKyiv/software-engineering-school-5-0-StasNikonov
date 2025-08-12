const WeatherController = require('./WeatherController');
const weatherClient = require('../clients/weatherClient');

const weatherController = new WeatherController(weatherClient);

module.exports = weatherController;
