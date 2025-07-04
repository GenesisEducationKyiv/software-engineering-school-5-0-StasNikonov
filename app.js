const express = require('express');
const client = require('prom-client');
const subscriptionRoutes = require('./src/api/routes/subscription');
const weatherRoutes = require('./src/api/routes/weather');
const { join } = require('node:path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const register = client.register;

app.use('/api', subscriptionRoutes);
app.use('/api', weatherRoutes);
app.get('/api/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.use(express.static(join(__dirname, 'src', 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'src', 'public', 'subscribe.html'));
});

module.exports = app;
