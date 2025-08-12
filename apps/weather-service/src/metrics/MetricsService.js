const client = require('prom-client');

class MetricsService {
  constructor() {
    this.cacheHits = new client.Counter({
      name: 'weather_cache_hits_total',
      help: 'Total number of cache hits',
    });

    this.cacheMisses = new client.Counter({
      name: 'weather_cache_misses_total',
      help: 'Total number of cache misses',
    });
  }

  incCacheHit() {
    this.cacheHits.inc();
  }

  incCacheMiss() {
    this.cacheMisses.inc();
  }
}

module.exports = new MetricsService();
