const axios = require('axios');

const fetchWeatherData = async (city) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=uk`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('WeatherAPI error:', error.message);
    throw new Error('Weather API request failed');
  }
};

module.exports = {
  fetchWeatherData,
};
