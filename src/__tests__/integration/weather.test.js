const request = require('supertest');
const express = require('express');
const weatherRouter = require('../../api/routes/weather');
const WeatherAPIProvider = require('../../api/providers/WeatherAPIProvider');

jest.mock('../../utils/formatWeatherResponse', () =>
  jest.fn((weather) => ({
    temp: weather.temperature,
    hum: weather.humidity,
    desc: weather.description,
    city: weather.city,
  })),
);

const app = express();
app.use(express.json());
app.use(weatherRouter);

describe('GET /weather', () => {
  beforeAll(() => {
    jest
      .spyOn(WeatherAPIProvider.prototype, 'fetch')
      .mockImplementation(async (city) => {
        if (!city) throw new Error('City not provided');
        return {
          current: {
            temp_c: 20,
            humidity: 50,
            condition: { text: 'Sunny' },
          },
          location: {
            name: city,
          },
        };
      });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return 200 and formatted weather data for valid city', async () => {
    const response = await request(app).get('/weather?city=Kyiv');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      temp: 20,
      hum: 50,
      desc: 'Sunny',
      city: 'Kyiv',
    });
  });

  it('should return 400 if city is missing', async () => {
    const response = await request(app).get('/weather');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 500 if weather API fetch throws error', async () => {
    WeatherAPIProvider.prototype.fetch.mockImplementationOnce(() => {
      throw new Error('Weather API request failed');
    });

    const response = await request(app).get('/weather?city=Kyiv');

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});
