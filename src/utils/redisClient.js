const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await redisClient.connect();
      console.log('Redis connected');
      return;
    } catch (err) {
      console.error(
        `Attempt ${attempt} - Failed to connect to Redis:`,
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
};

connectWithRetry();

module.exports = redisClient;
