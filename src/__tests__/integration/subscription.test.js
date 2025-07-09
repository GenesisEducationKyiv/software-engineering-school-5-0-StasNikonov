jest.mock('../../api/integrations/nodemailerClient');

jest.mock('../../api/providers/WeatherAPIProvider', () => {
  return jest.fn().mockImplementation(() => {
    return {
      fetch: jest.fn().mockResolvedValue({
        location: { name: 'Kyiv' },
        current: {
          temp_c: 18,
          humidity: 55,
          condition: { text: 'Місцями дощ' },
        },
      }),
    };
  });
});

const request = require('supertest');
const app = require('../../../app');
const { Subscription } = require('../../db/models');

describe('Weather Subscription API', () => {
  const testEmail = 'test@example.com';

  beforeEach(async () => {
    await Subscription.destroy({ where: { email: testEmail } });
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
    expect(response.body.message).toMatch(/Invalid input/i);
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

  it('should normalize city input and subscribe successfully', async () => {
    const response = await request(app).post('/api/subscribe').send({
      email: 'normalized@example.com',
      city: '   kYiV  ',
      frequency: 'daily',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/confirmation/i);

    const sub = await Subscription.findOne({
      where: { email: 'normalized@example.com' },
    });
    expect(sub).not.toBeNull();
    expect(sub.city).toBe('Kyiv');
  });
});
