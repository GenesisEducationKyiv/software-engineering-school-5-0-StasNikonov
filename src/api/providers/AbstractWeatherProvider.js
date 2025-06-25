class AbstractWeatherProvider {
  setNext(provider) {
    this.next = provider;
    return provider;
  }

  async fetch(city) {
    throw new Error('fetch(city) not implemented');
  }
}

module.exports = AbstractWeatherProvider;
