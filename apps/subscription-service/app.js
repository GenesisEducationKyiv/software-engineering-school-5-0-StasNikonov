require('dotenv').config();
const { sequelize } = require('./db/models');

const subscriptionService = require('./src/services/index');
const startGRPCServer = require('./src/grps/grpcServer');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    startGRPCServer(subscriptionService);
  } catch (err) {
    console.error('DB connection error:', err.message);
  }
})();
