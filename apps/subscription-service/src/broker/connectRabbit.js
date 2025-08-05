const amqp = require('amqplib');
const logger = require('../../../../shared/logger/index');

const connectRabbit = async (retries = 5, delayMs = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect(
        process.env.RABBITMQ_URL || 'amqp://127.0.0.1',
      );
      const channel = await connection.createChannel();

      await channel.assertQueue('send_forecast_email', { durable: true });
      await channel.assertQueue('send_confirmation_email', { durable: true });

      logger.info('[RabbitMQ] Connected and queues asserted');
      return channel;
    } catch (error) {
      logger.error(
        `[RabbitMQ] Connection attempt ${i + 1} failed: ${error.message}`,
      );
      if (i < retries - 1) {
        logger.info(`Retrying in ${delayMs} ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        logger.error('[RabbitMQ] All connection attempts failed. Exiting...');
        process.exit(1);
      }
    }
  }
};

module.exports = connectRabbit;
