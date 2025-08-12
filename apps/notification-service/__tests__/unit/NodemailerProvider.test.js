const nodemailer = require('nodemailer');
const NodemailerProvider = require('../../src/providers/NodemailerProvider');

jest.mock('nodemailer');

describe('NodemailerProvider', () => {
  let sendMailMock;
  let provider;

  beforeEach(() => {
    sendMailMock = jest.fn().mockResolvedValue(true);

    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });

    provider = new NodemailerProvider();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should send email with correct parameters', async () => {
    const emailData = {
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Hello world</p>',
    };

    await provider.sendEmail(emailData);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });
  });

  test('should throw error if sendMail fails', async () => {
    sendMailMock.mockRejectedValue(new Error('Failed to send'));

    await expect(
      provider.sendEmail({
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Hello world</p>',
      }),
    ).rejects.toThrow('Failed to send');
  });
});
