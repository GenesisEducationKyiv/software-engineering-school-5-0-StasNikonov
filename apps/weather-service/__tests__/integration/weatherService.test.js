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
    temperature: data.temp,
    condition: data.condition,
  }));

  const mockValidator = {
    isValid: jest.fn().mockResolvedValue(true),
  };

  const cacheHits = { inc: jest.fn() };
  const cacheMisses = { inc: jest.fn() };

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
      cacheHits,
      cacheMisses,
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
    expect(cacheMisses.inc).toHaveBeenCalledTimes(1);
    expect(cacheHits.inc).not.toHaveBeenCalled();
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
    expect(cacheHits.inc).toHaveBeenCalledTimes(1);
    expect(cacheMisses.inc).not.toHaveBeenCalled();
    expect(result).toEqual({
      city: 'Lviv',
      temperature: 30,
      condition: 'rainy',
    });
  });

  it('should validate city correctly', async () => {
    const isValid = await weatherService.validateCity('Kyiv');
    expect(mockValidator.isValid).toHaveBeenCalledWith('Kyiv');
    expect(isValid).toBe(true);
  });
});
