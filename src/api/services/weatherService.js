class WeatherService {
  constructor(weatherProvider) {
    this.weatherProvider = weatherProvider;
  }

  async getWeather(city) {
    const weatherData = await this.weatherProvider.fetch(city);

    return {
      temperature: weatherData.current.temp_c,
      humidity: weatherData.current.humidity,
      description: weatherData.current.condition.text,
      city: weatherData.location.name,
    };
  }
}

module.exports = WeatherService;
