const axios = require('axios');
const OpenWeatherMapProvider = require('../../src/providers/OpenWeatherMapProvider');

jest.mock('axios');
jest.mock('../../src/logging/logProviderResponse');

describe('OpenWeatherMapProvider', () => {
  const city = 'Kyiv';
  const loggerMock = { error: jest.fn() };
  const provider = new OpenWeatherMapProvider(loggerMock);

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OWM_API_KEY = 'test_key';
    process.env.OWM_API_BASE_URL = 'test_url';
  });

  it('should return weather data for a city', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: [{ lat: 50.45, lon: 30.52, name: 'Kyiv' }],
      })
      .mockResolvedValueOnce({
        data: {
          main: { temp: 25, humidity: 60 },
          weather: [{ description: 'сонячно' }],
        },
      });

    const result = await provider.fetch(city);

    expect(result).toEqual({
      temperature: 25,
      humidity: 60,
      description: 'сонячно',
      city: 'Kyiv',
    });
  });

  it('should throw error when API fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(provider.fetch(city)).rejects.toThrow(
      'OpenWeatherMap failed and no fallback provider available',
    );
  });
});
