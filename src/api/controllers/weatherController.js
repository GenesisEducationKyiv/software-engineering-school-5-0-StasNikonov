const {
  validateWeatherFields,
} = require('../middlewares/validateWeatherFields');
const { getWeather } = require('../services/weatherService');

const weatherController = async (req, res) => {
  const { city } = req.query;

  const validation = await validateWeatherFields(city);
  if (!validation.valid) {
    return res.status(validation.status).json({ message: validation.message });
  }

  try {
    const weather = await getWeather(city);
    res.status(200).json({
      message: `Weather forecast for ${weather.city}`,
      temperature: `${weather.temperature}°C`,
      humidity: `${weather.humidity}%`,
      description: weather.description,
    });
  } catch (error) {
    res.status(500).json({ message: `Error in getWeather: ${error.message}` });
  }
};

module.exports = {
  weatherController,
};
