const OpenWeatherCityValidator = require('../../api/infrastructure/validation/OpenWeatherCityValidator');

describe('OpenWeatherCityValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new OpenWeatherCityValidator();

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete global.fetch;
  });

  it('should return true for valid city response', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          name: 'Kyiv',
          lat: 50.45,
          lon: 30.52,
          country: 'UA',
        },
      ],
    });

    const result = await validator.validateCity('Kyiv');
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.openweathermap.org/geo/1.0/direct?q=Kyiv'),
    );
  });

  it('should return false when response is ok but empty array', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await validator.validateCity('InvalidCity');
    expect(result).toBe(false);
  });

  it('should return false when response is not ok', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => [],
    });

    const result = await validator.validateCity('UnknownCity');
    expect(result).toBe(false);
  });

  it('should return false on fetch error', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const result = await validator.validateCity('Kyiv');
    expect(result).toBe(false);
  });
});
