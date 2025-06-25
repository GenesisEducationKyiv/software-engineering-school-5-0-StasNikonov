const { createValidator } = require('../services/cityValidation/cityValidator');

const validateWeatherInput = async (req, res, next) => {
  const { city } = req.query;

  if (!city || city.trim() === '') {
    return res
      .status(400)
      .json({ error: true, message: 'City parameter is required' });
  }

  try {
    const validate = createValidator();
    const isCityCorrect = await validate(city.trim());
    if (!isCityCorrect) {
      return res.status(404).json({ error: true, message: 'City not found' });
    }
  } catch (error) {
    console.error('City validation error:', error);
    return res
      .status(500)
      .json({ error: true, message: 'Internal Server Error' });
  }

  next();
};

module.exports = { validateWeatherInput };
