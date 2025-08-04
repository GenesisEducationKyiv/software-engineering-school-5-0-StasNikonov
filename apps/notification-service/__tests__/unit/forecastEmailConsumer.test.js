const emailAdapter = require('../../src/adapters/index');
const { getWeather } = require('../../src/services/weatherService');

jest.mock('../../src/adapters/index');
jest.mock('../../src/services/weatherService');

describe('forecastEmailConsumer handler', () => {
  it('should fetch weather and send email', async () => {
    const data = { email: 'user@example.com', city: 'Lviv' };
    const fakeWeather = { temp: 20 };

    getWeather.mockResolvedValue(fakeWeather);

    const handler = async ({ email, city }) => {
      const weather = await getWeather(city);
      await emailAdapter.sendWeatherEmail({ email, city }, weather);
    };

    await handler(data);

    expect(getWeather).toHaveBeenCalledWith('Lviv');
    expect(emailAdapter.sendWeatherEmail).toHaveBeenCalledWith(
      { email: 'user@example.com', city: 'Lviv' },
      fakeWeather,
    );
  });
});
