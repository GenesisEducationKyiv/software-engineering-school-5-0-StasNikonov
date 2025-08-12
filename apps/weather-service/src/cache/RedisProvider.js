const { createClient } = require('redis');
const ICacheProvider = require('./ICacheProvider');

class RedisProvider extends ICacheProvider {
  constructor() {
    super();
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || 6379,
      },
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.connectWithRetry();
  }

  async connectWithRetry(retries = 5, delay = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.client.connect();
        console.log('Redis connected');
        return;
      } catch (err) {
        console.error(
          `Attempt ${attempt} - Redis connection failed:`,
          err.message,
        );
        if (attempt < retries) {
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((res) => setTimeout(res, delay));
        } else {
          console.error('Failed to connect to Redis');
        }
      }
    }
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, ttl = 3600, value) {
    return this.client.setEx(key, ttl, JSON.stringify(value));
  }
}

module.exports = RedisProvider;
