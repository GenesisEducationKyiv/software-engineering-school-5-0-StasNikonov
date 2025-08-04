const connectRabbit = require('./connectRabbit');

const publishToQueue = async (queue, message) => {
  const channel = await connectRabbit();

  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log(`[RabbitMQ] Published to "${queue}":`, message);
};

module.exports = publishToQueue;
