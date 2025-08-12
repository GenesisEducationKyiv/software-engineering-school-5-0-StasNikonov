const formatWeatherResponse = require('../../src/utils/formatResponse');

describe('formatWeather', () => {
  it('should format raw weather data correctly', () => {
    const weather = {
      city: 'Kyiv',
      temperature: 20.5,
      humidity: 10,
      description: 'clear sky',
    };

    const output = formatWeatherResponse(weather);

    expect(output).toEqual({
      message: `Weather forecast for Kyiv`,
      temperature: '20.5°C',
      humidity: '10%',
      description: 'clear sky',
    });
  });
});
