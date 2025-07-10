const nodemailer = require('nodemailer');
const EmailProvider = require('../../domain/providers/IEmailProvider');

class NodemailerProvider extends EmailProvider {
  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html }) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }
}

module.exports = NodemailerProvider;
