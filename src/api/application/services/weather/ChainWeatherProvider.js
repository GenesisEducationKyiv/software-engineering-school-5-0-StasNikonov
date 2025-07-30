class ChainWeatherProvider {
  constructor(providers) {
    this.providers = providers;
  }

  async fetch(city) {
    let lastError;
    for (const provider of this.providers) {
      try {
        return await provider.fetch(city);
      } catch (err) {
        lastError = err;
        console.warn(`Provider failed: ${err.message}, trying next...`);
      }
    }
    throw lastError || new Error('No providers available');
  }
}

module.exports = ChainWeatherProvider;
