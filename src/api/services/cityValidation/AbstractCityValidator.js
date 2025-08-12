class AbstractCityValidator {
  async validateCity(city) {
    this._city = city;
    throw new Error('validateCity(city) not implemented');
  }
}
module.exports = AbstractCityValidator;
