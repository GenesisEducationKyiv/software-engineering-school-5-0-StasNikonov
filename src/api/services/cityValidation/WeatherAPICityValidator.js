const AbstractCityValidator = require('./AbstractCityValidator');

class WeatherAPICityValidator extends AbstractCityValidator {
  async validateCity(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`WeatherAPI returned status ${response.status}`);
        return false;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('WeatherAPI validation error:', error.message);
      return false;
    }
  }
}

module.exports = WeatherAPICityValidator;
