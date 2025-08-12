require('dotenv').config();
const weatherService = require('./src/services/index');
const startGRPCServer = require('./src/grpc/grpcServer');
const startMetricsServer = require('./src/metrics/metricsServer.js');

(async () => {
  startGRPCServer(weatherService);
  startMetricsServer();
})();
