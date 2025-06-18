const express = require('express');
const router = express.Router();
const { weatherController } = require('../controllers/weatherController');
const { validateWeatherInput } = require('../middlewares/validateWeatherInput');

router.get('/weather', validateWeatherInput, weatherController);

module.exports = router;
