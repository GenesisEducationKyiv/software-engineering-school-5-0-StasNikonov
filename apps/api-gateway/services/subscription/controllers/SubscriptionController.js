class SubscriptionController {
  constructor(subscriptionClient) {
    this.client = subscriptionClient;
  }

  subscribe = (req, res) => {
    this.client.Subscribe(req.body, (err, response) => {
      if (err) return res.status(500).json({ error: 'gRPC error' });
      res.status(response.status).json({ message: response.message });
    });
  };

  confirm = (req, res) => {
    this.client.Confirm({ token: req.params.token }, (err, response) => {
      if (err) return res.status(500).json({ error: 'gRPC error' });
      res.status(response.status).json({ message: response.message });
    });
  };

  unsubscribe = (req, res) => {
    this.client.Unsubscribe({ token: req.params.token }, (err, response) => {
      if (err) return res.status(500).json({ error: 'gRPC error' });
      res.status(response.status).json({ message: response.message });
    });
  };
}

module.exports = SubscriptionController;
