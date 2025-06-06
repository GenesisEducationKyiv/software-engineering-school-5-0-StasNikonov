const express = require('express');
const subscriptionRoutes = require('./src/api/routes/subscription');
const weatherRoutes = require('./src/api/routes/weather');
const { join } = require('node:path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', subscriptionRoutes);
app.use('/api', weatherRoutes);

app.use(express.static(join(__dirname, 'src', 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'src', 'public', 'subscribe.html'));
});

module.exports = app;
