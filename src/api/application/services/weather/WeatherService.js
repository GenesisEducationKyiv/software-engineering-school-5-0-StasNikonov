class WeatherService {
  constructor(weatherProvider, redisProvider, metrics) {
    this.weatherProvider = weatherProvider;
    this.redisProvider = redisProvider;
    this.metrics = metrics;
  }

  async getWeather(city) {
    const CACHE_TTL = process.env.CACHE_TTL || 3600;

    const normalizedCity = city.trim().toLowerCase().replace(/\s+/g, '_');
    const cacheKey = `weather:${normalizedCity}`;
    const cached = await this.redisProvider.get(cacheKey);
    if (cached) {
      this.metrics.incCacheHit();
      return JSON.parse(cached);
    }
    this.metrics.incCacheMiss();
    const weather = await this.weatherProvider.fetch(city);

    await this.redisProvider.set(cacheKey, CACHE_TTL, weather);

    return weather;
  }
}

module.exports = WeatherService;
