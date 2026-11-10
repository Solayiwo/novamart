const { calculateTotal, applyDiscount } = require('../src/logic');

describe('order logic', () => {
  test('sums price x quantity', () => {
    expect(calculateTotal([{ price: 10, qty: 2 }, { price: 5, qty: 1 }])).toBe(25);
  });
  test('rejects an empty or non-array order', () => {
    expect(() => calculateTotal([])).toThrow('at least one item');
    expect(() => calculateTotal('x')).toThrow();
  });
  test('rejects invalid quantity or price', () => {
    expect(() => calculateTotal([{ price: 10, qty: 0 }])).toThrow('Invalid item');
    expect(() => calculateTotal([{ price: -1, qty: 1 }])).toThrow('Invalid item');
  });
  test('applies the WELCOME10 discount only', () => {
    expect(applyDiscount(100, 'WELCOME10')).toBe(90);
    expect(applyDiscount(100, 'OTHER')).toBe(100);
  });
});
