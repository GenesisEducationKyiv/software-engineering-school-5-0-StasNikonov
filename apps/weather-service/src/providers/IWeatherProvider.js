class IWeatherProvider {
  async fetch(city) {
    this._city = city;
    throw new Error('fetch(city) not implemented');
  }
}

module.exports = IWeatherProvider;
