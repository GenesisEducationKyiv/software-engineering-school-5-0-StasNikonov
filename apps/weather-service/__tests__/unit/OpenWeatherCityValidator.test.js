const OpenWeatherCityValidator = require('../../src/validation/OpenWeatherCityValidator');

describe('OpenWeatherCityValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new OpenWeatherCityValidator();
  });

  beforeAll(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should return true for valid city', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ name: 'Lviv' }],
    });

    const result = await validator.validateCity('Lviv');
    expect(result).toBe(true);
  });

  test('should return false for empty array', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await validator.validateCity('UnknownCity');
    expect(result).toBe(false);
  });

  test('should return false for response not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const result = await validator.validateCity('UnknownCity');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('OpenWeatherMap returned status 404'),
    );
    expect(result).toBe(false);

    consoleWarnSpy.mockRestore();
  });

  test('should return false on fetch error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = await validator.validateCity('UnknownCity');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'OpenWeatherMap validation error:',
      'Network error',
    );
    expect(result).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
