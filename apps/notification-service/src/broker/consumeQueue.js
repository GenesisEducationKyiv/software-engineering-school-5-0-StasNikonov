const logger = require('../../../../shared/logger/index');

function consumeQueue(channel, queueName, handler) {
  channel.consume(queueName, async (msg) => {
    try {
      logger.info(`Message received from queue "${queueName}"`);
      const data = JSON.parse(msg.content.toString());
      await handler(data, msg);
    } catch (err) {
      logger.error(
        `Error processing message from queue "${queueName}": ${err.message}`,
      );
    } finally {
      channel.ack(msg);
    }
  });
}

module.exports = { consumeQueue };
