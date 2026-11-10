const { validateAmount, buildReceipt } = require('../src/logic');

describe('payment logic', () => {
  test('accepts a normal amount', () => expect(validateAmount(50.5)).toBe(true));
  test('rejects zero, negative, non-number, infinite and oversized amounts', () => {
    [0, -1, '10', Infinity, 1000001].forEach((v) => expect(validateAmount(v)).toBe(false));
  });
  test('builds a receipt', () => {
    expect(buildReceipt('A1', 19.999)).toEqual({ receiptId: 'RCPT-A1', amount: 20, status: 'PAID' });
  });
  test('requires an order id', () => {
    expect(() => buildReceipt('', 10)).toThrow('orderId is required');
  });
  test('rejects an invalid amount', () => {
    expect(() => buildReceipt('A1', -5)).toThrow('Invalid amount');
  });
});
