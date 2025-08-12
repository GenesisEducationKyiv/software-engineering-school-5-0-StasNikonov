const axios = require('axios');

const validateCity = async (city) => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

  try {
    const response = await axios.get(`${BASE_URL}/api/weather/validate-city`, {
      params: { city },
    });

    return response.data?.isValid === true;
  } catch (error) {
    console.error('Gateway validation error:', error.message);
    return false;
  }
};

module.exports = validateCity;
