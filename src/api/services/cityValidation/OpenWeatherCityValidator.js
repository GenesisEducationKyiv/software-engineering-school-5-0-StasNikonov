const AbstractCityValidator = require('./AbstractCityValidator');

class OpenWeatherCityValidator extends AbstractCityValidator {
  async validateCity(city) {
    const apiKey = process.env.OWM_API_KEY;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`OpenWeatherMap status ${response.status}`);

    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  }
}

module.exports = OpenWeatherCityValidator;
