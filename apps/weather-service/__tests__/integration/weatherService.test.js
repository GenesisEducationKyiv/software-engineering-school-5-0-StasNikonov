const { GenericContainer } = require('testcontainers');
const { createClient } = require('redis');
const WeatherService = require('../../src/services/WeatherService');

describe('WeatherService Integration Test (with Redis)', () => {
  let redisContainer;
  let redisClient;
  let weatherService;

  const mockProvider = {
    fetch: jest
      .fn()
      .mockResolvedValue({ temp: 25, city: 'Lviv', condition: 'rainy' }),
  };

  const mockFormatter = jest.fn((data) => ({
    city: data.city,
    temperature: data.temp ?? data.temperature,
    condition: data.condition,
  }));

  const mockValidator = {
    validateCity: jest.fn().mockResolvedValue(true),
  };

  const mockMetrics = {
    incCacheHit: jest.fn(),
    incCacheMiss: jest.fn(),
  };

  beforeAll(async () => {
    redisContainer = await new GenericContainer('redis')
      .withExposedPorts(6379)
      .start();

    redisClient = createClient({
      socket: {
        host: redisContainer.getHost(),
        port: redisContainer.getMappedPort(6379),
      },
    });

    await redisClient.connect();

    const redisProvider = {
      get: (key) => redisClient.get(key),
      set: (key, ttl, value) =>
        redisClient.setEx(key, ttl, JSON.stringify(value)),
    };

    weatherService = new WeatherService(
      mockProvider,
      mockFormatter,
      mockValidator,
      redisProvider,
      mockMetrics,
    );
  });

  afterAll(async () => {
    await redisClient.quit();
    await redisContainer.stop();
  });

  beforeEach(async () => {
    await redisClient.flushAll();
    jest.clearAllMocks();
  });

  it('should fetch weather from provider and cache it on first request', async () => {
    const result = await weatherService.getWeather('Lviv');

    expect(mockProvider.fetch).toHaveBeenCalledTimes(1);
    expect(mockMetrics.incCacheMiss).toHaveBeenCalledTimes(1);
    expect(mockMetrics.incCacheHit).not.toHaveBeenCalled();
    expect(mockFormatter).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      city: 'Lviv',
      temperature: 25,
      condition: 'rainy',
    });

    const cached = await redisClient.get('weather:lviv');
    expect(JSON.parse(cached)).toEqual({
      city: 'Lviv',
      temp: 25,
      condition: 'rainy',
    });
  });

  it('should return cached weather on second request', async () => {
    await redisClient.setEx(
      'weather:lviv',
      3600,
      JSON.stringify({ city: 'Lviv', temperature: 30, condition: 'rainy' }),
    );

    const result = await weatherService.getWeather('Lviv');

    expect(mockProvider.fetch).not.toHaveBeenCalled();
    expect(mockMetrics.incCacheHit).toHaveBeenCalledTimes(1);
    expect(mockMetrics.incCacheMiss).not.toHaveBeenCalled();
    expect(result).toEqual({
      city: 'Lviv',
      temperature: 30,
      condition: 'rainy',
    });
  });

  it('should validate city correctly', async () => {
    const isValid = await weatherService.validateCity('Kyiv');
    expect(mockValidator.validateCity).toHaveBeenCalledWith('Kyiv');
    expect(isValid).toBe(true);
  });
});
