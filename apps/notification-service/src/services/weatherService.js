const weatherClient = require('../clients/weatherClient');

function getWeather(city) {
  return new Promise((resolve, reject) => {
    weatherClient.GetCurrentWeather({ city }, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

module.exports = { getWeather };
