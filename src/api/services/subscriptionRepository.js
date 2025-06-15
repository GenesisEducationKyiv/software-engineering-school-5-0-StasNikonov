const { Subscription } = require('../../db/models');

//Read
const findSubscription = (email, city) =>
  Subscription.findOne({ where: { email, city } });
const findByToken = (token) => Subscription.findOne({ where: { token } });
const getConfirmedByFrequency = (frequency) =>
  Subscription.findAll({ where: { confirmed: true, frequency } });

//Write
const createSubscription = (data) => Subscription.create(data);
const confirmSubscription = (subscription) =>
  subscription.update({ confirmed: true });
const deleteSubscription = (subscription) => subscription.destroy();

module.exports = {
  findSubscription,
  createSubscription,
  findByToken,
  confirmSubscription,
  deleteSubscription,
  getConfirmedByFrequency,
};
