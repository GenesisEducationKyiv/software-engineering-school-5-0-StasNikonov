const axios = require('axios');

const validateCityViaGateway = async (city) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/weather/validate-city`,
      { params: { city } },
    );

    return response.data?.isValid === true;
  } catch (error) {
    console.error('Gateway validation error:', error.message);
    return false;
  }
};

module.exports = validateCityViaGateway;
