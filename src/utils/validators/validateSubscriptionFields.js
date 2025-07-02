const isValidFields = (email, city, frequency) => {
  const allFields = [email, city, frequency];
  const allValid = allFields.every(
    (field) => typeof field === 'string' && field.trim().length > 0,
  );

  if (!allValid) {
    return { valid: false, status: 400, message: 'Invalid input' };
  }

  return { valid: true };
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = { isValidFields, isValidEmail };
