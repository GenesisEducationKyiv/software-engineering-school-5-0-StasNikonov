const express = require('express');
const router = express.Router();

const subscriptionRoutes = require('./subscription');

router.use('/', subscriptionRoutes);

module.exports = router;
