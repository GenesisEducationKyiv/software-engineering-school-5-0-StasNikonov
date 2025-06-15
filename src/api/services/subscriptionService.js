const { v4: uuidv4 } = require('uuid');
const { confirmationEmail } = require('../../utils/emailTemplates');

const subscribe = async ({ email, city, frequency }, db, transporter) => {
  const existing = await db.findSubscription(email, city);
  if (existing) return { status: 409, message: 'Email already exists' };

  const token = uuidv4();
  await db.createSubscription({ email, city, frequency, token });

  const confirmLink = `${process.env.BASE_URL}/api/confirm/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Підтвердження підписки на погоду',
    html: confirmationEmail(city, confirmLink),
  });

  return {
    status: 200,
    message: 'Subscription successful. Confirmation email sent.',
  };
};

const confirm = async ({ token }, db) => {
  const subscription = await db.findByToken(token);
  if (!subscription) return { status: 404, message: 'Token not found' };

  await db.confirmSubscription(subscription);
  return { status: 200, message: 'Subscription confirmed successfully' };
};

const unsubscribe = async ({ token }, db) => {
  const subscription = await db.findByToken(token);
  if (!subscription) return { status: 404, message: 'Token not found' };

  await db.deleteSubscription(subscription);
  return { status: 200, message: 'Unsubscribed successfully' };
};

module.exports = {
  subscribe,
  confirm,
  unsubscribe,
};
