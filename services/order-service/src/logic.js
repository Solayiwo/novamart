function calculateTotal(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }
  return items.reduce((sum, { price, qty }) => {
    if (!(qty > 0) || !(price >= 0)) throw new Error('Invalid item');
    return sum + price * qty;
  }, 0);
}

function applyDiscount(total, code) {
  return code === 'WELCOME10' ? Math.round(total * 0.9 * 100) / 100 : total;
}

module.exports = { calculateTotal, applyDiscount };
