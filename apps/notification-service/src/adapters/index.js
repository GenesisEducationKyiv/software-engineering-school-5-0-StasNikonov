const EmailAdapter = require('./EmailAdapter');
const NodemailerProvider = require('../providers/NodemailerProvider');
const logger = require('../../../shared/logger/index');

const emailProvider = new NodemailerProvider();
const emailAdapter = new EmailAdapter(emailProvider, logger);

module.exports = emailAdapter;
