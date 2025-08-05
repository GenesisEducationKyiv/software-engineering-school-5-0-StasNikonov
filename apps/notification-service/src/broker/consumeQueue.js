function consumeQueue(channel, queueName, handler) {
  channel.consume(queueName, async (msg) => {
    try {
      const data = JSON.parse(msg.content.toString());
      await handler(data, msg);
    } catch (err) {
      console.error(
        `Error processing message from queue "${queueName}":`,
        err.message,
      );
    } finally {
      channel.ack(msg);
    }
  });
}

module.exports = { consumeQueue };
