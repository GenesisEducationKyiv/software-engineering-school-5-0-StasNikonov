const { prepareEmailHtml } = require('../../utils/prepareEmailHtml');

const sendWeatherEmailToSubscribers = async (
  frequency,
  getWeather,
  transporter,
  db,
) => {
  try {
    const subscribers = await db.getConfirmedByFrequency(frequency);

    for (let subscriber of subscribers) {
      try {
        const weather = await getWeather(subscriber.city);
        const html = prepareEmailHtml(subscriber, weather);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: subscriber.email,
          subject: `Погода у місті ${subscriber.city}`,
          html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${subscriber.email} (${frequency})`);
      } catch (err) {
        console.error(
          `❌ Failed to send email to ${subscriber.email}:`,
          err.message,
        );
      }
    }
  } catch (error) {
    console.error('❌ Error retrieving subscribers:', error.message);
  }
};

module.exports = {
  sendWeatherEmailToSubscribers,
};
