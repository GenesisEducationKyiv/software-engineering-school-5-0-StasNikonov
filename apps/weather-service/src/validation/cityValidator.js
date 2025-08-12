const WeatherAPICityValidator = require('./WeatherAPICityValidator');
const OpenWeatherCityValidator = require('./OpenWeatherCityValidator');
const CityValidationChain = require('./ChainCityValidation');

const weatherAPICityValidator = new WeatherAPICityValidator();
const openWeatherCityValidator = new OpenWeatherCityValidator();

const cityValidator = new CityValidationChain([
  weatherAPICityValidator,
  openWeatherCityValidator,
]);

module.exports = { cityValidator };
