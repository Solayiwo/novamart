const request = require('supertest');
const app = require('../src/app');

describe('auth API', () => {
  test('GET /health', async () => {
    expect((await request(app).get('/health')).body.status).toBe('ok');
  });
  test('POST /validate accepts good credentials', async () => {
    const res = await request(app).post('/validate').send({ email: 'ola@example.com', password: 'abcd1234' });
    expect(res.status).toBe(200);
  });
  test('POST /validate rejects bad credentials', async () => {
    const res = await request(app).post('/validate').send({ email: 'x', password: 'y' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveLength(2);
  });
});
