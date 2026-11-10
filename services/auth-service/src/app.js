const express = require('express');
const { validateCredentials } = require('./logic');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));
app.post('/validate', (req, res) => {
  const result = validateCredentials(req.body);
  res.status(result.valid ? 200 : 400).json(result);
});

module.exports = app;
