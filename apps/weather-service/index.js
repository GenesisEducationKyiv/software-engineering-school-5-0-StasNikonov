require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const Redis = require('redis');
const dataFormatter = require('./src/utils/formatResponse');
const createCityValidator = require('./src/validation/cityValidator');

const WeatherAPIProvider = require('./src/providers/WeatherAPIProvider');
const OpenWeatherMapProvider = require('./src/providers/OpenWeatherMapProvider');
const WeatherService = require('./src/services/weatherService');

const packageDefinition = protoLoader.loadSync(
  __dirname + '/src/grpc/weather.proto',
);
const weatherProto = grpc.loadPackageDefinition(packageDefinition).weather;

const redisClient = Redis.createClient();
redisClient.connect();

const provider1 = new WeatherAPIProvider();
const provider2 = new OpenWeatherMapProvider();
provider1.setNext(provider2);

const cityValidator = createCityValidator();

const weatherService = new WeatherService(
  provider1,
  dataFormatter,
  cityValidator,
  redisClient,
);

function getCurrentWeather(call, callback) {
  const city = call.request.city;
  weatherService
    .getWeather(city)
    .then((data) => callback(null, data))
    .catch((err) => callback(err));
}

function validateCity(call, callback) {
  const city = call.request.city;
  weatherService
    .validateCity(city)
    .then((isValid) => callback(null, { isValid }))
    .catch((error) => {
      console.error('❌ validateCity error:', error.message);
      callback(null, { isValid: false });
    });
}

const server = new grpc.Server();
server.addService(weatherProto.WeatherService.service, {
  GetCurrentWeather: getCurrentWeather,
  ValidateCity: validateCity,
});

server.bindAsync(
  `0.0.0.0:50051`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('✅ WeatherService running on port 50051');
  },
);
