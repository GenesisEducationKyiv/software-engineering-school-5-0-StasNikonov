const request = require('supertest');
const app = require('../../../app');
const { Subscription } = require('../../db/models');

describe('GET /confirm/:token', () => {
  const testEmail = 'confirm@example.com';
  const testToken = 'test-token-123';
  let subscription;

  beforeEach(async () => {
    subscription = await Subscription.create({
      email: testEmail,
      city: 'Kyiv',
      frequency: 'daily',
      confirmed: false,
      token: testToken,
    });
  });

  afterEach(async () => {
    await Subscription.destroy({ where: { email: testEmail } });
  });

  it('should confirm subscription with valid token', async () => {
    const response = await request(app).get(`/api/confirm/${testToken}`);

    expect(response.statusCode).toBe(200);

    const updated = await Subscription.findByPk(subscription.id);

    expect(updated.confirmed).toBe(true);
  });

  it('should return 404 for invalid token', async () => {
    const response = await request(app).get('/api/confirm/non-existing-token');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/Token not found/i);
  });

  it('should not confirm subscription again with the same token', async () => {
    const firstResponse = await request(app).get(`/api/confirm/${testToken}`);

    expect(firstResponse.statusCode).toBe(200);

    const secondResponse = await request(app).get(`/api/confirm/${testToken}`);

    expect(secondResponse.statusCode).toBe(409);
    expect(secondResponse.body.message).toMatch(/Already confirmed/i);
  });
});
