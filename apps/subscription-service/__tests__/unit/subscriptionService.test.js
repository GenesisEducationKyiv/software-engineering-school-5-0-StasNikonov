jest.mock('../../src/broker/publishToQueue', () => jest.fn());

const publishToQueue = require('../../src/broker/publishToQueue');
const SubscriptionService = require('../../src/services/SubscriptionService');

describe('SubscriptionService', () => {
  let subscriptionRepositoryMock;
  let service;

  beforeEach(() => {
    subscriptionRepositoryMock = {
      findSubscription: jest.fn(),
      createSubscription: jest.fn(),
      findByToken: jest.fn(),
      confirmSubscription: jest.fn(),
      deleteSubscription: jest.fn(),
      getConfirmedByFrequency: jest.fn(),
    };

    service = new SubscriptionService(subscriptionRepositoryMock);

    jest.clearAllMocks();
  });

  describe('subscribe', () => {
    it('returns 409 if email already exist', async () => {
      subscriptionRepositoryMock.findSubscription.mockResolvedValue(true);

      const result = await service.subscribe({
        email: 'test@gmail.com',
        city: 'Kyiv',
        frequency: 'daily',
      });

      expect(result.status).toBe(409);
      expect(result.message).toBe('Email already exists');
      expect(publishToQueue).not.toHaveBeenCalled();
    });

    it('creates subscription and publishes confirmation email command', async () => {
      subscriptionRepositoryMock.findSubscription.mockResolvedValue(null);
      subscriptionRepositoryMock.createSubscription.mockResolvedValue();

      const result = await service.subscribe({
        email: 'test@gmail.com',
        city: 'Kyiv',
        frequency: 'daily',
      });

      expect(
        subscriptionRepositoryMock.createSubscription,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@gmail.com',
          city: 'Kyiv',
          frequency: 'daily',
          token: expect.any(String),
        }),
      );

      expect(publishToQueue).toHaveBeenCalledWith(
        'send_confirmation_email',
        expect.objectContaining({
          email: 'test@gmail.com',
          city: 'Kyiv',
          token: expect.any(String),
        }),
      );

      expect(result.status).toBe(200);
      expect(result.message).toBe(
        'Subscription successful. Confirmation email sent.',
      );
    });
  });

  describe('confirm', () => {
    it('returns 404 if token not found', async () => {
      subscriptionRepositoryMock.findByToken.mockResolvedValue(null);

      const result = await service.confirm({ token: 'token123' });

      expect(result.status).toBe(404);
      expect(result.message).toBe('Token not found');
    });

    it('returns 409 if already confirmed', async () => {
      subscriptionRepositoryMock.findByToken.mockResolvedValue({
        confirmed: true,
      });

      const result = await service.confirm({ token: 'token123' });

      expect(result.status).toBe(409);
      expect(result.message).toBe('Already confirmed');
    });

    it('successfully confirms subscription', async () => {
      const subscription = { confirmed: false };
      subscriptionRepositoryMock.findByToken.mockResolvedValue(subscription);

      const result = await service.confirm({ token: 'token123' });

      expect(
        subscriptionRepositoryMock.confirmSubscription,
      ).toHaveBeenCalledWith(subscription);
      expect(result.status).toBe(200);
      expect(result.message).toBe('Subscription confirmed successfully');
    });
  });

  describe('unsubscribe', () => {
    it('returns 404 if token not found', async () => {
      subscriptionRepositoryMock.findByToken.mockResolvedValue(null);

      const result = await service.unsubscribe({ token: 'token123' });

      expect(result.status).toBe(404);
      expect(result.message).toBe('Token not found');
    });

    it('successfully unsubscribes', async () => {
      const subscription = {};
      subscriptionRepositoryMock.findByToken.mockResolvedValue(subscription);

      const result = await service.unsubscribe({ token: 'token123' });

      expect(
        subscriptionRepositoryMock.deleteSubscription,
      ).toHaveBeenCalledWith(subscription);
      expect(result.status).toBe(200);
      expect(result.message).toBe('Unsubscribed successfully');
    });
  });

  describe('getConfirmedByFrequency', () => {
    it('returns subscriptions by frequency', async () => {
      const subs = [{ email: 'test@gmail.com' }];
      subscriptionRepositoryMock.getConfirmedByFrequency.mockResolvedValue(
        subs,
      );

      const result = await service.getConfirmedByFrequency('daily');
      expect(result).toBe(subs);
    });
  });
});
