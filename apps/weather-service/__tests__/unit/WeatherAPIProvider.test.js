const axios = require('axios');
const WeatherAPIProvider = require('../../src/providers/WeatherAPIProvider');
const logProviderResponse = require('../../src/logging/logProviderResponse');

jest.mock('axios');
jest.mock('../../src/logging/logProviderResponse');

describe('WeatherAPIProvider', () => {
  const city = 'Lviv';
  let provider;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.WEATHER_API_KEY = 'test_key';
    process.env.WEATHER_API_BASE_URL = 'test_url';
    provider = new WeatherAPIProvider();
  });

  it('should return weather data for a city', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        current: {
          temp_c: 22,
          humidity: 70,
          condition: { text: 'хмарно' },
        },
        location: { name: 'Lviv' },
      },
    });

    const result = await provider.fetch(city);

    expect(result).toEqual({
      temperature: 22,
      humidity: 70,
      description: 'хмарно',
      city: 'Lviv',
    });
    expect(logProviderResponse).toHaveBeenCalledTimes(1);
  });

  it('should call next provider if error occurs', async () => {
    const fallbackResult = {
      temperature: 20,
      humidity: 50,
      description: 'ясно',
      city: 'FallbackCity',
    };

    provider.next = { fetch: jest.fn().mockResolvedValue(fallbackResult) };

    axios.get.mockRejectedValueOnce(new Error('Weather API is down'));

    const result = await provider.fetch(city);

    expect(provider.next.fetch).toHaveBeenCalledWith(city);
    expect(result).toEqual(fallbackResult);
  });

  it('should throw if no fallback provider is set', async () => {
    axios.get.mockRejectedValueOnce({
      message: 'fail',
      response: { status: 503 },
    });

    await expect(provider.fetch(city)).rejects.toThrow(
      'Weather API request failed and no fallback provider available',
    );
  });
});
