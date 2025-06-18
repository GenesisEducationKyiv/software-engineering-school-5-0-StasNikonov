const request = require('supertest');
const app = require('../../app');

describe('weather api', () => {
  it('should get weather for a valid city', async () => {
    const response = await request(app).get('/api/weather?city=Odesa');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('temperature');
    expect(response.body).toHaveProperty('humidity');
    expect(response.body).toHaveProperty('description');
  });

  it('should fail with missing required fields', async () => {
    const response = await request(app).get('/api/weather?city=');
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/Invalid request/i);
  });

  it('should fail with invalid city', async () => {
    const response = await request(app).get('/api/weather?city=K');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/City not found/i);
  });
});
