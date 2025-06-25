const axios = require('axios');
const AbstractWeatherProvider = require('./AbstractWeatherProvider');

class WeatherAPIProvider extends AbstractWeatherProvider {
  async fetch(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=uk`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ WeatherAPI error:', error.message);
      if (this.next) {
        return this.next.fetch(city);
      }
      throw new Error(
        'Weather API request failed and no fallback provider available',
      );
    }
  }
}

module.exports = WeatherAPIProvider;
