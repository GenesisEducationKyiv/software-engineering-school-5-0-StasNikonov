const { isValidFields, isValidEmail } = require('./validateSubscriptionFields');
const { validateCity } = require('./cityValidator');

const validateSubscriptionInput = async ({ email, city, frequency }) => {
  const validation = isValidFields(email, city, frequency);
  if (!validation.valid) {
    return { valid: false, status: 400, message: validation.message };
  }

  if (!isValidEmail(email)) {
    return { valid: false, message: 'Invalid input' };
  }

  const isCityCorrect = await validateCity(city);
  if (!isCityCorrect) {
    return { valid: false, message: 'Invalid input' };
  }

  return { valid: true };
};

module.exports = { validateSubscriptionInput };
