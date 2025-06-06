const { validateCity } = require('./cityValidator');
const validateWeatherFields = async (city) => {
  if (!city) {
    return { valid: false, status: 400, message: 'Invalid request' };
  }

  const isCityCorrect = await validateCity(city);
  if (!isCityCorrect) {
    return { valid: false, status: 404, message: 'City not found' };
  }

  return { valid: true };
};

module.exports = { validateWeatherFields };
