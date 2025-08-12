class WeatherController {
  constructor(weatherClient, logger) {
    this.weatherClient = weatherClient;
    this.logger = logger;
  }
  getWeather = (req, res) => {
    const { city } = req.query;

    this.weatherClient.GetCurrentWeather({ city }, (err, response) => {
      if (err) {
        this.logger.error(`gRPC error: ${err}`);
        return res.status(500).json({ error: 'Failed to get weather' });
      }
      res.json(response);
    });
  };

  validateCity = (req, res) => {
    const { city } = req.query;
    if (!city) {
      this.logger('Missing city parameter');
      return res.status(400).json({ error: 'Missing city parameter' });
    }

    this.weatherClient.ValidateCity({ city }, (err, response) => {
      if (err) {
        this.logger.error(`gRPC error: ${err}`);
        return res.status(500).json({ error: 'Failed to validate city' });
      }
      res.json(response);
    });
  };
}

module.exports = WeatherController;
