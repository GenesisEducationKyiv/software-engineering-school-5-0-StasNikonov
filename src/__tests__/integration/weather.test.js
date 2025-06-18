jest.mock('../../api/integrations/weatherApiClient');

const request = require('supertest');
const app = require('../../../app');
const { fetchWeatherData } = require('../../api/integrations/weatherApiClient');

describe('weather API', () => {
  const city = 'Kyiv';

  beforeEach(() => {
    fetchWeatherData.mockClear();
  });

  it('should return mocked weather data', async () => {
    fetchWeatherData.mockResolvedValue({
      location: {
        name: 'Kyiv',
      },
      current: {
        temp_c: 18.0,
        humidity: 86,
        condition: {
          text: 'Місцями дощ',
        },
      },
    });

    const response = await request(app).get(`/api/weather?city=${city}`);

    expect(fetchWeatherData).toHaveBeenCalledWith(city);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Weather forecast for Kyiv',
      temperature: '18°C',
      humidity: '86%',
      description: 'Місцями дощ',
    });
  });
});
