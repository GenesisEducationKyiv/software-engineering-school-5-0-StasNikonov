class WeatherEmailService {
  constructor(weatherClient, emailAdapter, subscriptionRepository) {
    this.weatherClient = weatherClient;
    this.emailAdapter = emailAdapter;
    this.subscriptionRepository = subscriptionRepository;
  }

  async sendEmails(frequency) {
    try {
      const subscribers =
        await this.subscriptionRepository.getConfirmedByFrequency(frequency);

      for (let subscriber of subscribers) {
        try {
          const weather = await new Promise((resolve, reject) => {
            this.weatherClient.GetCurrentWeather(
              { city: subscriber.city },
              (err, response) => {
                if (err) return reject(err);
                resolve(response);
              },
            );
          });
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
