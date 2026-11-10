const express = require('express');
const { listProducts, findProduct } = require('./logic');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product-service' }));
app.get('/products', (req, res) => res.json(listProducts(req.query.category)));
app.get('/products/:id', (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
});

module.exports = app;
