require('dotenv').config();
const startBroker = require('./src/broker/startBroker');

(async () => {
  await startBroker();
})();
