const {
  createValidateSubscriptionInput,
} = require('../../../presentation/middlewares/createValidateSubscriptionInput');
const { cityValidator } = require('./cityValidator');
const {
  isValidEmail,
} = require('../../../application/utils/validateSubscriptionFields');

const validateSubscriptionInput = createValidateSubscriptionInput(
  cityValidator,
  isValidEmail,
);

module.exports = validateSubscriptionInput;
