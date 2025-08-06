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

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
  };

  const mockMetrics = {
    incWeatherRequests: jest.fn(),
    startWeatherTimer: jest.fn(() => jest.fn()),
    incCacheHits: jest.fn(),
    incCacheMisses: jest.fn(),
    incValidateCityRequests: jest.fn(),
    incValidateCityError: jest.fn(),
  };

  const mockFormatter = jest.fn((data) => ({
    city: data.city,
    temperature: data.temp,
    condition: data.condition,
  }));

  const mockValidator = {
    validateCity: jest.fn().mockResolvedValue(true),
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

    weatherService = new WeatherService(
      mockProvider,
      mockFormatter,
      mockValidator,
      redisClient,
      mockLogger,
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
    expect(mockMetrics.incCacheMisses).toHaveBeenCalledTimes(1);
    expect(mockMetrics.incCacheHits).not.toHaveBeenCalled();
    expect(mockFormatter).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      city: 'Lviv',
      temperature: 25,
      condition: 'rainy',
    });

    const cached = await redisClient.get('weather:lviv');
    expect(JSON.parse(cached)).toEqual({
      city: 'Lviv',
      temperature: 25,
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
    expect(mockMetrics.incCacheHits).toHaveBeenCalledTimes(1);
    expect(mockMetrics.incCacheMisses).not.toHaveBeenCalled();
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
