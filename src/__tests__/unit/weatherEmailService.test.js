const WeatherEmailServiceTest = require('../../api/application/services/email/WeatherEmailService');
const EmailAdapter = require('../../api/infrastructure/adapters/EmailAdapter');

describe('WeatherEmailServiceTest', () => {
  let dbMock;
  let weatherProviderMock;
  let emailAdapterMock;
  let service;

  const mockSubscriber = {
    email: 'user@example.com',
    city: 'Kyiv',
    frequency: 'daily',
  };

  beforeEach(() => {
    dbMock = {
      getConfirmedByFrequency: jest.fn(),
    };

    weatherProviderMock = {
      getWeather: jest.fn(),
    };

    emailAdapterMock = new EmailAdapter();
    jest
      .spyOn(emailAdapterMock, 'sendWeatherEmail')
      .mockClear()
      .mockResolvedValue();

    service = new WeatherEmailServiceTest(
      weatherProviderMock,
      emailAdapterMock,
      dbMock,
    );
  });

  it('should fetch subscribers and send weather emails', async () => {
    dbMock.getConfirmedByFrequency.mockResolvedValue([mockSubscriber]);
    weatherProviderMock.getWeather.mockResolvedValue({ temp: 25 });

    await service.sendEmails('daily');

    expect(dbMock.getConfirmedByFrequency).toHaveBeenCalledWith('daily');
    expect(weatherProviderMock.getWeather).toHaveBeenCalledWith('Kyiv');
    expect(emailAdapterMock.sendWeatherEmail).toHaveBeenCalledWith(
      mockSubscriber,
      { temp: 25 },
    );
  });

  it('should handle error in getWeather gracefully', async () => {
    dbMock.getConfirmedByFrequency.mockResolvedValue([mockSubscriber]);
    weatherProviderMock.getWeather.mockRejectedValue(
      new Error('weather failed'),
    );

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await service.sendEmails('daily');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Failed to send email/),
      'weather failed',
    );

    consoleSpy.mockRestore();
  });

  it('should handle error in sendWeatherEmail gracefully', async () => {
    dbMock.getConfirmedByFrequency.mockResolvedValue([mockSubscriber]);
    weatherProviderMock.getWeather.mockResolvedValue({ temp: 25 });
    emailAdapterMock.sendWeatherEmail.mockRejectedValue(
      new Error('email failed'),
    );

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await service.sendEmails('daily');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Failed to send email/),
      'email failed',
    );

    consoleSpy.mockRestore();
  });

  it('should log error if db.getConfirmedByFrequency fails', async () => {
    dbMock.getConfirmedByFrequency.mockRejectedValue(new Error('db failed'));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await service.sendEmails('daily');

    expect(consoleSpy).toHaveBeenCalledWith(
      '❌ Error retrieving subscribers:',
      'db failed',
    );

    consoleSpy.mockRestore();
  });

  it('should send weather emails to multiple subscribers', async () => {
    const subscribers = [
      { email: 'user1@example.com', city: 'Kyiv', frequency: 'daily' },
      { email: 'user2@example.com', city: 'Lviv', frequency: 'daily' },
    ];

    dbMock.getConfirmedByFrequency.mockResolvedValue(subscribers);
    weatherProviderMock.getWeather.mockResolvedValue({ temp: 20 });

    await service.sendEmails('daily');

    expect(dbMock.getConfirmedByFrequency).toHaveBeenCalledWith('daily');
    expect(weatherProviderMock.getWeather).toHaveBeenCalledTimes(2);
    expect(weatherProviderMock.getWeather).toHaveBeenCalledWith('Kyiv');
    expect(weatherProviderMock.getWeather).toHaveBeenCalledWith('Lviv');
    expect(emailAdapterMock.sendWeatherEmail).toHaveBeenCalledTimes(2);
  });

  it('should fetch and send emails for hourly frequency', async () => {
    dbMock.getConfirmedByFrequency.mockResolvedValue([mockSubscriber]);
    weatherProviderMock.getWeather.mockResolvedValue({ temp: 18 });

    await service.sendEmails('hourly');

    expect(dbMock.getConfirmedByFrequency).toHaveBeenCalledWith('hourly');
    expect(weatherProviderMock.getWeather).toHaveBeenCalledWith('Kyiv');
    expect(emailAdapterMock.sendWeatherEmail).toHaveBeenCalled();
  });

  it('should do nothing if no subscribers found', async () => {
    dbMock.getConfirmedByFrequency.mockResolvedValue([]);

    await service.sendEmails('daily');

    expect(dbMock.getConfirmedByFrequency).toHaveBeenCalledWith('daily');
    expect(weatherProviderMock.getWeather).not.toHaveBeenCalled();
    expect(emailAdapterMock.sendWeatherEmail).not.toHaveBeenCalled();
  });

  it('should send emails correctly for multiple hourly subscribers', async () => {
    const subscribers = [
      { email: 'hourly1@example.com', city: 'Kyiv', frequency: 'hourly' },
      { email: 'hourly2@example.com', city: 'Lviv', frequency: 'hourly' },
    ];

    dbMock.getConfirmedByFrequency.mockResolvedValue(subscribers);
    weatherProviderMock.getWeather.mockImplementation(async (city) => ({
      temp: city === 'Kyiv' ? 15 : 10,
    }));

    await service.sendEmails('hourly');

    expect(dbMock.getConfirmedByFrequency).toHaveBeenCalledWith('hourly');
    expect(weatherProviderMock.getWeather).toHaveBeenCalledTimes(2);
    expect(weatherProviderMock.getWeather).toHaveBeenCalledWith('Kyiv');
    expect(weatherProviderMock.getWeather).toHaveBeenCalledWith('Lviv');
    expect(emailAdapterMock.sendWeatherEmail).toHaveBeenCalledTimes(2);
    expect(emailAdapterMock.sendWeatherEmail).toHaveBeenCalledWith(
      subscribers[0],
      { temp: 15 },
    );
    expect(emailAdapterMock.sendWeatherEmail).toHaveBeenCalledWith(
      subscribers[1],
      { temp: 10 },
    );
  });
});
