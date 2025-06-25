class WeatherEmailService {
  constructor(weatherProvider, emailAdapter, subscriptionRepository) {
    this.weatherProvider = weatherProvider;
    this.emailAdapter = emailAdapter;
    this.subscriptionRepository = subscriptionRepository;
  }

  async sendEmails(frequency) {
    try {
      const subscribers =
        await this.subscriptionRepository.getConfirmedByFrequency(frequency);

      for (let subscriber of subscribers) {
        try {
          const weather = await this.weatherProvider.getWeather(
            subscriber.city,
          );
          await this.emailAdapter.sendWeatherEmail(subscriber, weather);
        } catch (err) {
          console.error(
            `❌ Failed to send email to ${subscriber.email}:`,
            err.message,
          );
        }
      }
    } catch (error) {
      console.error('❌ Error retrieving subscribers:', error.message);
    }
  }
}

module.exports = WeatherEmailService;
