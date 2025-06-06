const { Subscription } = require('../../db/models');

const findSubscription = (email, city) => {
  return Subscription.findOne({ where: { email, city } });
};

const createSubscription = ({ email, city, frequency, token }) => {
  return Subscription.create({
    email,
    city,
    frequency,
    confirmed: false,
    token,
  });
};

const findByToken = (token) => {
  return Subscription.findOne({ where: { token } });
};

const confirmSubscription = async (subscription) => {
  subscription.confirmed = true;
  return subscription.save();
};

const deleteSubscription = (subscription) => {
  return subscription.destroy();
};

module.exports = {
  findSubscription,
  createSubscription,
  findByToken,
  confirmSubscription,
  deleteSubscription,
};
