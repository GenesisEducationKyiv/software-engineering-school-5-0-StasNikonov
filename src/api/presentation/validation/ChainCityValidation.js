class ChainCityValidation {
  constructor(validators) {
    this.validators = validators;
  }

  async validateCity(city) {
    for (const validator of this.validators) {
      try {
        const isValid = await validator.validateCity(city);
        if (isValid) return true;
      } catch (error) {
        console.warn(
          `Validator ${validator.constructor.name} failed with error: ${error.message}`,
        );
      }
    }
    return false;
  }
}

module.exports = ChainCityValidation;
