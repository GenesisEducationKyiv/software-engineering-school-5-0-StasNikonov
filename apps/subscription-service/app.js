require('dotenv').config();
require('./src/cron/CronJobRunner');

const { connectDatabase } = require('./db/config/db');
const connectRabbit = require('./src/broker/connectRabbit');
const subscriptionService = require('./src/services/index');
const startGRPCServer = require('./src/grps/grpcServer');
const startMetricsServer = require('./src/metrics/metricsServer');

(async () => {
  await connectDatabase();
  await connectRabbit();
  startGRPCServer(subscriptionService);
  startMetricsServer();
})();
