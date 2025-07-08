jest.mock('../../api/infrastructure/providers/NodemailerProvider');
jest.mock('axios');

const axios = require('axios');
const request = require('supertest');
const app = require('../../../app');
const { Subscription } = require('../../db/models');

describe('Weather Subscription API', () => {
  const testEmail = 'test@example.com';

  beforeEach(async () => {
    jest.clearAllMocks();
    await Subscription.destroy({ where: { email: testEmail } });

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

    axios.get.mockImplementation((url) => {
      if (url.includes('weatherapi.com')) {
        return Promise.resolve({
          data: [
            {
              id: 2501828,
              name: 'Kyiv',
              region: "Kyyivs'ka Oblast'",
              country: 'Ukraine',
              lat: 50.43,
              lon: 30.52,
              url: 'kyiv-kyyivska-oblast-ukraine',
            },
          ],
        });
      }
      if (url.includes('openweathermap.org/geo')) {
        return Promise.resolve({
          data: [{ lat: 50.45, lon: 30.52, name: 'Kyiv' }],
        });
      }
      if (url.includes('openweathermap.org/data')) {
        return Promise.resolve({
          data: {
            main: { temp: 291, humidity: 60 },
            weather: [{ description: 'Clear sky' }],
            name: 'Kyiv',
          },
        });
      }

      return Promise.reject(new Error('Unexpected axios call in test'));
    });
  });

  afterEach(async () => {
    await Subscription.destroy({ where: { email: testEmail } });
  });

  it('should subscribe a user with valid data', async () => {
    const response = await request(app).post('/api/subscribe').send({
      email: testEmail,
      city: 'Kyiv',
      frequency: 'daily',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/confirmation/i);

    const sub = await Subscription.findOne({ where: { email: testEmail } });
    expect(sub).not.toBeNull();
    expect(sub.confirmed).toBe(false);
  });

  it('should fail with missing required fields', async () => {
    const response = await request(app).post('/api/subscribe').send({
      email: testEmail,
      frequency: 'daily',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/City must be a non-empty string/i);
  });

  it('should fail with invalid email', async () => {
    const response = await request(app).post('/api/subscribe').send({
      email: 'testexample.com',
      city: 'Kyiv',
      frequency: 'daily',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/Invalid email format/i);
  });

  it('should fail with invalid frequency', async () => {
    const response = await request(app).post('/api/subscribe').send({
      email: testEmail,
      city: 'Kyiv',
      frequency: 'day',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/Invalid frequency value/i);
  });

  it('should fail with invalid city', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );

    const response = await request(app).post('/api/subscribe').send({
      email: testEmail,
      city: 'UnknownCity',
      frequency: 'daily',
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/City not found/i);
  });

  it('should not allow duplicate subscriptions', async () => {
    await request(app).post('/api/subscribe').send({
      email: testEmail,
      city: 'Kyiv',
      frequency: 'daily',
    });

    const response = await request(app).post('/api/subscribe').send({
      email: testEmail,
      city: 'Kyiv',
      frequency: 'daily',
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toMatch(/Email already exists/i);
  });
});
