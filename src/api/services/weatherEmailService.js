const { sendWeatherEmail } = require('../adapters/EmailAdapter');

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
        await sendWeatherEmail(subscriber, weather);
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
