require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./src/db/config/db');
require('./src/api/infrastructure/compositionRoot/schedulers/cronHandler');

const PORT = process.env.PORT || 3000;

connectDatabase();

app
  .listen(PORT, () => {
    console.log(`🚀 Сервер запущено на порті ${PORT}`);
  })
  .on('error', (err) => {
    console.error(`❌ Failed to start server on port ${PORT}:`, err.message);
    process.exit(1);
  });
