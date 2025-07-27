require('dotenv').config();

const { connectDatabase } = require('./db/config/db');
const subscriptionService = require('./src/services/index');
const startGRPCServer = require('./src/grps/grpcServer');

(async () => {
  connectDatabase();
  startGRPCServer(subscriptionService);
})();
