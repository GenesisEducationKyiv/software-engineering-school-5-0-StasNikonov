const {
  buildConfirmationEmail,
} = require('../templates/buildConfirmationEmail');
const { prepareEmailHtml } = require('../utils/prepareEmailHtml');

class EmailAdapter {
  constructor(emailProvider, logger) {
    this.emailProvider = emailProvider;
    this.logger = logger;
  }

  async sendWeatherEmail(subscriber, weather) {
    const html = prepareEmailHtml(subscriber, weather);
    try {
      await this.emailProvider.sendEmail({
        to: subscriber.email,
        subject: `Погода у місті ${subscriber.city}`,
        html,
      });

      this.logger.info(`Weather email sent to user`);
    } catch (error) {
      this.logger.error(`Failed to send weather email: ${error.message}`);
      throw error;
    }
  }

  async sendConfirmationEmail(email, city, token) {
    const baseUrl = process.env.BASE_URL;
    const confirmLink = `${baseUrl}/api/confirm/${token}`;

    try {
      await this.emailProvider.sendEmail({
        to: email,
        subject: 'Підтвердження підписки на погоду',
        html: buildConfirmationEmail(city, confirmLink),
      });

      this.logger.info(`Confirmation email sent`);
    } catch (error) {
      this.logger.error(`Failed to send confirmation email: ${error.message}`);
      throw error;
    }
  }
}

module.exports = EmailAdapter;
