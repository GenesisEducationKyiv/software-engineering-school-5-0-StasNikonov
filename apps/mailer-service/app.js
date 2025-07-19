require('dotenv').config();
require('./src/cron/CronJobRunner');
const startGRPCServer = require('./src/grpc/grpcServer');

const EmailAdapter = require('./src/adapters/EmailAdapter');
const emailAdapter = new EmailAdapter();

(async () => {
  startGRPCServer(emailAdapter);
})();
