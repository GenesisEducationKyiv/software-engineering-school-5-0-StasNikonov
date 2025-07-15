const WeatherAPICityValidator = require('./WeatherAPICityValidator');
const OpenWeatherCityValidator = require('./OpenWeatherCityValidator');
const CityValidationChain = require('./CityValidationChain');

const createCityValidator = () => {
  const weatherAPICityValidator = new WeatherAPICityValidator();
  const openWeatherCityValidator = new OpenWeatherCityValidator();
  weatherAPICityValidator.setNext(openWeatherCityValidator);

  return new CityValidationChain(weatherAPICityValidator);
};

module.exports = createCityValidator;
