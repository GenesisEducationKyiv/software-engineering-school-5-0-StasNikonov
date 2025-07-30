class WeatherService {
  constructor(
    weatherProvider,
    dataFormatter,
    cityValidator,
    redisClient,
    cacheHits,
    cacheMisses,
  ) {
    this.weatherProvider = weatherProvider;
    this.dataFormatter = dataFormatter;
    this.cityValidator = cityValidator;
    this.redisClient = redisClient;
    this.cacheHits = cacheHits;
    this.cacheMisses = cacheMisses;
  }

  async getWeather(city) {
    const CACHE_TTL = process.env.CACHE_TTL || 3600;

    const cacheKey = `weather:${city.toLowerCase()}`;
    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      this.cacheHits.inc();
      return JSON.parse(cached);
    }

    this.cacheMisses.inc();
    const weather = await this.weatherProvider.fetch(city);
    await this.redisClient.setEx(
      cacheKey,
      CACHE_TTL,
      JSON.stringify(this.dataFormatter(weather)),
    );
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
