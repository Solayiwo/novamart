const { isValidEmail, isStrongPassword, validateCredentials } = require('../src/logic');

describe('auth logic', () => {
  test('accepts a valid email', () => expect(isValidEmail('ola@example.com')).toBe(true));
  test('rejects malformed or non-string emails', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail(42)).toBe(false);
  });
  test('accepts a strong password', () => expect(isStrongPassword('abcd1234')).toBe(true));
  test('rejects short, letter-only, digit-only or non-string passwords', () => {
    expect(isStrongPassword('ab12')).toBe(false);
    expect(isStrongPassword('abcdefgh')).toBe(false);
    expect(isStrongPassword('12345678')).toBe(false);
    expect(isStrongPassword(null)).toBe(false);
  });
  test('reports every validation error', () => {
    expect(validateCredentials({ email: 'x', password: 'y' }).errors).toHaveLength(2);
  });
  test('handles missing input', () => {
    expect(validateCredentials().valid).toBe(false);
  });
});
