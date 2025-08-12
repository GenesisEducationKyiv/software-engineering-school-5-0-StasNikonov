class SubscriptionController {
  constructor(subscriptionClient, logger) {
    this.client = subscriptionClient;
    this.logger = logger;
  }

  subscribe = (req, res) => {
    this.client.Subscribe(req.body, (err, response) => {
      if (err) {
        this.logger.error(`gRPC error: ${err}`);
        return res.status(500).json({ error: 'gRPC error' });
      }
      res.status(response.status).json({ message: response.message });
    });
  };

  confirm = (req, res) => {
    this.client.Confirm({ token: req.params.token }, (err, response) => {
      if (err) {
        this.logger.error(`gRPC error: ${err}`);
        return res.status(500).json({ error: 'gRPC error' });
      }
      res.status(response.status).json({ message: response.message });
    });
  };

  unsubscribe = (req, res) => {
    this.client.Unsubscribe({ token: req.params.token }, (err, response) => {
      if (err) {
        this.logger.error(`gRPC error: ${err}`);
        return res.status(500).json({ error: 'gRPC error' });
      }
      res.status(response.status).json({ message: response.message });
    });
  };
}

module.exports = SubscriptionController;
