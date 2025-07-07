const axios = require('axios');
const OpenWeatherMapProvider = require('../../api/infrastructure/providers/OpenWeatherMapProvider');

jest.mock('axios');

describe('OpenWeatherMapProvider', () => {
  const city = 'Kyiv';
  const apiKey = 'mocked-key';

  beforeEach(() => {
    process.env.OWM_API_KEY = apiKey;
    jest.clearAllMocks();
  });

  it('should return weather data when OpenWeatherMap responds successfully', async () => {
    const mockGeoResponse = {
      data: [
        {
          name: 'Kyiv',
          lat: 50.45,
          lon: 30.52,
        },
      ],
    };

    const mockWeatherResponse = {
      data: {
        main: { temp: 21, humidity: 70 },
        weather: [{ description: 'ясно' }],
      },
    };

    axios.get.mockImplementation((url) => {
      if (url.includes('/geo/1.0/direct')) {
        return Promise.resolve(mockGeoResponse);
      }
      if (url.includes('/data/2.5/weather')) {
        return Promise.resolve(mockWeatherResponse);
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    const provider = new OpenWeatherMapProvider();
    const result = await provider.fetch(city);

    expect(result).toEqual({
      temperature: 21,
      humidity: 70,
      description: 'ясно',
      city: 'Kyiv',
    });

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/geo/1.0/direct'),
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/data/2.5/weather'),
    );
  });

  it('should throw if any request fails', async () => {
    axios.get.mockRejectedValue(new Error('API error'));

    const provider = new OpenWeatherMapProvider();

    await expect(provider.fetch(city)).rejects.toMatchObject({
      message: expect.stringContaining('OpenWeatherMap failed'),
      status: 500,
    });
  });
});
