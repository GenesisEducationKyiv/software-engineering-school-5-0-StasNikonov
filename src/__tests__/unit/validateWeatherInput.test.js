jest.mock('../../utils/validators/cityValidator', () => ({
  validateCity: jest.fn(),
}));

const {
  validateWeatherInput,
} = require('../../api/middlewares/validateWeatherInput');
const { validateCity } = require('../../utils/validators/cityValidator');

describe('validateWeatherInput middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    validateCity.mockReset();
  });

  it('calls next() when city are valid', async () => {
    req.query = { city: 'Kyiv' };
    validateCity.mockResolvedValue(true);

    await validateWeatherInput(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('responds with 400 and "City parameter is required" message if city fields are missing', async () => {
    req.query = {};
    validateCity.mockResolvedValue(true);

    await validateWeatherInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City parameter is required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds with 404 and "City not found" message if city validation fails', async () => {
    req.query = { city: 'UnknownCity' };
    validateCity.mockResolvedValue(false);

    await validateWeatherInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City not found',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds with 500 if validateCity throws error', async () => {
    req.query = { city: 'Kyiv' };
    validateCity.mockRejectedValue(new Error('Test error'));

    await validateWeatherInput(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Internal Server Error',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('trims and normalizes city name before validating', async () => {
    req.query = { city: '  KYIV  ' };
    validateCity.mockResolvedValue(true);

    await validateWeatherInput(req, res, next);

    expect(validateCity).toHaveBeenCalledWith('KYIV');
    expect(next).toHaveBeenCalled();
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
