class IWeatherProvider {
  setNext(provider) {
    this.next = provider;
    return provider;
  }

  async fetch(city) {
    this._city = city;
    throw new Error('fetch(city) not implemented');
  }
}

module.exports = IWeatherProvider;
