function validateAmount(amount) {
  return typeof amount === 'number' && Number.isFinite(amount) && amount > 0 && amount <= 1000000;
}

function buildReceipt(orderId, amount) {
  if (!orderId) throw new Error('orderId is required');
  if (!validateAmount(amount)) throw new Error('Invalid amount');
  return { receiptId: `RCPT-${orderId}`, amount: Math.round(amount * 100) / 100, status: 'PAID' };
}

module.exports = { validateAmount, buildReceipt };
