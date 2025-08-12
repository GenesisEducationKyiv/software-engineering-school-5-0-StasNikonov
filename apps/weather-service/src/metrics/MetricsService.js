const client = require('prom-client');

class MetricsService {
  constructor() {
    this.weatherRequests = new client.Counter({
      name: 'weather_requests_total',
      help: 'Total number of weather requests',
    });

    this.validateCityRequests = new client.Counter({
      name: 'validate_city_requests_total',
      help: 'Total number of validate city requests',
    });

    this.validateCityError = new client.Counter({
      name: 'validate_city_error_total',
      help: 'Total number of validate city errors',
    });

    this.cacheHits = new client.Counter({
      name: 'weather_cache_hits_total',
      help: 'Total number of cache hits',
    });

    this.cacheMisses = new client.Counter({
      name: 'weather_cache_misses_total',
      help: 'Total number of cache misses',
    });

    this.weatherRequestDuration = new client.Histogram({
      name: 'weather_request_duration_seconds',
      help: 'Duration of weather fetch requests in seconds',
      labelNames: ['source'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    });
  }

  incWeatherRequests() {
    this.weatherRequests.inc();
  }

  incValidateCityRequests() {
    this.validateCityRequests.inc();
  }

  incValidateCityError() {
    this.validateCityError.inc();
  }

  incCacheHits() {
    this.cacheHits.inc();
  }

  incCacheMisses() {
    this.cacheMisses.inc();
  }

  startWeatherTimer(labels = {}) {
    return this.weatherRequestDuration.startTimer(labels);
  }
}

module.exports = new MetricsService();
