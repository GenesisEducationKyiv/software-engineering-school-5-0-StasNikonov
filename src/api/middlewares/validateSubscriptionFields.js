const isValidFields = (email, city, frequency) => {
  if (!email || !city || !frequency) {
    return { valid: false, status: 400, message: 'Invalid input' };
  }
  return { valid: true };
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = { isValidFields, isValidEmail };
