const express = require('express');
const router = express.Router();
const weatherController = require('../controllers');
const validateWeatherInput = require('../middlewares/validateWeatherInput');

router.get('/weather', validateWeatherInput, weatherController.getWeather);

router.get('/weather/validate-city', weatherController.validateCity);

module.exports = router;
