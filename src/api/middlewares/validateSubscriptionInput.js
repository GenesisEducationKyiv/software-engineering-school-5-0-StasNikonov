const {
  isValidEmail,
  isValidFields,
} = require('../../utils/validators/validateSubscriptionFields');
const { validateCity } = require('../../utils/validators/cityValidator');

const allowedFrequencies = ['hourly', 'daily'];

const validateSubscriptionInput = async (req, res, next) => {
  try {
    const { email, city, frequency } = req.body;

    const fieldValidation = isValidFields(email, city, frequency);
    if (!fieldValidation.valid) {
      return res
        .status(fieldValidation.status)
        .json({ error: true, message: fieldValidation.message });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ error: true, message: 'Invalid email format' });
    }

    if (!allowedFrequencies.includes(frequency)) {
      return res
        .status(400)
        .json({ error: true, message: 'Invalid frequency value' });
    }

    const isCityCorrect = await validateCity(city);
    if (!isCityCorrect) {
      return res.status(400).json({ error: true, message: 'City not found' });
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

module.exports = { validateSubscriptionInput };
