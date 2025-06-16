const subscriptionService = require('../services/subscriptionService');
const db = require('../services/subscriptionRepository');

const subscribeController = async (req, res) => {
  try {
    const result = await subscriptionService.subscribe(req.body, db);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const confirmController = async (req, res) => {
  try {
    const result = await subscriptionService.confirm(req.params, db);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const unsubscribeController = async (req, res) => {
  try {
    const result = await subscriptionService.unsubscribe(req.params, db);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  subscribeController,
  confirmController,
  unsubscribeController,
};
