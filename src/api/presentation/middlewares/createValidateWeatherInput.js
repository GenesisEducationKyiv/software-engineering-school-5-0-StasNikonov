const createValidateWeatherInput = (validateCityFn) => {
  return async (req, res, next) => {
    const { city } = req.query;

    if (Array.isArray(req.query.city)) {
      return res.status(400).json({
        error: true,
        message: 'City parameter must be a single value',
      });
    }

    if (!city || city.trim() === '') {
      return res
        .status(400)
        .json({ error: true, message: 'City parameter is required' });
    }

    try {
      const isCityCorrect = await validateCityFn(city.trim());
      if (!isCityCorrect) {
        return res.status(404).json({ error: true, message: 'City not found' });
      }

      return next();
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
  };
};

module.exports = { createValidateWeatherInput };
