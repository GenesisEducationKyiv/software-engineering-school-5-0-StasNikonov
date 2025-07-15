const express = require('express');
const router = express.Router();
const weatherClient = require('../clients/weatherClient');

router.get('/weather', (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'Missing city parameter' });

  weatherClient.GetCurrentWeather({ city }, (err, response) => {
    if (err) {
      console.error('gRPC error:', err);
      return res.status(500).json({ error: 'Failed to get weather' });
    }
    res.json(response);
  });
});

router.get('/weather/validate-city', (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'Missing city parameter' });

  weatherClient.ValidateCity({ city }, (err, response) => {
    if (err) {
      console.error('gRPC error:', err);
      return res.status(500).json({ error: 'Failed to validate city' });
    }
    res.json(response);
  });
});

module.exports = router;
