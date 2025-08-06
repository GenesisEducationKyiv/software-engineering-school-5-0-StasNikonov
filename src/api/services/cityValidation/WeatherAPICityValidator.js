const AbstractCityValidator = require('./AbstractCityValidator');

class WeatherAPICityValidator extends AbstractCityValidator {
  async validateCity(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`WeatherAPI status ${response.status}`);

    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  }
}

module.exports = WeatherAPICityValidator;
