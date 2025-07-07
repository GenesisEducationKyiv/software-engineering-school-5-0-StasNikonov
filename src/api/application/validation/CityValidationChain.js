class CityValidationChain {
  constructor(startValidator) {
    this.startValidator = startValidator;
  }

  async isValid(city) {
    let validator = this.startValidator;

    while (validator) {
      const isValid = await validator.validateCity(city);
      if (isValid) return true;
      validator = validator.next;
    }

    return false;
  }
}

module.exports = CityValidationChain;
