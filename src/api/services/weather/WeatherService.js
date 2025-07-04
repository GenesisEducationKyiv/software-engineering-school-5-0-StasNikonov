class WeatherService {
  constructor(weatherProvider, redisClient, cacheHits, cacheMisses) {
    this.weatherProvider = weatherProvider;
    this.redisClient = redisClient;
    this.cacheHits = cacheHits;
    this.cacheMisses = cacheMisses;
  }

  async getWeather(city) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      this.cacheHits.inc();
      return JSON.parse(cached);
    }
    this.cacheMisses.inc();
    const weather = await this.weatherProvider.fetch(city);

    await this.redisClient.setEx(cacheKey, 3600, JSON.stringify(weather));

    return weather;
  }
}

module.exports = WeatherService;
