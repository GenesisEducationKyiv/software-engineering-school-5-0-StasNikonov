const {
  createValidateSubscriptionInput,
} = require('../../../presentation/middlewares/createValidateSubscriptionInput');
const {
  cityValidator,
} = require('../../../presentation/validation/cityValidator');
const {
  isValidEmail,
} = require('../../../presentation/validation/validateSubscriptionFields');

const validateSubscriptionInput = createValidateSubscriptionInput(
  cityValidator,
  isValidEmail,
);

module.exports = validateSubscriptionInput;
