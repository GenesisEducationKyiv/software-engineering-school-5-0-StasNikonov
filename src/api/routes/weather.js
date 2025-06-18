const express = require('express');
const router = express.Router();
const { weatherController } = require('../controllers/weatherController');
const {
  validateWeatherFields,
} = require('../middlewares/validateWeatherInput');

router.get('/weather', validateWeatherFields, weatherController);

module.exports = router;
