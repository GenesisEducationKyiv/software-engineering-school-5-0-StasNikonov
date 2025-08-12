const logProviderResponse = require('./logProviderResponse');

class LoggingWeatherProviderDecorator {
  constructor(provider, providerName) {
    this.provider = provider;
    this.providerName = providerName;
  }

  async fetch(city) {
    const data = await this.provider.fetch(city);
    try {
      logProviderResponse(this.providerName, data);
    } catch (logError) {
      console.warn('Failed to log provider response:', logError);
    }
    return data;
  }
}

module.exports = LoggingWeatherProviderDecorator;
