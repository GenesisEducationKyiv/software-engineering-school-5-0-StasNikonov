const validateSubscriptionInput = require('../../../src/api/infrastructure/compositionRoot/validators/validateSubscriptionInput');
const {
  cityValidator,
} = require('../../api/presentation/validation/cityValidator');

jest.mock('../../api/presentation/validation/cityValidator');

describe('createValidateSubscriptionInput middleware', () => {
  const mockIsValidEmail = jest.fn();
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test('should reject if email is not a string', async () => {
    const req = { body: { email: 123, city: 'Kyiv', frequency: 'daily' } };
    const res = createMockResponse();

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Email must be a string',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject if city is an empty string', async () => {
    const req = {
      body: { email: 'test@example.com', city: '', frequency: 'daily' },
    };
    const res = createMockResponse();

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City must be a non-empty string',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject if email is invalid', async () => {
    mockIsValidEmail.mockReturnValue(false);
    const req = {
      body: { email: 'invalid-email', city: 'Kyiv', frequency: 'daily' },
    };
    const res = createMockResponse();

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Invalid email format',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject if frequency is invalid', async () => {
    mockIsValidEmail.mockReturnValue(true);
    const req = {
      body: { email: 'test@example.com', city: 'Kyiv', frequency: 'weekly' },
    };
    const res = createMockResponse();

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Invalid frequency value',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject if city validation fails', async () => {
    mockIsValidEmail.mockReturnValue(true);
    cityValidator.validateCity = jest.fn().mockResolvedValue(false);
    const req = {
      body: { email: 'test@example.com', city: 'Atlantis', frequency: 'daily' },
    };
    const res = createMockResponse();

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City not found',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
