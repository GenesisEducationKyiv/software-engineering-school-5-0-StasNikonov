const {
  createValidateSubscriptionInput,
} = require('../../../presentation/middlewares/createValidateSubscriptionInput');
const { createCityValidator } = require('./cityValidator');
const { isValidEmail } = require('../../validation/validateSubscriptionFields');

const validateSubscriptionInput = createValidateSubscriptionInput(
  createCityValidator(),
  isValidEmail,
);

module.exports = validateSubscriptionInput;
