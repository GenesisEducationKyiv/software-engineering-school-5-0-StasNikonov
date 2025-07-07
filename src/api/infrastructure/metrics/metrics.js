const client = require('prom-client');

const cacheHits = new client.Counter({
  name: 'weather_cache_hits_total',
  help: 'Total number of cache hits',
});

const cacheMisses = new client.Counter({
  name: 'weather_cache_misses_total',
  help: 'Total number of cache misses',
});

module.exports = { cacheHits, cacheMisses };
