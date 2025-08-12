const redisClient = {
  get: jest.fn(),
  setEx: jest.fn(),
};

const weatherAPI = {
  fetch: jest.fn(),
};

const normalizeCity = (name) => name.trim().toLowerCase().replace(/\s+/g, '_');

const weatherService = {
  getWeather: async (city) => {
    const normalizedCity = normalizeCity(city);
    const cacheKey = `weather:${normalizedCity}`;
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
      const freshData = await weatherAPI.fetch(city);
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(freshData));
      return freshData;
    } catch {
      return await weatherAPI.fetch(city);
    }
  },
};

describe('WeatherService with Redis cache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached data if present in Redis', async () => {
    redisClient.get.mockResolvedValue(JSON.stringify({ temp: 20 }));

    const data = await weatherService.getWeather('Kyiv');

    expect(redisClient.get).toHaveBeenCalledWith('weather:kyiv');
    expect(data.temp).toBe(20);
  });

  it('should fetch from API and cache data if not in Redis', async () => {
    redisClient.get.mockResolvedValue(null);
    weatherAPI.fetch.mockResolvedValue({ temp: 22 });
    redisClient.setEx.mockResolvedValue('OK');

    const data = await weatherService.getWeather('Kyiv');

    expect(redisClient.get).toHaveBeenCalledWith('weather:kyiv');
    expect(weatherAPI.fetch).toHaveBeenCalledWith('Kyiv');
    expect(redisClient.setEx).toHaveBeenCalledWith(
      'weather:kyiv',
      expect.any(Number),
      JSON.stringify({ temp: 22 }),
    );
    expect(data.temp).toBe(22);
  });

  it('should handle Redis errors gracefully', async () => {
    redisClient.get.mockRejectedValue(new Error('Redis down'));
    weatherAPI.fetch.mockResolvedValue({ temp: 25 });

    const data = await weatherService.getWeather('Kyiv');

    expect(data.temp).toBe(25);
  });

  it('should treat city names case-insensitively when checking cache', async () => {
    redisClient.get.mockResolvedValue(JSON.stringify({ temp: 18 }));

    const data = await weatherService.getWeather('kYIv');

    expect(redisClient.get).toHaveBeenCalledWith('weather:kyiv');
    expect(data.temp).toBe(18);
  });
});
