const express = require('express');
const router = express.Router();
const weatherController = require('../infrastructure/compositionRoot/weatherController');
const validateWeatherInput = require('../infrastructure/compositionRoot/validateWeatherInput');

router.get(
  '/weather',
  validateWeatherInput,
  weatherController.getFormattedWeatherResponse,
);

module.exports = router;
