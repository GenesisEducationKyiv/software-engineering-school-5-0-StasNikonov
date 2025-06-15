require('dotenv').config();
const app = require('./app');
const { connectDatabase } = require('./src/db/config/db');
require('./src/api/integrations/cronJob');

const PORT = process.env.PORT || 3000;

connectDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порті ${PORT}`);
});
