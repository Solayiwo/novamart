const express = require('express');
const { buildReceipt } = require('./logic');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'payment-service' }));
app.post('/payments', (req, res) => {
  try {
    res.status(201).json(buildReceipt(req.body.orderId, req.body.amount));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = app;
