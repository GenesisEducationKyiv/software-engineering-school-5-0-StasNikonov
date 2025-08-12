class CronWeatherEmailHandler {
  constructor(weatherEmailService) {
    this.weatherEmailService = weatherEmailService;
  }

  runHourly = async () => {
    console.log('⏰ Hourly weather update');
    await this.weatherEmailService.sendEmails('hourly');
  };

  runDaily = async () => {
    console.log('📩 Daily weather update');
    await this.weatherEmailService.sendEmails('daily');
  };
}

module.exports = CronWeatherEmailHandler;
