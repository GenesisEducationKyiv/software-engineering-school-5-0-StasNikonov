require('dotenv').config();
const express = require('express');
const weatherRoutes = require('./services/weather/routes/weatherRoutes');
const subscriptionRoutes = require('./services/subscription/routes/subscriptionRoutes');
const { join } = require('node:path');

const PORT = process.env.APIGATEWAY_PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(join(__dirname, 'public')));

app.use('/api', weatherRoutes);
app.use('/api', subscriptionRoutes);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, './public/subscribe.html'));
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
