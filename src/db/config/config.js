const path = require('path');
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: path.resolve(__dirname, '../../', envFile) });

module.exports = {
  [env]: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  },
};
