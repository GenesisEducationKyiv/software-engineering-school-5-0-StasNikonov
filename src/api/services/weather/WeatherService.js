class WeatherService {
  constructor(weatherProvider, redisClient, cacheHits, cacheMisses) {
    this.weatherProvider = weatherProvider;
    this.redisClient = redisClient;
    this.cacheHits = cacheHits;
    this.cacheMisses = cacheMisses;
  }

  async getWeather(city) {
    const CACHE_TTL = process.env.CACHE_TTL || 3600;

    const normalizedCity = city.trim().toLowerCase().replace(/\s+/g, '_');
    const cacheKey = `weather:${normalizedCity}`;
    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      this.cacheHits.inc();
      return JSON.parse(cached);
    }
    this.cacheMisses.inc();
    const weather = await this.weatherProvider.fetch(city);

    await this.redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(weather));

    return weather;
  }
}

module.exports = WeatherService;
