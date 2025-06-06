const { Subscription } = require('../../db/models');
const { getWeather } = require('./weatherService');
const { forecastEmail } = require('../../utils/forecastTemplates');
const transporter = require('./mailer');

const sendWeatherEmailToSubscribers = async (frequency) => {
  try {
    const subscribers = await Subscription.findAll({
      where: { confirmed: true, frequency },
    });

    for (let subscriber of subscribers) {
      const { email, city, token } = subscriber;

      try {
        const weather = await getWeather(city);

        const unsubscribeLink = `${process.env.BASE_URL}/api/unsubscribe/${token}`;

        const html = forecastEmail({
          city,
          temp_c: weather.temperature,
          humidity: weather.humidity,
          condition: weather.description,
          unsubscribeLink,
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Погода у місті ${city}`,
          html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email} (${frequency})`);
      } catch (err) {
        console.error(`❌ Failed to send email to ${email}:`, err.message);
      }
    }
  } catch (error) {
    console.error('❌ Error retrieving subscribers:', error.message);
  }
};

module.exports = {
  sendWeatherEmailToSubscribers,
};
