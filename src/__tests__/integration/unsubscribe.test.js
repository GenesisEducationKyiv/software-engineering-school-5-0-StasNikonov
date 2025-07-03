const request = require('supertest');
const app = require('../../../app');
const { Subscription } = require('../../db/models');

describe('GET /unsubscribe/:token', () => {
  const testEmail = 'unsubscribe@example.com';

  afterEach(async () => {
    await Subscription.destroy({ where: { email: testEmail } });
  });

  it('should unsubscribe a user with valid token', async () => {
    const subscriber = await Subscription.create({
      email: testEmail,
      city: 'Lviv',
      frequency: 'daily',
      confirmed: true,
      token: 'test-unsub-token',
    });

    const response = await request(app).get(
      `/api/unsubscribe/${subscriber.token}`,
    );

    expect(response.statusCode).toBe(200);

    const deleted = await Subscription.findByPk(subscriber.id);
    expect(deleted).toBeNull();
  });

  it('should return 404 for invalid token', async () => {
    const response = await request(app).get(
      '/api/unsubscribe/non-existing-token',
    );
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/Token not found/i);
  });
});
