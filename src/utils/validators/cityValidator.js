const axios = require('axios');

const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, ' ');

const validateCity = async (city) => {
  const apiKey = process.env.WEATHER_API_KEY;

  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=uk`,
    );
    const returnedCity = response.data.location.name;

    return normalize(returnedCity) === normalize(city);
  } catch {
    return false;
  }
};

module.exports = { validateCity };
