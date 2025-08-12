const NodemailerProvider = require('../providers/NodemailerProvider');
const { buildConfirmationEmail } = require('../emails/buildConfirmationEmail');
const { prepareEmailHtml } = require('../emails/prepareEmailHtml');
const { BASE_URL } = require('../../../config/config');

const emailProvider = new NodemailerProvider();

class EmailAdapter {
  async sendWeatherEmail(subscriber, weather) {
    const html = prepareEmailHtml(subscriber, weather);

    await emailProvider.sendEmail({
      to: subscriber.email,
      subject: `Погода у місті ${subscriber.city}`,
      html,
    });

    console.log(`✅ Email sent to ${subscriber.email}`);
  }

  async sendConfirmationEmail(email, city, token) {
    const confirmLink = `${BASE_URL}/api/confirm/${token}`;

    await emailProvider.sendEmail({
      to: email,
      subject: 'Підтвердження підписки на погоду',
      html: buildConfirmationEmail(city, confirmLink),
    });
  }
}

module.exports = EmailAdapter;
