const WeatherEmailService = require('../../src/services/WeatherEmailService');

describe('WeatherEmailService', () => {
  let weatherClientMock;
  let emailAdapterMock;
  let subscriptionClientMock;
  let service;

  beforeEach(() => {
    weatherClientMock = {
      GetCurrentWeather: jest.fn(),
    };

    emailAdapterMock = {
      sendWeatherEmail: jest.fn(),
    };

    subscriptionClientMock = {
      GetConfirmedByFrequency: jest.fn(),
    };

    service = new WeatherEmailService(
      weatherClientMock,
      emailAdapterMock,
      subscriptionClientMock,
    );
  });

  test('should send emails to all confirmed subscribers', async () => {
    const frequency = 'daily';
    const subscribers = [
      { email: 'user1@example.com', city: 'Kyiv' },
      { email: 'user2@example.com', city: 'Lviv' },
    ];
    const weatherKyiv = { temperature: 20 };
    const weatherLviv = { temperature: 25 };

    subscriptionClientMock.GetConfirmedByFrequency.mockImplementation(
      (_, callback) => callback(null, { subscribers }),
    );

    weatherClientMock.GetCurrentWeather.mockImplementationOnce((_, callback) =>
      callback(null, weatherKyiv),
    ).mockImplementationOnce((_, callback) => callback(null, weatherLviv));

    emailAdapterMock.sendWeatherEmail.mockResolvedValue();

    await service.sendEmails(frequency);

    expect(subscriptionClientMock.GetConfirmedByFrequency).toHaveBeenCalledWith(
      { frequency },
      expect.any(Function),
    );

    expect(weatherClientMock.GetCurrentWeather).toHaveBeenCalledTimes(2);
    expect(weatherClientMock.GetCurrentWeather).toHaveBeenNthCalledWith(
      1,
      { city: 'Kyiv' },
      expect.any(Function),
    );
    expect(weatherClientMock.GetCurrentWeather).toHaveBeenNthCalledWith(
      2,
      { city: 'Lviv' },
      expect.any(Function),
    );

    expect(emailAdapterMock.sendWeatherEmail).toHaveBeenCalledTimes(2);
    expect(emailAdapterMock.sendWeatherEmail).toHaveBeenCalledWith(
      subscribers[0],
      weatherKyiv,
    );
    expect(emailAdapterMock.sendWeatherEmail).toHaveBeenCalledWith(
      subscribers[1],
      weatherLviv,
    );
  });

  test('should handle error when retrieving subscribers', async () => {
    const frequency = 'daily';

    subscriptionClientMock.GetConfirmedByFrequency.mockImplementation(
      (_, callback) => callback(new Error('DB error'), null),
    );

    console.error = jest.fn();

    await service.sendEmails(frequency);

    expect(console.error).toHaveBeenCalledWith(
      'Error retrieving subscribers:',
      'DB error',
    );
  });

  test('should handle error when sending email for a subscriber', async () => {
    const frequency = 'daily';
    const subscribers = [{ email: 'user@example.com', city: 'Kyiv' }];
    const weatherData = { temperature: 20 };

    subscriptionClientMock.GetConfirmedByFrequency.mockImplementation(
      (_, callback) => callback(null, { subscribers }),
    );

    weatherClientMock.GetCurrentWeather.mockImplementation((_, callback) =>
      callback(null, weatherData),
    );

    emailAdapterMock.sendWeatherEmail.mockRejectedValue(
      new Error('SMTP error'),
    );

    console.error = jest.fn();

    await service.sendEmails(frequency);

    expect(console.error).toHaveBeenCalledWith(
      `Failed to send email to ${subscribers[0].email}:`,
      'SMTP error',
    );
  });

  test('should handle error when fetching weather for a subscriber', async () => {
    const frequency = 'daily';
    const subscribers = [{ email: 'user@example.com', city: 'Kyiv' }];

    subscriptionClientMock.GetConfirmedByFrequency.mockImplementation(
      (_, callback) => callback(null, { subscribers }),
    );

    weatherClientMock.GetCurrentWeather.mockImplementation((_, callback) =>
      callback(new Error('API error'), null),
    );

    console.error = jest.fn();

    await service.sendEmails(frequency);

    expect(console.error).toHaveBeenCalledWith(
      `Failed to send email to ${subscribers[0].email}:`,
      'API error',
    );
  });
});
