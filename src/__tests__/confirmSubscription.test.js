const request = require('supertest');
const app = require('../../app');
const { Subscription } = require('../db/models');

describe('GET /confirm/:token', () => {
  it('should confirm subscription with valid token', async () => {
    const subscription = await Subscription.create({
      email: 'confirm@example.com',
      city: 'Kyiv',
      frequency: 'daily',
      confirmed: false,
      token: 'test-token-123',
    });

    const response = await request(app).get(
      `/api/confirm/${subscription.token}`,
    );

    expect(response.statusCode).toBe(200);

    const updated = await Subscription.findByPk(subscription.id);
    expect(updated.confirmed).toBe(true);
  });

  it('should return 404 for invalid token', async () => {
    const response = await request(app).get('/api/confirm/non-existing-token');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/Token not found/i);
  });

  afterEach(async () => {
    await Subscription.destroy({ where: { email: 'confirm@example.com' } });
  });
});
