const {
  validateWeatherInput,
} = require('../../../src/api/middlewares/validateWeatherInput');
const {
  cityValidator,
} = require('../../../src/api/services/cityValidation/cityValidator');

jest.mock('../../../src/api/services/cityValidation/cityValidator');

describe('validateWeatherInput middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: { city: 'Kyiv' } };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() if city is valid', async () => {
    cityValidator.validateCity = jest.fn().mockResolvedValue(true);

    await validateWeatherInput(req, res, next);

    expect(cityValidator.validateCity).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 if city is missing', async () => {
    req.query.city = '';

    await validateWeatherInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City parameter is required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 if city is invalid', async () => {
    cityValidator.validateCity = jest.fn().mockResolvedValue(false);

    await validateWeatherInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City not found',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 if validator throws', async () => {
    cityValidator.validateCity.mockRejectedValue(new Error('Unexpected error'));

    await validateWeatherInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Internal Server Error',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 if multiple city query params are provided', async () => {
    req.query = { city: ['Kyiv', 'London'] };

    await validateWeatherInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City parameter must be a single value',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
