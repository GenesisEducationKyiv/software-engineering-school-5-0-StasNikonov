const {
  createValidateWeatherInput,
} = require('../../../presentation/middlewares/createValidateWeatherInput');
const { cityValidator } = require('./cityValidator');

const validateWeatherInput = createValidateWeatherInput(cityValidator);

module.exports = validateWeatherInput;
