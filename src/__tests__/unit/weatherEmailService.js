const WeatherEmailService = require('../../api/services/weatherEmailService');
const EmailAdapter = require('../../api/adapters/EmailAdapter');

describe('WeatherEmailService', () => {
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

    service = new WeatherEmailService(
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
});
