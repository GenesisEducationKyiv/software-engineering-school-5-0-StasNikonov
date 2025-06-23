const SubscriptionService = require('../../api/services/subscriptionService');

describe('SubscriptionService', () => {
  let subscriptionService;
  let mockDb;
  let mockEmailAdapter;

  beforeEach(() => {
    mockDb = {
      findSubscription: jest.fn(),
      createSubscription: jest.fn(),
      findByToken: jest.fn(),
      confirmSubscription: jest.fn(),
      deleteSubscription: jest.fn(),
    };

    mockEmailAdapter = {
      sendConfirmationEmail: jest.fn(),
    };

    subscriptionService = new SubscriptionService(mockDb, mockEmailAdapter);
  });

  describe('subscribe', () => {
    it('should return 409 if subscription already exists', async () => {
      mockDb.findSubscription.mockResolvedValue(true);

      const result = await subscriptionService.subscribe({
        email: 'test@test.com',
        city: 'Kyiv',
        frequency: 'daily',
      });

      expect(result.status).toBe(409);
      expect(result.message).toMatch(/Email already exists/);
    });

    it('should create subscription and send confirmation email', async () => {
      mockDb.findSubscription.mockResolvedValue(null);
      mockDb.createSubscription.mockResolvedValue();
      mockEmailAdapter.sendConfirmationEmail.mockResolvedValue();

      const result = await subscriptionService.subscribe({
        email: 'test@test.com',
        city: 'Kyiv',
        frequency: 'daily',
      });

      expect(mockDb.createSubscription).toHaveBeenCalledWith({
        email: 'test@test.com',
        city: 'Kyiv',
        frequency: 'daily',
        token: expect.any(String), // токен генерується через uuid
      });

      expect(mockEmailAdapter.sendConfirmationEmail).toHaveBeenCalledWith(
        'test@test.com',
        'Kyiv',
        expect.any(String),
      );

      expect(result.status).toBe(200);
      expect(result.message).toMatch(
        /Subscription successful. Confirmation email sent./i,
      );
    });
  });

  describe('confirm', () => {
    it('should return 404 if token not found', async () => {
      mockDb.findByToken.mockResolvedValue(null);

      const result = await subscriptionService.confirm({ token: 'bad-token' });

      expect(result.status).toBe(404);
      expect(result.message).toMatch(/Token not found/i);
    });

    it('should confirm subscription if token is valid', async () => {
      const fakeSub = {};
      mockDb.findByToken.mockResolvedValue(fakeSub);

      const result = await subscriptionService.confirm({ token: 'good-token' });

      expect(mockDb.confirmSubscription).toHaveBeenCalledWith(fakeSub);
      expect(result.status).toBe(200);
      expect(result.message).toMatch(/Subscription confirmed successfully/i);
    });
  });

  describe('unsubscribe', () => {
    it('should return 404 if token not found', async () => {
      mockDb.findByToken.mockResolvedValue(null);

      const result = await subscriptionService.unsubscribe({
        token: 'bad-token',
      });

      expect(result.status).toBe(404);
      expect(result.message).toMatch(/Token not found/i);
    });

    it('should delete subscription if token is valid', async () => {
      const fakeSub = {};
      mockDb.findByToken.mockResolvedValue(fakeSub);

      const result = await subscriptionService.unsubscribe({
        token: 'good-token',
      });

      expect(mockDb.deleteSubscription).toHaveBeenCalledWith(fakeSub);
      expect(result.status).toBe(200);
      expect(result.message).toMatch(/Unsubscribed successfully/i);
    });
  });
});
