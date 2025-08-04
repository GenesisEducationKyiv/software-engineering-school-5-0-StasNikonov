const emailAdapter = require('../../src/adapters/index');

jest.mock('../../src/adapters/index');

describe('confirmationEmailConsumer handler', () => {
  it('should send confirmation email', async () => {
    const data = {
      email: 'user@example.com',
      city: 'Lviv',
      token: 'fake-token',
    };

    const handler = async ({ email, city, token }) => {
      await emailAdapter.sendConfirmationEmail({ email, city, token });
    };

    await handler(data);

    expect(emailAdapter.sendConfirmationEmail).toHaveBeenCalledWith({
      email: 'user@example.com',
      city: 'Lviv',
      token: 'fake-token',
    });
  });
});
