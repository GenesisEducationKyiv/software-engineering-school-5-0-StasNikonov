const express = require('express');
const router = express.Router();
const { weatherController } = require('../controllers/weather/index');
const {
  validateWeatherFields,
} = require('../middlewares/validateWeatherInput');

router.get(
  '/weather',
  validateWeatherFields,
  weatherController.getFormattedWeatherResponse,
);

module.exports = router;
