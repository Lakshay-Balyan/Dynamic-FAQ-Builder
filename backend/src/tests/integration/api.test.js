// src/tests/integration/api.test.js
const request = require('supertest');
const app = require('app'); // Path fixed
const db = require('models/db'); // Path fixed

jest.mock('models/db'); // Path fixed

describe('API integration tests', () => {
  afterEach(() => jest.resetAllMocks());

  test('GET /api/public/categories returns categories', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 1, name: 'General' }] });

    const res = await request(app).get('/api/public/categories');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'General' }]);
  });
});
