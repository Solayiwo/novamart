function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
}

function validateCredentials({ email, password } = {}) {
  const errors = [];
  if (!isValidEmail(email)) errors.push('Invalid email');
  if (!isStrongPassword(password)) errors.push('Weak password');
  return { valid: errors.length === 0, errors };
}

module.exports = { isValidEmail, isStrongPassword, validateCredentials };
