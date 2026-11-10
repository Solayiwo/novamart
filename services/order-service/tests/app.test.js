const request = require('supertest');
const app = require('../src/app');

describe('order API', () => {
  test('GET /health', async () => {
    expect((await request(app).get('/health')).body.status).toBe('ok');
  });
  test('POST /orders/total returns the total', async () => {
    const res = await request(app).post('/orders/total').send({ items: [{ price: 10, qty: 3 }] });
    expect(res.body.total).toBe(30);
  });
  test('POST /orders/total applies a discount code', async () => {
    const res = await request(app).post('/orders/total').send({ items: [{ price: 100, qty: 1 }], code: 'WELCOME10' });
    expect(res.body.total).toBe(90);
  });
  test('POST /orders/total rejects an empty order', async () => {
    const res = await request(app).post('/orders/total').send({ items: [] });
    expect(res.status).toBe(400);
  });
});
