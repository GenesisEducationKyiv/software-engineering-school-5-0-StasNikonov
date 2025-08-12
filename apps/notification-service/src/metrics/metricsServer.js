const express = require('express');
const client = require('prom-client');

function startMetricsServer() {
  const app = express();

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });

  const PORT = process.env.METRICS_PORT || 9102;
  app.listen(PORT, () => {
    console.log(`Metrics server running on port ${PORT}`);
  });
}

module.exports = startMetricsServer;
