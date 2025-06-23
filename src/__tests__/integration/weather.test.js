const request = require('supertest');
const app = require('../../../app');

const WeatherAPIProvider = require('../../api/providers/WeatherAPIProvider');

jest.mock('../../api/providers/WeatherAPIProvider', () => {
  return jest.fn().mockImplementation(() => ({
    fetch: jest.fn().mockResolvedValue({
      location: { name: 'Kyiv' },
      current: {
        temp_c: 18.0,
        humidity: 86,
        condition: { text: 'Місцями дощ' },
      },
    }),
  }));
});

describe('GET /api/weather', () => {
  const city = 'Kyiv';

  beforeEach(() => {
    WeatherAPIProvider.mockClear();
  });

  it('should return mocked weather data', async () => {
    const response = await request(app).get(`/api/weather?city=${city}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Weather forecast for Kyiv',
      temperature: '18°C',
      humidity: '86%',
      description: 'Місцями дощ',
    });

    expect(WeatherAPIProvider).toHaveBeenCalledTimes(1);

    const instance = WeatherAPIProvider.mock.results[0].value;
    expect(instance.fetch).toHaveBeenCalledWith(city);
  });
});
