const ICityValidator = require('./ICityValidator');

class WeatherAPICityValidator extends ICityValidator {
  async validateCity(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const apiUrl = process.env.WEATHER_API_BASE_URL;
    const url = `${apiUrl}/search.json?key=${apiKey}&q=${city}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`WeatherAPI returned status ${response.status}`);
        return false;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) return false;

      return true;
    } catch (error) {
      console.error('WeatherAPI validation error:', error.message);
      return false;
    }
  }
}

module.exports = WeatherAPICityValidator;
