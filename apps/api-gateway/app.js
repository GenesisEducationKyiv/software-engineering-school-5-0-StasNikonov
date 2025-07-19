require('dotenv').config();
const express = require('express');
const weatherRoutes = require('./services/weather/routes/weatherRoutes');
const subscriptionRoutes = require('./services/subscription/routes/subscriptionRoutes');
const { join } = require('node:path');

const app = express();
app.use(express.json());

app.use('/api', weatherRoutes);
app.use('/api', subscriptionRoutes);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/subscribe.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on port ${process.env.PORT}`);
});
