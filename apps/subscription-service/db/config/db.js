const { sequelize } = require('../models');

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Підключено до бази даних');
  } catch (err) {
    console.error('Помилка підключення до БД:', err);
  }
};

module.exports = { connectDatabase };
