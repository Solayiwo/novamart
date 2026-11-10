const request = require('supertest');
const app = require('../src/app');

describe('product API', () => {
  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
  test('GET /products?category=food', async () => {
    const res = await request(app).get('/products?category=food');
    expect(res.body).toHaveLength(1);
  });
  test('GET /products/2', async () => {
    expect((await request(app).get('/products/2')).status).toBe(200);
  });
  test('GET /products/99 returns 404', async () => {
    expect((await request(app).get('/products/99')).status).toBe(404);
  });
});
