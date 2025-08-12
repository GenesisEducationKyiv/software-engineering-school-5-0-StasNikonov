const axios = require('axios');
const AbstractWeatherProvider = require('./AbstractWeatherProvider');

class OpenWeatherMapProvider extends AbstractWeatherProvider {
  static BASE_URL = 'http://api.openweathermap.org';

  async fetch(city) {
    const apiKey = process.env.OWM_API_KEY;

    try {
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`,
      );

      const { lat, lon, name } = geoResponse.data[0];

      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=uk`,
      );

      const data = weatherResponse.data;

      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        city: name,
      };
    } catch (error) {
      console.error('OpenWeatherMap error:', error.message);
      const err = new Error(
        'OpenWeatherMap failed and no fallback provider available',
      );
      err.status = error.status || 500;
      throw err;
    }
  }
}

module.exports = OpenWeatherMapProvider;
