const axios = require('axios');
const IWeatherProvider = require('./IWeatherProvider');

class OpenWeatherMapProvider extends IWeatherProvider {
  async fetch(city) {
    const apiKey = process.env.OWM_API_KEY;
    const apiUrl =
      process.env.OWM_API_BASE_URL || 'http://api.openweathermap.org';
    try {
      const geoResponse = await axios.get(
        `${apiUrl}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`,
      );
      const { lat, lon, name } = geoResponse.data[0];

      const weatherResponse = await axios.get(
        `${apiUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=uk`,
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
