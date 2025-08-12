class WeatherService {
  constructor(
    weatherProvider,
    dataFormatter,
    cityValidator,
    redisProvider,
    metrics,
  ) {
    this.weatherProvider = weatherProvider;
    this.dataFormatter = dataFormatter;
    this.cityValidator = cityValidator;
    this.redisProvider = redisProvider;
    this.metrics = metrics;
  }

  async getWeather(city) {
    const CACHE_TTL = process.env.CACHE_TTL || 3600;

    const cacheKey = `weather:${city.toLowerCase()}`;
    const cached = await this.redisProvider.get(cacheKey);
    if (cached) {
      this.metrics.incCacheHit();
      return this.dataFormatter(JSON.parse(cached));
    }

    this.metrics.incCacheMiss();
    const weather = await this.weatherProvider.fetch(city);
    await this.redisProvider.set(cacheKey, CACHE_TTL, weather);
    return this.dataFormatter(weather);
  }

  async validateCity(city) {
    try {
      return await this.cityValidator.validateCity(city);
    } catch (error) {
      console.error('validateCity error:', error.message);
      return false;
    }
  }
}

module.exports = WeatherService;
