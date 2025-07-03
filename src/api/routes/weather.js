const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather/index');
const { validateWeatherInput } = require('../middlewares/validateWeatherInput');

router.get(
  '/weather',
  validateWeatherInput,
  weatherController.getFormattedWeatherResponse,
);

module.exports = router;
