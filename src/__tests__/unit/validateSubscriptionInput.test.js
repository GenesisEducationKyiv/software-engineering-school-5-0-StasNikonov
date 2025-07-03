const {
  validateSubscriptionInput,
} = require('../../../src/api/middlewares/validateSubscriptionInput');
const validators = require('../../../src/utils/validators/validateSubscriptionFields');
const cityValidator = require('../../api/services/cityValidation/cityValidator');

jest.mock('../../../src/utils/validators/validateSubscriptionFields');
jest.mock('../../../src/api/services/cityValidation/cityValidator');

describe('validateSubscriptionInput middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        city: 'Kyiv',
        frequency: 'daily',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it('should call next() if input is valid', async () => {
    validators.isValidFields.mockReturnValue({ valid: true });
    validators.isValidEmail.mockReturnValue(true);
    cityValidator.createValidator.mockReturnValue(() => Promise.resolve(true));

    await validateSubscriptionInput(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 if required fields are missing or invalid', async () => {
    validators.isValidFields.mockReturnValue({
      valid: false,
      status: 400,
      message: 'Missing fields',
    });

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Missing fields',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if email is invalid', async () => {
    validators.isValidFields.mockReturnValue({ valid: true });
    validators.isValidEmail.mockReturnValue(false);

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Invalid email format',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if frequency is invalid', async () => {
    validators.isValidFields.mockReturnValue({ valid: true });
    validators.isValidEmail.mockReturnValue(true);

    req.body.frequency = 'weekly';

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Invalid frequency value',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 if city is invalid', async () => {
    validators.isValidFields.mockReturnValue({ valid: true });
    validators.isValidEmail.mockReturnValue(true);
    cityValidator.createValidator.mockReturnValue(() => Promise.resolve(false));

    await validateSubscriptionInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City not found',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 on internal error', async () => {
    validators.isValidFields.mockImplementation(() => {
      throw new Error('Boom!');
    });

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
      message: 'Email must be a string',
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
      message: 'City must be a non-empty string',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
