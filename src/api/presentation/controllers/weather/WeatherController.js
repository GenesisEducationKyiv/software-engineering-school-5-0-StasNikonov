class WeatherController {
  constructor(weatherService, formatWeatherResponse) {
    this.weatherService = weatherService;
    this.formatWeatherResponse = formatWeatherResponse;
  }

  getFormattedWeatherResponse = async (req, res) => {
    const { city } = req.query;

    try {
      const weather = await this.weatherService.getWeather(city);
      const formatted = this.formatWeatherResponse(weather);
      res.status(200).json(formatted);
    } catch (error) {
      console.error('❌ getWeather error:', error.message);
      res
        .status(500)
        .json({ message: `Error in getWeather: ${error.message}` });
    }
  };
}

module.exports = WeatherController;
