const {
  createValidateWeatherInput,
} = require('../../../presentation/middlewares/createValidateWeatherInput');
const validateCityViaGateway = require('../../validation/validateCityViaGateway');

const validateWeatherInput = createValidateWeatherInput(validateCityViaGateway);

module.exports = validateWeatherInput;
