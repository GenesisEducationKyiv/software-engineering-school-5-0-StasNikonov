function getCurrentWeather(weatherService) {
  return (call, callback) => {
    const city = call.request.city;
    weatherService
      .getWeather(city)
      .then((data) => callback(null, data))
      .catch((err) => callback(err));
  };
}

function validateCity(weatherService) {
  return (call, callback) => {
    const city = call.request.city;
    weatherService
      .validateCity(city)
      .then((isValid) => callback(null, { isValid }))
      .catch((error) => {
        console.error('ValidateCity error:', error.message);
        callback(null, { isValid: false });
      });
  };
}

module.exports = { getCurrentWeather, validateCity };
