const { subscribe } = require('../../api/services/subscriptionService');
const { confirm } = require('../../api/services/subscriptionService');
const { unsubscribe } = require('../../api/services/subscriptionService');
const { sendConfirmationEmail } = require('../../api/adapters/EmailAdapter');

jest.mock('../../api/adapters/EmailAdapter');
jest.mock('uuid', () => ({ v4: jest.fn(() => 'mock-token') }));

describe('subscribe', () => {
  let db;

  beforeEach(() => {
    db = {
      findSubscription: jest.fn(),
      createSubscription: jest.fn(),
    };
    sendConfirmationEmail.mockClear();
  });

  it('should return 409 if subscription already exists', async () => {
    db.findSubscription.mockResolvedValue(true);

    const result = await subscribe(
      { email: 'test@test.com', city: 'Kyiv', frequency: 'daily' },
      db,
    );
    expect(result.status).toBe(409);
    expect(result.message).toMatch(/Email already exists/);
  });

  it('should create subscription and send confirmation email', async () => {
    db.findSubscription.mockResolvedValue(null);
    db.createSubscription.mockResolvedValue();
    sendConfirmationEmail.mockResolvedValue();

    const result = await subscribe(
      { email: 'test@test.com', city: 'Kyiv', frequency: 'daily' },
      db,
    );

    expect(db.createSubscription).toHaveBeenCalledWith({
      email: 'test@test.com',
      city: 'Kyiv',
      frequency: 'daily',
      token: 'mock-token',
    });

    expect(sendConfirmationEmail).toHaveBeenCalledWith(
      'test@test.com',
      'Kyiv',
      'mock-token',
    );
    expect(result.status).toBe(200);
    expect(result.message).toMatch(
      /Subscription successful. Confirmation email sent./i,
    );
  });
});

describe('confirm', () => {
  let db;

  beforeEach(() => {
    db = {
      findByToken: jest.fn(),
      confirmSubscription: jest.fn(),
    };
  });

  it('should return 404 if token is not found', async () => {
    db.findByToken.mockResolvedValue(null);

    const result = await confirm({ token: 'invalid-token' }, db);

    expect(result.status).toBe(404);
    expect(result.message).toMatch(/Token not found/i);
    expect(db.confirmSubscription).not.toHaveBeenCalled();
  });

  it('should confirm subscription if token is valid', async () => {
    const fakeSub = { email: 'test@test.com' };
    db.findByToken.mockResolvedValue(fakeSub);

    const result = await confirm({ token: 'valid-token' }, db);

    expect(db.confirmSubscription).toHaveBeenCalledWith(fakeSub);
    expect(result.status).toBe(200);
    expect(result.message).toMatch(/Subscription confirmed successfully/i);
  });
});

describe('unsubscribe', () => {
  let db;

  beforeEach(() => {
    db = {
      findByToken: jest.fn(),
      deleteSubscription: jest.fn(),
    };
  });

  it('should return 404 if token is not found', async () => {
    db.findByToken.mockResolvedValue(null);

    const result = await unsubscribe({ token: 'invalid-token' }, db);

    expect(result.status).toBe(404);
    expect(result.message).toMatch(/Token not found/i);
    expect(db.deleteSubscription).not.toHaveBeenCalled();
  });

  it('should delete subscription if token is valid', async () => {
    const fakeSub = { email: 'test@test.com' };
    db.findByToken.mockResolvedValue(fakeSub);

    const result = await unsubscribe({ token: 'valid-token' }, db);

    expect(db.deleteSubscription).toHaveBeenCalledWith(fakeSub);
    expect(result.status).toBe(200);
    expect(result.message).toMatch(/Unsubscribed successfully/i);
  });
});
