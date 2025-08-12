const express = require('express');
const router = express.Router();
const weatherController = require('../infrastructure/compositionRoot/controllers/weatherController');
const validateWeatherInput = require('../infrastructure/compositionRoot/validators/validateWeatherInput');

router.get(
  '/weather',
  validateWeatherInput,
  weatherController.getFormattedWeatherResponse,
);

module.exports = router;
