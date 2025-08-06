class WeatherService {
  constructor(
    weatherProvider,
    dataFormatter,
    cityValidator,
    redisClient,
    logger,
    metrics,
  ) {
    this.weatherProvider = weatherProvider;
    this.dataFormatter = dataFormatter;
    this.cityValidator = cityValidator;
    this.redisClient = redisClient;
    this.logger = logger;
    this.metrics = metrics;
  }

  async getWeather(city) {
    this.logger.info(`Getting weather for city: ${city}`);
    this.metrics.incWeatherRequests();

    const CACHE_TTL = process.env.CACHE_TTL || 3600;
    const cacheKey = `weather:${city.toLowerCase()}`;

    const timer = this.metrics.startWeatherTimer();

    const cached = await this.redisClient.get(cacheKey);
    if (cached) {
      this.metrics.incCacheHits();
      this.logger.info(`Cache HIT for city: ${city}`);

      timer({ source: 'cache' });
      return JSON.parse(cached);
    }

    this.metrics.incCacheMisses();
    this.logger.info(`Cache MISS for city: ${city}`);

    const weather = await this.weatherProvider.fetch(city);

    await this.redisClient.setEx(
      cacheKey,
      CACHE_TTL,
      JSON.stringify(this.dataFormatter(weather)),
    );

    timer({ source: 'api' });
    return this.dataFormatter(weather);
  }

  async validateCity(city) {
    try {
      this.metrics.incValidateCityRequests();
      return await this.cityValidator.validateCity(city);
    } catch (error) {
      this.metrics.incValidateCityError();
      this.logger.error(`validateCity error: ${error.message}`);
      return false;
    }
  }
}

module.exports = WeatherService;
