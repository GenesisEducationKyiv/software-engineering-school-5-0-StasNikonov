require('dotenv').config();
require('./src/cron/CronJobRunner');
const emailAdapter = require('./src/adapters/index');
const startGRPCServer = require('./src/grpc/grpcServer');

(async () => {
  startGRPCServer(emailAdapter);
})();
