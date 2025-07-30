const axios = require('axios');
const WeatherAPIProvider = require('../../../src/api/infrastructure/providers/WeatherAPIProvider');
const ChainWeatherProvider = require('../../api/application/services/weather/ChainWeatherProvider');

jest.mock('axios');

describe('WeatherAPIProvider', () => {
  const city = 'Kyiv';
  const apiKey = 'mocked-key';

  beforeEach(() => {
    process.env.WEATHER_API_KEY = apiKey;
    jest.clearAllMocks();
  });

  it('should return weather data from WeatherAPI', async () => {
    const mockResponse = {
      data: {
        location: { name: 'Kyiv' },
        current: {
          temp_c: 18,
          humidity: 60,
          condition: { text: 'Сонячно' },
        },
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const provider = new WeatherAPIProvider();
    const result = await provider.fetch(city);

    expect(axios.get).toHaveBeenCalledWith(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=uk`,
    );

    expect(result).toEqual({
      temperature: 18,
      humidity: 60,
      description: 'Сонячно',
      city: 'Kyiv',
    });
  });

  it('should delegate to next provider on error', async () => {
    const city = 'Odesa';

    const mockError = new Error('API failed');

    const failingProvider = {
      fetch: jest.fn().mockRejectedValue(mockError),
    };

    const fallbackProvider = {
      fetch: jest.fn().mockResolvedValue({ temperature: 22 }),
    };

    const chainProvider = new ChainWeatherProvider([
      failingProvider,
      fallbackProvider,
    ]);

    const result = await chainProvider.fetch(city);

    expect(failingProvider.fetch).toHaveBeenCalledWith(city);
    expect(fallbackProvider.fetch).toHaveBeenCalledWith(city);
    expect(result).toEqual({ temperature: 22 });
  });

  it('should throw if no fallback provider is set', async () => {
    const mockError = { message: 'API failed', response: { status: 503 } };
    axios.get.mockRejectedValue(mockError);

    const provider = new WeatherAPIProvider();

    await expect(provider.fetch(city)).rejects.toMatchObject({
      message: expect.stringContaining('Weather API request failed'),
      status: 503,
    });
  });
});
