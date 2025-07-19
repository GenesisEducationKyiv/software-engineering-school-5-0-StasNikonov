function sendConfirmationEmail(emailAdapter) {
  return (call, callback) => {
    const { email, city, token } = call.request;
    emailAdapter
      .sendConfirmationEmail(email, city, token)
      .then(() => callback(null, { message: 'Email sent', status: 200 }))
      .catch((err) => {
        console.error('SendConfirmationEmail error:', err.message);
        callback(null, { message: 'Failed to send email', status: 500 });
      });
  };
}

module.exports = { sendConfirmationEmail };
