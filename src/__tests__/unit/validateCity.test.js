const WeatherAPIProvider = require('../../api/providers/WeatherAPIProvider');
const { validateCity } = require('../../utils/validators/cityValidator');

describe('validateCity', () => {
  beforeEach(() => {
    jest.restoreAllMocks();

    jest.spyOn(WeatherAPIProvider.prototype, 'fetch');
  });

  it('should return true if normalized returned city equals normalized input city', async () => {
    WeatherAPIProvider.prototype.fetch.mockResolvedValue({
      location: { name: 'Kyiv' },
    });

    const result = await validateCity('Kyiv');

    expect(result).toBe(true);
  });

  it('should return true if input city differs in case or spaces but normalizes equal', async () => {
    WeatherAPIProvider.prototype.fetch.mockResolvedValue({
      location: { name: '  KyiV  ' },
    });

    const result = await validateCity('kyiv');

    expect(result).toBe(true);
  });

  it('should return false if normalized cities do not match', async () => {
    WeatherAPIProvider.prototype.fetch.mockResolvedValue({
      location: { name: 'Unknown' },
    });

    const result = await validateCity('Kyiv');

    expect(result).toBe(false);
  });

  it('should return false if fetchWeatherData throws an error', async () => {
    WeatherAPIProvider.prototype.fetch.mockRejectedValue(
      new Error('API error'),
    );

    const result = await validateCity('Kyiv');

    expect(result).toBe(false);
  });

  it('should handle city names with multiple spaces correctly', async () => {
    WeatherAPIProvider.prototype.fetch.mockResolvedValue({
      location: { name: 'New   York' },
    });

    const result = await validateCity('New York');

    expect(result).toBe(true);
  });

  it('should return false for empty city string', async () => {
    const result = await validateCity('');

    expect(result).toBe(false);
  });

  it('should return false if API returns null', async () => {
    WeatherAPIProvider.prototype.fetch.mockResolvedValue(null);

    const result = await validateCity('Kyiv');

    expect(result).toBe(false);
  });

  it('should return false if API returns undefined', async () => {
    WeatherAPIProvider.prototype.fetch.mockResolvedValue(undefined);

    const result = await validateCity('Kyiv');

    expect(result).toBe(false);
  });

  it('should return false if API returns object without location', async () => {
    WeatherAPIProvider.prototype.fetch.mockResolvedValue({});

    const result = await validateCity('Kyiv');

    expect(result).toBe(false);
  });

  it('should return false if location.name is missing', async () => {
    WeatherAPIProvider.prototype.fetch.mockResolvedValue({
      location: {},
    });

    const result = await validateCity('Kyiv');

    expect(result).toBe(false);
  });
});
