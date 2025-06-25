const WeatherAPICityValidator = require('./WeatherAPICityValidator');
const OpenWeatherCityValidator = require('./OpenWeatherCityValidator');
const CityValidationChain = require('./CityValidationChain');

const createValidator = () => {
  const weatherAPICityValidator = new WeatherAPICityValidator();
  const openWeatherCityValidator = new OpenWeatherCityValidator();
  weatherAPICityValidator.setNext(openWeatherCityValidator);

  const cityValidator = new CityValidationChain(weatherAPICityValidator);

  return async (city) => cityValidator.isValid(city);
};

module.exports = { createValidator };
