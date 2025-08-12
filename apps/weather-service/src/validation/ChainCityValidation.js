class ChainCityValidation {
  constructor(validators) {
    this.validators = validators;
  }

  async validateCity(city) {
    for (const validator of this.validators) {
      const isValid = await validator.validateCity(city);
      if (isValid) return true;
    }
    return false;
  }
}

module.exports = ChainCityValidation;
