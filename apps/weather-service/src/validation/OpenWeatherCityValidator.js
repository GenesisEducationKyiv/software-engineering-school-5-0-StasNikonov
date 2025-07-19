const ICityValidator = require('./ICityValidator');

class OpenWeatherCityValidator extends ICityValidator {
  async validateCity(city) {
    const apiKey = process.env.OWM_API_KEY;
    const apiUrl = process.env.OWM_API_BASE_URL;
    const url = `${apiUrl}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`OpenWeatherMap returned status ${response.status}`);
        return false;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) return false;

      return true;
    } catch (error) {
      console.error('OpenWeatherMap validation error:', error.message);
      return false;
    }
  }
}

module.exports = OpenWeatherCityValidator;
