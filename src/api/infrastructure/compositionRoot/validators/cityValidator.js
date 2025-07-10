const WeatherAPICityValidator = require('../../validation/WeatherAPICityValidator');
const OpenWeatherCityValidator = require('../../validation/OpenWeatherCityValidator');
const CityValidationChain = require('../../../application/validation/CityValidationChain');

const createCityValidator = () => {
  const weatherAPICityValidator = new WeatherAPICityValidator();
  const openWeatherCityValidator = new OpenWeatherCityValidator();
  weatherAPICityValidator.setNext(openWeatherCityValidator);

  const cityValidator = new CityValidationChain(weatherAPICityValidator);

  return async (city) => cityValidator.isValid(city);
};

module.exports = { createCityValidator };
