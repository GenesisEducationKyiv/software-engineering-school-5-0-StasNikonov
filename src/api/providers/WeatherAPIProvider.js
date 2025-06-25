const axios = require('axios');

class WeatherAPIProvider {
  async fetch(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=uk`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ WeatherAPI error:', error.message);
      throw new Error('Weather API request failed');
    }
  }
}

module.exports = WeatherAPIProvider;
