class EmailProvider {
  async sendEmail({ _to, _subject, _html }) {
    throw new Error('sendEmail() must be implemented');
  }
}

module.exports = EmailProvider;
