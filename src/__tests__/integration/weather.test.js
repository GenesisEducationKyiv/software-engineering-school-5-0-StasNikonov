const request = require('supertest');
const app = require('../../../app');
const axios = require('axios');

jest.mock('axios');

describe('GET /api/weather', () => {
  const city = 'Kyiv';

  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn((url) => {
      if (url.includes('weatherapi.com/v1/search.json')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 2501828,
                name: 'Kyiv',
                country: 'Ukraine',
              },
            ]),
        });
      }

      if (url.includes('openweathermap.org/geo')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                name: 'Kyiv',
                lat: 50.45,
                lon: 30.52,
                country: 'UA',
              },
            ]),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should return weather data when WeatherAPI succeeds and city is valid', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('weatherapi.com/v1/current.json')) {
        return Promise.resolve({
          data: {
            location: { name: 'Kyiv' },
            current: {
              temp_c: 18,
              humidity: 55,
              condition: { text: 'Місцями дощ' },
            },
          },
        });
      }

      return Promise.reject(new Error('Unexpected axios call'));
    });

    const response = await request(app).get(`/api/weather?city=${city}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Weather forecast for Kyiv',
      temperature: '18°C',
      humidity: '55%',
      description: 'Місцями дощ',
    });
  });

  it('should return 404 if city is invalid in both providers', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );

    const response = await request(app).get('/api/weather?city=UnknownCity');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/city not found/i);
  });

  it('should return 400 if city query parameter is missing', async () => {
    const response = await request(app).get('/api/weather');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/city parameter is required/i);
  });
});
