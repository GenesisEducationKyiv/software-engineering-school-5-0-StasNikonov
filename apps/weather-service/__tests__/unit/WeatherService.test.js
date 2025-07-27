const WeatherService = require('../../src/services/WeatherService');

describe('WeatherService', () => {
  const city = 'Lviv';
  const formattedData = { temperature: 20, city: 'Lviv' };
  const rawData = { temp: 20, name: 'Lviv' };

  let redisClient;
  let weatherProvider;
  let dataFormatter;
  let cityValidator;
  let cacheHits;
  let cacheMisses;
  let service;

  beforeEach(() => {
    weatherProvider = { fetch: jest.fn() };
    dataFormatter = jest.fn();
    cityValidator = { isValid: jest.fn() };
    redisClient = {
      get: jest.fn(),
      setEx: jest.fn(),
    };
    cacheHits = { inc: jest.fn() };
    cacheMisses = { inc: jest.fn() };

    service = new WeatherService(
      weatherProvider,
      dataFormatter,
      cityValidator,
      redisClient,
      cacheHits,
      cacheMisses,
    );
  });

  it('returns cached weather if available', async () => {
    redisClient.get.mockResolvedValueOnce(JSON.stringify(formattedData));

    const result = await service.getWeather(city);

    expect(redisClient.get).toHaveBeenCalledWith('weather:lviv');
    expect(cacheHits.inc).toHaveBeenCalled();
    expect(result).toEqual(formattedData);
    expect(weatherProvider.fetch).not.toHaveBeenCalled();
  });

  it('fetches and caches weather if not cached', async () => {
    redisClient.get.mockResolvedValueOnce(null);
    weatherProvider.fetch.mockResolvedValueOnce(rawData);
    dataFormatter.mockReturnValue(formattedData);

    const result = await service.getWeather(city);

    expect(cacheMisses.inc).toHaveBeenCalled();
    expect(weatherProvider.fetch).toHaveBeenCalledWith(city);
    expect(redisClient.setEx).toHaveBeenCalledWith(
      'weather:lviv',
      3600,
      JSON.stringify(formattedData),
    );
    expect(result).toEqual(formattedData);
  });

  it('validateCity returns true for valid city', async () => {
    cityValidator.isValid.mockResolvedValueOnce(true);

    const result = await service.validateCity(city);

    expect(result).toBe(true);
  });

  it('validateCity returns false for invalid city', async () => {
    cityValidator.isValid.mockResolvedValueOnce(false);

    const result = await service.validateCity(city);

    expect(result).toBe(false);
  });

  it('validateCity handles exceptions and returns false', async () => {
    cityValidator.isValid.mockRejectedValueOnce(new Error('error'));

    const result = await service.validateCity(city);

    expect(result).toBe(false);
  });
});
