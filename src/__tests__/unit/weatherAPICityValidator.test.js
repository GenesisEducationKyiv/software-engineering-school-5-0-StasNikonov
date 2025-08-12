const WeatherAPICityValidator = require('../../../src/api/services/cityValidation/WeatherAPICityValidator');

describe('WeatherAPICityValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new WeatherAPICityValidator();

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete global.fetch;
  });

  it('should return true for valid city', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 123,
          name: 'Kyiv',
          country: 'Ukraine',
        },
      ],
    });

    const result = await validator.validateCity('Kyiv');
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.weatherapi.com/v1/search.json?'),
    );
  });

  it('should return false for empty data array', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await validator.validateCity('InvalidCity');
    expect(result).toBe(false);
  });

  it('should throw error when response is not ok', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => [],
    });

    await expect(validator.validateCity('UnknownCity')).rejects.toThrow(
      'WeatherAPI status 404',
    );
  });

  it('should throw error on fetch error', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    await expect(validator.validateCity('Kyiv')).rejects.toThrow(
      'Network error',
    );
  });
});
