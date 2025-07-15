class ICityValidator {
  setNext(provider) {
    this.next = provider;
    return provider;
  }

  async validateCity(city) {
    this._city = city;
    throw new Error('validateCity(city) not implemented');
  }
}
module.exports = ICityValidator;
