const {
  sendWeatherEmailToSubscribers,
} = require('../../api/services/weatherEmailService');
const { sendWeatherEmail } = require('../../api/adapters/EmailAdapter');

jest.mock('../../api/adapters/EmailAdapter');

describe('sendWeatherEmailToSubscribers', () => {
  let db;
  let getWeather;

  const mockSubscriber = {
    email: 'user@example.com',
    city: 'Kyiv',
    frequency: 'daily',
  };

  beforeEach(() => {
    db = {
      getConfirmedByFrequency: jest.fn(),
    };
    getWeather = jest.fn();
    sendWeatherEmail.mockClear();
  });

  it('should fetch subscribers and send weather emails', async () => {
    db.getConfirmedByFrequency.mockResolvedValue([mockSubscriber]);
    getWeather.mockResolvedValue({ temp: 25 });

    await sendWeatherEmailToSubscribers('daily', getWeather, null, db);

    expect(db.getConfirmedByFrequency).toHaveBeenCalledWith('daily');
    expect(getWeather).toHaveBeenCalledWith('Kyiv');
    expect(sendWeatherEmail).toHaveBeenCalledWith(mockSubscriber, { temp: 25 });
  });

  it('should handle error in getWeather gracefully', async () => {
    db.getConfirmedByFrequency.mockResolvedValue([mockSubscriber]);
    getWeather.mockRejectedValue(new Error('weather failed'));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await sendWeatherEmailToSubscribers('daily', getWeather, null, db);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Failed to send email/),
      'weather failed',
    );
    consoleSpy.mockRestore();
  });

  it('should handle error in sendWeatherEmail gracefully', async () => {
    db.getConfirmedByFrequency.mockResolvedValue([mockSubscriber]);
    getWeather.mockResolvedValue({ temp: 25 });
    sendWeatherEmail.mockRejectedValue(new Error('email failed'));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await sendWeatherEmailToSubscribers('daily', getWeather, null, db);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Failed to send email/),
      'email failed',
    );
    consoleSpy.mockRestore();
  });

  it('should log error if db.getConfirmedByFrequency fails', async () => {
    db.getConfirmedByFrequency.mockRejectedValue(new Error('db failed'));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await sendWeatherEmailToSubscribers('daily', getWeather, null, db);

    expect(consoleSpy).toHaveBeenCalledWith(
      '❌ Error retrieving subscribers:',
      'db failed',
    );
    consoleSpy.mockRestore();
  });
});
