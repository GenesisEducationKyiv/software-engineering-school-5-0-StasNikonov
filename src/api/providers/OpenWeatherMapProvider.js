const axios = require('axios');
const AbstractWeatherProvider = require('./AbstractWeatherProvider');

class OpenWeatherMapProvider extends AbstractWeatherProvider {
  async fetch(city) {
    const apiKey = '6e086d006737748bf5760566509f2531';
    const coordinateData = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`,
    );
    const lat = coordinateData.data[0].lat;
    const lon = coordinateData.data[0].lon;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

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

module.exports = OpenWeatherMapProvider;
