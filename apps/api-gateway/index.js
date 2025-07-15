require('dotenv').config();

const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/grpc/weather.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const weatherProto = grpc.loadPackageDefinition(packageDefinition).weather;

const weatherClient = new weatherProto.WeatherService(
  process.env.WEATHER_SERVICE_ADDRESS,
  grpc.credentials.createInsecure(),
);

const app = express();

app.get('/api/weather', (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'Missing city parameter' });
  }

  weatherClient.GetCurrentWeather({ city }, (err, response) => {
    if (err) {
      console.error('gRPC error:', err);
      return res.status(500).json({ error: 'Failed to get weather' });
    }
    res.json(response);
  });
});

app.get('/api/weather/validate-city', (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'Missing city parameter' });

  weatherClient.ValidateCity({ city }, (err, response) => {
    if (err) {
      console.error('gRPC error:', err);
      return res.status(500).json({ error: 'Failed to validate city' });
    }
    res.json(response);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on port ${process.env.PORT}`);
});
