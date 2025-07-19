const axios = require('axios');
const IWeatherProvider = require('./IWeatherProvider');
const logProviderResponse = require('../logging/logProviderResponse');

class WeatherAPIProvider extends IWeatherProvider {
  async fetch(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const apiUrl = process.env.WEATHER_API_BASE_URL;
    const url = `${apiUrl}/current.json?key=${apiKey}&q=${city}&lang=uk`;
    try {
      const response = await axios.get(url);

      const data = response.data;

      logProviderResponse('weatherapi.com/v1/current.json', data);
      return {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        description: data.current.condition.text,
        city: data.location.name,
      };
    } catch (error) {
      console.error('WeatherAPI error:', error.message);
      if (this.next) {
        return this.next.fetch(city);
      }
      const err = new Error(
        'Weather API request failed and no fallback provider available',
      );
      err.status = error.response?.status || 500;
      throw err;
    }
  }
}

module.exports = WeatherAPIProvider;
