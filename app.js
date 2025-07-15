const express = require('express');
const subscriptionRoutes = require('./src/api/routes/subscription');
const { join } = require('node:path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', subscriptionRoutes);

app.use(express.static(join(__dirname, 'src', 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'src', 'public', 'subscribe.html'));
});

module.exports = app;
