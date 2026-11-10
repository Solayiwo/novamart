const request = require('supertest');
const app = require('../src/app');

describe('payment API', () => {
  test('GET /health', async () => {
    expect((await request(app).get('/health')).body.status).toBe('ok');
  });
  test('POST /payments creates a receipt', async () => {
    const res = await request(app).post('/payments').send({ orderId: 'A1', amount: 25 });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('PAID');
  });
  test('POST /payments rejects an invalid amount', async () => {
    const res = await request(app).post('/payments').send({ orderId: 'A1', amount: -1 });
    expect(res.status).toBe(400);
  });
});
