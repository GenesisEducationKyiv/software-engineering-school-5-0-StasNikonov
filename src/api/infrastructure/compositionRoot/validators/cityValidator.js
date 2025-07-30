const WeatherAPICityValidator = require('../../validation/WeatherAPICityValidator');
const OpenWeatherCityValidator = require('../../validation/OpenWeatherCityValidator');
const CityValidationChain = require('../../../application/validation/ChainCityValidation');

const weatherAPICityValidator = new WeatherAPICityValidator();
const openWeatherCityValidator = new OpenWeatherCityValidator();

const cityValidator = new CityValidationChain([
  weatherAPICityValidator,
  openWeatherCityValidator,
]);

module.exports = { cityValidator };
