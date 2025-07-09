jest.mock('../../utils/validators/cityValidator', () => ({
  validateCity: jest.fn(),
}));

const {
  validateSubscriptionInput,
} = require('../../api/middlewares/validateSubscriptionInput');
const { validateCity } = require('../../utils/validators/cityValidator');

describe('validateSubscriptionInput middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    validateCity.mockReset();
  });

  it('calls next() when all inputs are valid', async () => {
    req.body = { email: 'test@test.com', city: 'Kyiv', frequency: 'daily' };
    validateCity.mockResolvedValue(true);

    await validateSubscriptionInput(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('responds with 400 and "Invalid input" message if required fields are missing', async () => {
    req.body = { email: 'test@test.com', frequency: 'daily' };

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Invalid input',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds with 400 and "Invalid email format" message if email is malformed', async () => {
    req.body = { email: 'bad-email', city: 'Kyiv', frequency: 'daily' };

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Invalid email format',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds with 400 and "Invalid frequency value" message if frequency is not allowed', async () => {
    req.body = { email: 'test@test.com', city: 'Kyiv', frequency: 'invalid' };

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Invalid frequency value',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds with 404 and "City not found" message if city validation fails', async () => {
    req.body = {
      email: 'test@test.com',
      city: 'UnknownCity',
      frequency: 'daily',
    };
    validateCity.mockResolvedValue(false);

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City not found',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds with 500 if validateCity throws error', async () => {
    req.body = { email: 'test@test.com', city: 'Kyiv', frequency: 'daily' };
    validateCity.mockRejectedValue(new Error('Test error'));

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Internal Server Error',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if email is not a string', async () => {
    req.body = {
      email: 12345,
      city: 'Kyiv',
      frequency: 'daily',
    };

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Invalid input',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if city is an empty string', async () => {
    req.body = {
      email: 'test@test.com',
      city: '',
      frequency: 'daily',
    };

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Invalid input',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should validate email case-insensitively', async () => {
    req.body = {
      email: 'TEST@TEST.COM',
      city: 'Kyiv',
      frequency: 'daily',
    };
    validateCity.mockResolvedValue(true);

    await validateSubscriptionInput(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if city is an object', async () => {
    req.body = {
      email: 'test@test.com',
      city: { name: 'Kyiv' },
      frequency: 'daily',
    };

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Invalid input',
    });
  });
});
