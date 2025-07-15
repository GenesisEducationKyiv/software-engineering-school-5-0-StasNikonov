const {
  createValidateSubscriptionInput,
} = require('../../../presentation/middlewares/createValidateSubscriptionInput');
const validateCityViaGateway = require('../../validation/validateCityViaGateway');
const { isValidEmail } = require('../../validation/validateEmailField');

const validateSubscriptionInput = createValidateSubscriptionInput(
  validateCityViaGateway,
  isValidEmail,
);

module.exports = validateSubscriptionInput;
