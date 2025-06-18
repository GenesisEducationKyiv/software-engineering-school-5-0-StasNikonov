const express = require('express');
const router = express.Router();

const weatherRoutes = require('./weather');
const subscriptionRoutes = require('./subscription');

router.use('/', weatherRoutes);
router.use('/', subscriptionRoutes);

module.exports = router;
