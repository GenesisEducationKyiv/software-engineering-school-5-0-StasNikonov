const { v4: uuidv4 } = require('uuid');
const transporter = require('../services/mailer');
const {
  validateSubscriptionInput,
} = require('../middlewares/validateSubscriptionInput');
const {
  findSubscription,
  createSubscription,
  findByToken,
  confirmSubscription,
  deleteSubscription,
} = require('../services/subscriptionService');
const { confirmationEmail } = require('../../utils/emailTemplates');

const subscribe = async (req, res) => {
  const { email, city, frequency } = req.body;

  const validation = await validateSubscriptionInput({
    email,
    city,
    frequency,
  });
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const existing = await findSubscription(email, city);
    if (existing) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    const token = uuidv4();
    await createSubscription({ email, city, frequency, token });

    const confirmLink = `${process.env.BASE_URL}/api/confirm/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Підтвердження підписки на погоду',
      html: confirmationEmail(city, confirmLink),
    });

    res
      .status(200)
      .json({ message: 'Subscription successful. Confirmation email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;

  try {
    const subscription = await findByToken(token);
    if (!subscription) {
      return res.status(404).json({ message: 'Token not found' });
    }

    await confirmSubscription(subscription);
    res.status(200).json({ message: 'Subscription confirmed successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const unsubscribe = async (req, res) => {
  const { token } = req.params;

  try {
    const subscription = await findByToken(token);
    if (!subscription) {
      return res.status(404).json({ message: 'Token not found' });
    }

    await deleteSubscription(subscription);
    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  subscribe,
  confirm,
  unsubscribe,
};
