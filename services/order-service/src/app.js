const express = require('express');
const { calculateTotal, applyDiscount } = require('./logic');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'order-service' }));
app.post('/orders/total', (req, res) => {
  try {
    const total = applyDiscount(calculateTotal(req.body.items), req.body.code);
    res.json({ total });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = app;
