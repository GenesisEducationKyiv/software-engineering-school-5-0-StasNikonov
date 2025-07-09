const SubscriptionService = require('../../api/services/subscription/SubscriptionService');

describe('SubscriptionService', () => {
  let subscriptionRepository;
  let emailAdapter;
  let subscriptionService;

  beforeEach(() => {
    subscriptionRepository = {
      findSubscription: jest.fn(),
      createSubscription: jest.fn(),
      findByToken: jest.fn(),
      confirmSubscription: jest.fn(),
      deleteSubscription: jest.fn(),
    };

    emailAdapter = {
      sendConfirmationEmail: jest.fn(),
    };

    subscriptionService = new SubscriptionService(
      subscriptionRepository,
      emailAdapter,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribe', () => {
    it('should return 409 if subscription already exists', async () => {
      subscriptionRepository.findSubscription.mockResolvedValue({ id: 1 });

      const result = await subscriptionService.subscribe({
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: 'daily',
      });

      expect(result.status).toBe(409);
      expect(result.message).toBe('Email already exists');
    });

    it.each(['daily', 'hourly'])(
      'should create subscription and send email if not exists (frequency: %s)',
      async (frequency) => {
        subscriptionRepository.findSubscription.mockResolvedValue(null);
        subscriptionRepository.createSubscription.mockResolvedValue({});
        emailAdapter.sendConfirmationEmail.mockResolvedValue();

        const result = await subscriptionService.subscribe({
          email: 'test@example.com',
          city: 'Kyiv',
          frequency,
        });

        expect(subscriptionRepository.createSubscription).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'test@example.com',
            city: 'Kyiv',
            frequency,
            token: expect.any(String),
          }),
        );
        expect(emailAdapter.sendConfirmationEmail).toHaveBeenCalled();
        expect(result.status).toBe(200);
      },
    );

    it('should return 500 if sending email fails', async () => {
      subscriptionRepository.findSubscription.mockResolvedValue(null);
      subscriptionRepository.createSubscription.mockResolvedValue({});
      emailAdapter.sendConfirmationEmail.mockRejectedValue(
        new Error('Email failed'),
      );

      const result = await subscriptionService.subscribe({
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: 'daily',
      });

      expect(result.status).toBe(500);
      expect(result.message).toBe('Failed to send confirmation email');
    });
  });

  describe('confirm', () => {
    it('should return 404 if token not found', async () => {
      subscriptionRepository.findByToken.mockResolvedValue(null);

      const result = await subscriptionService.confirm({ token: 'abc' });

      expect(result.status).toBe(404);
      expect(result.message).toBe('Token not found');
    });

    it('should confirm subscription if token is valid', async () => {
      const subscription = { id: 1 };
      subscriptionRepository.findByToken.mockResolvedValue(subscription);
      subscriptionRepository.confirmSubscription.mockResolvedValue();

      const result = await subscriptionService.confirm({ token: 'abc' });

      expect(subscriptionRepository.confirmSubscription).toHaveBeenCalledWith(
        subscription,
      );
      expect(result.status).toBe(200);
    });
  });

  describe('unsubscribe', () => {
    it('should return 404 if token not found', async () => {
      subscriptionRepository.findByToken.mockResolvedValue(null);

      const result = await subscriptionService.unsubscribe({ token: 'abc' });

      expect(result.status).toBe(404);
      expect(result.message).toBe('Token not found');
    });

    it('should delete subscription if token is valid', async () => {
      const subscription = { id: 1 };
      subscriptionRepository.findByToken.mockResolvedValue(subscription);
      subscriptionRepository.deleteSubscription.mockResolvedValue();

      const result = await subscriptionService.unsubscribe({ token: 'abc' });

      expect(subscriptionRepository.deleteSubscription).toHaveBeenCalledWith(
        subscription,
      );
      expect(result.status).toBe(200);
    });
  });
});
