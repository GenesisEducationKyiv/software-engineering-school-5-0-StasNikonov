const weatherClient = require('../clients/weatherClient');

const validateWeatherInput = async (req, res, next) => {
  const { city } = req.query;
  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid city parameter' });
  }

  weatherClient.ValidateCity({ city }, (err, response) => {
    if (err) {
      console.error('gRPC error:', err.message);
      return res.status(500).json({ error: 'City validation failed' });
    }

    if (!response?.isValid) {
      return res.status(404).json({ error: 'City not found' });
    }

    next();
  });
};

module.exports = validateWeatherInput;
