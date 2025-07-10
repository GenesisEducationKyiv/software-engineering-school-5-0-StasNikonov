const {
  createValidateWeatherInput,
} = require('../../../presentation/middlewares/createValidateWeatherInput');
const { createCityValidator } = require('./cityValidator');

const validateWeatherInput = createValidateWeatherInput(createCityValidator());

module.exports = validateWeatherInput;
