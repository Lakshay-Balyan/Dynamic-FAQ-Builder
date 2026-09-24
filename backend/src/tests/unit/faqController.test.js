// src/tests/unit/faqController.test.js
const faqController = require('controllers/faqController'); // Path fixed
const db = require('models/db'); // Path fixed

jest.mock('models/db'); // Path fixed

describe('FAQ Controller - unit', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getCategories returns json array on success', async () => {
    const mockReq = {};
    const mockRes = { json: jest.fn(), status: jest.fn(() => mockRes) };

    db.query.mockResolvedValue({ rows: [{ id: 1, name: 'General' }] });

    await faqController.getCategories(mockReq, mockRes);

    expect(db.query).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 1, name: 'General' }]);
  });

  test('searchFaqs returns 400 when q missing', async () => {
    const mockReq = { query: {} };
    const mockRes = { json: jest.fn(), status: jest.fn(() => mockRes) };

    await faqController.searchFaqs(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test('createFaq returns 400 if question is missing', async () => {
  const mockReq = { 
    body: { answer: 'Test Answer', category_id: 1 },
    user: { id: 1 } 
  };
  const mockRes = { json: jest.fn(), status: jest.fn(() => mockRes) };

  await faqController.createFaq(mockReq, mockRes);

  expect(mockRes.status).toHaveBeenCalledWith(400);
  expect(mockRes.json).toHaveBeenCalledWith({ message: 'Question, answer, and category are required.' });
});

// Add this test as well
test('createCategory returns 400 if name is missing', async () => {
  const mockReq = { body: {} };
  const mockRes = { json: jest.fn(), status: jest.fn(() => mockRes) };

  await faqController.createCategory(mockReq, mockRes);

  expect(mockRes.status).toHaveBeenCalledWith(400);
  expect(mockRes.json).toHaveBeenCalledWith({ message: 'Category name is required.' });
});

// Add these tests to faqController.test.js

test('updateFaq returns 404 if FAQ not found', async () => {
  const mockReq = { params: {}, body: {} }; // <-- ADD THIS
  const mockRes = { json: jest.fn(), status: jest.fn(() => mockRes) }; // <-- ADD THIS

  mockReq.params.id = 999;
  mockReq.body = { question: 'Test', answer: 'Test', category_id: 1 };

  // Mock an empty DB response

  // Mock an empty DB response
  db.query.mockResolvedValue({ rows: [] });

  await faqController.updateFaq(mockReq, mockRes);

  expect(db.query).toHaveBeenCalled();
  expect(mockRes.status).toHaveBeenCalledWith(404);
  expect(mockRes.json).toHaveBeenCalledWith({ message: 'FAQ not found.' });
});

test('deleteFaq returns 404 if FAQ not found', async () => {
  const mockReq = { params: {} }; // <-- ADD THIS
  const mockRes = { json: jest.fn(), status: jest.fn(() => mockRes) }; // <-- ADD THIS

  mockReq.params.id = 999;

  // Mock an empty DB response
  // Mock an empty DB response
  db.query.mockResolvedValue({ rows: [] });

  await faqController.deleteFaq(mockReq, mockRes);

  expect(db.query).toHaveBeenCalled();
  expect(mockRes.status).toHaveBeenCalledWith(404);
  expect(mockRes.json).toHaveBeenCalledWith({ message: 'FAQ not found.' });
});

});
