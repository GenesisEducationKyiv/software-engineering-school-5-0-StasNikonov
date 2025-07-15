const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { getCurrentWeather, validateCity } = require('./handlers');

const packageDefinition = protoLoader.loadSync(
  '../weather-service/src/proto/weather.proto',
);
const weatherProto = grpc.loadPackageDefinition(packageDefinition).weather;

function startGRPCServer(weatherService) {
  const server = new grpc.Server();

  server.addService(weatherProto.WeatherService.service, {
    GetCurrentWeather: getCurrentWeather(weatherService),
    ValidateCity: validateCity(weatherService),
  });

  server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log('✅ WeatherService running on port 50051');
    },
  );
}

module.exports = startGRPCServer;
