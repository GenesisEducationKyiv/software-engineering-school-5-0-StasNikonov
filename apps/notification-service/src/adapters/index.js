const EmailAdapter = require('./EmailAdapter');
const NodemailerProvider = require('../providers/NodemailerProvider');
const logger = require('../../../../shared/logger/index');
const metrics = require('../metrics/MetricsService');

const emailProvider = new NodemailerProvider();
const emailAdapter = new EmailAdapter(emailProvider, logger, metrics);

module.exports = emailAdapter;
