const validateCity = require('../utils/validateCity');
const isValidEmail = require('../utils/validateEmailField');
const allowedFrequencies = ['hourly', 'daily'];

const validateSubscriptionInput = async (req, res, next) => {
  const { email, city, frequency } = req.body;

  if (typeof email !== 'string') {
    return res
      .status(400)
      .json({ error: true, message: 'Email must be a string' });
  }

  if (typeof city !== 'string' || city.trim() === '') {
    return res
      .status(400)
      .json({ error: true, message: 'City must be a non-empty string' });
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

  try {
    const isCityCorrect = await validateCity(city.trim());
    if (!isCityCorrect) {
      return res.status(404).json({ error: true, message: 'City not found' });
    }
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }

  next();
};

module.exports = { validateSubscriptionInput };
