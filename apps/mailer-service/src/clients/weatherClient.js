const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../../proto/weather.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const weatherProto = grpc.loadPackageDefinition(packageDefinition).weather;

const client = new weatherProto.WeatherService(
  process.env.WEATHER_SERVICE_ADDRESS || 'localhost:50051',
  grpc.credentials.createInsecure(),
);

module.exports = client;
