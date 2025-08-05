const EmailAdapter = require('./EmailAdapter');
const NodemailerProvider = require('../providers/NodemailerProvider');

const emailProvider = new NodemailerProvider();
const emailAdapter = new EmailAdapter(emailProvider);

module.exports = emailAdapter;
