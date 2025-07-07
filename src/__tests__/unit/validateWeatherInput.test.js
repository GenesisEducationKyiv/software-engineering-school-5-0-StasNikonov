const {
  createValidateWeatherInput,
} = require('../../../src/api/presentation/middlewares/createValidateWeatherInput');

describe('createValidateWeatherInput middleware', () => {
  const next = jest.fn();
  const mockValidateCity = jest.fn();

  let middleware;

  beforeEach(() => {
    jest.clearAllMocks();
    middleware = createValidateWeatherInput(mockValidateCity);
  });

  const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test('should reject if city is an array', async () => {
    const req = { query: { city: ['Kyiv', 'Lviv'] } };
    const res = createMockResponse();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City parameter must be a single value',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject if city is empty', async () => {
    const req = { query: { city: '' } };
    const res = createMockResponse();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City parameter is required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject if city is invalid according to validator', async () => {
    mockValidateCity.mockResolvedValue(false);
    const req = { query: { city: 'FakeCity' } };
    const res = createMockResponse();

    await middleware(req, res, next);

    expect(mockValidateCity).toHaveBeenCalledWith('FakeCity');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'City not found',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle internal errors during validation', async () => {
    mockValidateCity.mockImplementation(() => {
      throw new Error('Network error');
    });

    const req = { query: { city: 'Kyiv' } };
    const res = createMockResponse();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: 'Internal Server Error',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should pass validation and call next()', async () => {
    mockValidateCity.mockResolvedValue(true);
    const req = { query: { city: 'Kyiv' } };
    const res = createMockResponse();

    await middleware(req, res, next);

    expect(mockValidateCity).toHaveBeenCalledWith('Kyiv');
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
