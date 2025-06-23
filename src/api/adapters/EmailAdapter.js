const { sendEmail } = require('../integrations/nodemailerClient');
const { confirmationEmail } = require('../../utils/emailTemplates');
const { prepareEmailHtml } = require('../../utils/prepareEmailHtml');
const { BASE_URL } = require('../../config/config');

class EmailAdapter {
  async sendWeatherEmail(subscriber, weather) {
    const html = prepareEmailHtml(subscriber, weather);

    await sendEmail({
      to: subscriber.email,
      subject: `Погода у місті ${subscriber.city}`,
      html,
    });

    console.log(`✅ Email sent to ${subscriber.email}`);
  }

  async sendConfirmationEmail(email, city, token) {
    const confirmLink = `${BASE_URL}/api/confirm/${token}`;

    await sendEmail({
      to: email,
      subject: 'Підтвердження підписки на погоду',
      html: confirmationEmail(city, confirmLink),
    });
  }
}

module.exports = EmailAdapter;
