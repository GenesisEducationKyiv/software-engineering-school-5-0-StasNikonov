const request = require('supertest');
const app = require('../../app');
const { Subscription } = require('../db/models');

describe('GET /unsubscribe/:token', () => {
  it('should unsubscribe a user with valid token', async () => {
    const subscriber = await Subscription.create({
      email: 'unsubscribe@example.com',
      city: 'Lviv',
      frequency: 'daily',
      confirmed: true,
      token: 'test-unsub-token'
    });

    const response = await request(app).get(`/api/unsubscribe/${subscriber.token}`);

    expect(response.statusCode).toBe(302);
    expect(response.header['location']).toMatch(/\/subscribe\.html\?status=unsubscribed/);

    const deleted = await Subscription.findByPk(subscriber.id);
    expect(deleted).toBeNull();
  });

  it('should return 404 for invalid token', async () => {
    const response = await request(app).get('/api/confirm/non-existing-token');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/Token not found/i);
  });
})

