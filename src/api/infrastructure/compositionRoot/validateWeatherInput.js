const {
  createValidateWeatherInput,
} = require('../../presentation/middlewares/createValidateWeatherInput');
const { createValidator } = require('./cityValidator');

const validateWeatherInput = createValidateWeatherInput(createValidator());

module.exports = validateWeatherInput;
