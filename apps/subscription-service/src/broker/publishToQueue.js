const connectRabbit = require('./connectRabbit');
const logger = require('../../../shared/logger/index');

const publishToQueue = async (queue, message) => {
  const channel = await connectRabbit();

  if (!channel) {
    logger.error('RabbitMQ channel is not initialized');
    throw new Error('RabbitMQ channel is not initialized');
  }
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  logger.info(`[RabbitMQ] Published to "${queue}"`);
};

module.exports = publishToQueue;
