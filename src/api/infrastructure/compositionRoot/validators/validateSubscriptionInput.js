const {
  createValidateSubscriptionInput,
} = require('../../../presentation/middlewares/createValidateSubscriptionInput');
const { createValidator } = require('./cityValidator');
const { isValidEmail } = require('../../validation/validateSubscriptionFields');

const validateSubscriptionInput = createValidateSubscriptionInput(
  createValidator(),
  isValidEmail,
);

module.exports = validateSubscriptionInput;
