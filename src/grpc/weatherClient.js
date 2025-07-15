const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join('apps/weather-service/src/proto/weather.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const weatherPackage = grpcObject.weather;
const WeatherServiceClient = weatherPackage.WeatherService;

const client = new WeatherServiceClient(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);

module.exports = client;
