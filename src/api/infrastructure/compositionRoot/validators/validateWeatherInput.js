const {
  createValidateWeatherInput,
} = require('../../../presentation/middlewares/createValidateWeatherInput');
const {
  cityValidator,
} = require('../../../presentation/validation/cityValidator');

const validateWeatherInput = createValidateWeatherInput(cityValidator);

module.exports = validateWeatherInput;
