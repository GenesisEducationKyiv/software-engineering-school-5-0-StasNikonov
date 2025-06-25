class WeatherService {
  constructor(weatherProvider) {
    this.weatherProvider = weatherProvider;
  }

  async getWeather(city) {
    return await this.weatherProvider.fetch(city);
  }
}

module.exports = WeatherService;
