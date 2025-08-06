require('dotenv').config();
const startBroker = require('./src/broker/startBroker');
const startMetricsServer = require('./src/metrics/metricsServer');

(async () => {
  await startBroker();
  startMetricsServer();
})();
