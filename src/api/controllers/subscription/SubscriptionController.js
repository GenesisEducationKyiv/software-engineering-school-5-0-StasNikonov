class SubscriptionController {
  constructor(subscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  subscribe = async (req, res) => {
    try {
      const result = await this.subscriptionService.subscribe(req.body);
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  confirm = async (req, res) => {
    try {
      const result = await this.subscriptionService.confirm(req.params);
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  unsubscribe = async (req, res) => {
    try {
      const result = await this.subscriptionService.unsubscribe(req.params);
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
}

module.exports = SubscriptionController;
