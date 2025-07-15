class WeatherService {
  constructor(weatherProvider, dataFormatter, cityValidator, redisClient) {
    this.weatherProvider = weatherProvider;
    this.dataFormatter = dataFormatter;
    this.cityValidator = cityValidator;
    this.redisClient = redisClient;
  }

  async getWeather(city) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const weather = await this.weatherProvider.fetch(city);
    await this.redisClient.setEx(
      cacheKey,
      3600,
      JSON.stringify(this.dataFormatter(weather)),
    );
    return this.dataFormatter(weather);
  }

  async validateCity(city) {
    try {
      return await this.cityValidator.isValid(city);
    } catch (error) {
      console.error('❌ validateCity error:', error.message);
      return false;
    }
  }
}

module.exports = WeatherService;
