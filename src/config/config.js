const isProduction = process.env.NODE_ENV === 'production';

const BASE_URL = isProduction ? process.env.BASE_URL : 'http://localhost:3000';

module.exports = {
  BASE_URL,
};
