// src/tests/system/workflow.test.js
const request = require('supertest');
const app = require('app'); // Path fixed
const db = require('models/db'); // Path fixed

describe('System Test: Full Admin Workflow', () => {
  let cookie;
  let newCategoryId;
  let newFaqId;

  beforeAll(async () => {
    await db.query("DELETE FROM faqs WHERE question LIKE 'Test Question:%'");
    await db.query("DELETE FROM categories WHERE name LIKE 'Test Category:%'");
    await db.query("DELETE FROM users WHERE username = 'systemtestuser'");
  });

  afterAll(async () => {
    await db.query("DELETE FROM faqs WHERE question LIKE 'Test Question:%'");
    await db.query("DELETE FROM categories WHERE name LIKE 'Test Category:%'");
    await db.query("DELETE FROM users WHERE username = 'systemtestuser'");
    await db.pool.end(); 
  });

  test('Step 1: (DYN-7) Register a new admin user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'systemtestuser',
        password: 'password123',
        role: 'Administrator'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe('systemtestuser');
  });

  test('Step 2: (DYN-7) Login as the new admin user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'systemtestuser',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    cookie = res.headers['set-cookie'];
  });

  test('Step 3: (DYN-4) Create a new category', async () => {
    const res = await request(app)
      .post('/api/faqs/categories')
      .set('Cookie', cookie)
      .send({ name: 'Test Category: System' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Category: System');
    newCategoryId = res.body.id;
  });

  test('Step 4: (DYN-4) Create a new FAQ', async () => {
    const res = await request(app)
      .post('/api/faqs')
      .set('Cookie', cookie)
      .send({
        question: 'Test Question: System Test?',
        answer: 'This is a system test answer.',
        category_id: newCategoryId
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.data.question).toBe('Test Question: System Test?');
    newFaqId = res.body.faqId;
  });

  test('Step 5: (DYN-5) Edit the new FAQ', async () => {
    const res = await request(app)
      .put(`/api/faqs/${newFaqId}`)
      .set('Cookie', cookie)
      .send({
        question: 'Test Question: System Test? (Edited)',
        answer: 'This is an edited answer.',
        category_id: newCategoryId
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.question).toBe('Test Question: System Test? (Edited)');
  });

  test('Step 6: (DYN-6) Delete the new FAQ', async () => {
    const res = await request(app)
      .delete(`/api/faqs/${newFaqId}`)
      .set('Cookie', cookie);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('deleted successfully');
  });
});
