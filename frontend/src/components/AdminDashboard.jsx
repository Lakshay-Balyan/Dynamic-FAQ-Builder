// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import EditFaqModal from './EditFaqModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// ====================================================================
// Component 1: Category Manager
// ====================================================================
const CategoryManager = ({ categories, onCategoryCreated }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await apiClient.post('/faqs/categories', { name });
      setMessage('Category created!');
      setName('');
      onCategoryCreated();
      setTimeout(() => setMessage(''), 3000);
    } catch (_) { // eslint-disable-line no-unused-vars
      setMessage(`Error: 'Category may already exist or an error occurred'`);
    }
  };

  return (
    <div>
      <h3>Manage Categories</h3>
      <ul className="category-list">
        {categories.map(cat => (
          <li key={cat.id} className="category-list-item">{cat.name}</li>
        ))}
      </ul>
      <form onSubmit={handleCreateCategory} className="create-form-simple">
        <input
          type="text"
          className="form-input"
          placeholder="New category name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" className="form-button">Add</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

// ====================================================================
// Component 2: FAQ Manager (Create Form)
// ====================================================================
const CreateFaqForm = ({ categories, onFaqCreated }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleCreateFaq = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const body = { question, answer, category_id: categoryId };
      await apiClient.post('/faqs', body);
      setMessage('Success! FAQ created.');
      setQuestion('');
      setAnswer('');
      onFaqCreated();
      setTimeout(() => setMessage(''), 3000);
    } catch (_) { // eslint-disable-line no-unused-vars
      setMessage(`Error: 'Error occurred'`);
    }
  };

  return (
    <form onSubmit={handleCreateFaq} className="create-form">
      <h3>Create New FAQ</h3>
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select id="category" className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.length === 0 ? (
            <option>Please create a category first</option>
          ) : (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))
          )}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="question">Question:</label>
        <input id="question" type="text" className="form-input" value={question} onChange={(e) => setQuestion(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="answer">Answer:</label>
        <textarea id="answer" className="form-input" value={answer} onChange={(e) => setAnswer(e.target.value)} required />
      </div>
      <button type="submit" className="form-button">Create FAQ</button>
      {message && <p>{message}</p>}
    </form>
  );
};

// ====================================================================
// Component 3: FAQ Manager (List & Delete)
// ====================================================================
const FaqList = ({ faqs, categories, onDataChanged }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }
    try {
      await apiClient.delete(`/faqs/${id}`);
      onDataChanged();
    } catch (_) { // eslint-disable-line no-unused-vars
      alert(`Error: 'Could not delete'`);
    }
  };

  const handleEditClick = (faq) => {
    setSelectedFaq(faq);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFaq(null);
  };
  const handleDataSaved = () => {
    onDataChanged();
    handleCloseModal();
  };

  return (
    <div>
      <h3>Existing FAQs</h3>
      <table className="faq-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faqs.length === 0 ? (
            <tr><td colSpan="3">No FAQs found.</td></tr>
          ) : (
            faqs.map((faq) => (
              <tr key={faq.id}>
                <td>{faq.question}</td>
                <td>{faq.category_name}</td>
                <td>
                  <button 
                    className="table-button table-button-edit"
                    onClick={() => handleEditClick(faq)}
                  >
                    Edit
                  </button>
                  <button
                    className="table-button table-button-delete"
                    onClick={() => handleDeleteFaq(faq.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <EditFaqModal
        show={isModalOpen}
        onClose={handleCloseModal}
        onSaved={handleDataSaved}
        faq={selectedFaq}
        categories={categories}
      />
    </div>
  );
};

// ====================================================================
// Main Admin Dashboard Component
// ====================================================================
function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();

  const fetchData = async () => {
    setError('');
    try {
      const [catRes, faqRes] = await Promise.all([
        apiClient.get('/faqs/categories'),
        apiClient.get('/faqs')
      ]);
      setCategories(catRes.data);
      setFaqs(faqRes.data);
    } catch (_) { // eslint-disable-line no-unused-vars
      setError('Failed to fetch data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <div>
          Welcome, {user?.username}!
          <Link to="/admin/analytics" style={{ margin: '0 10px' }}>
            View Analytics
          </Link>
          <button onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <CategoryManager 
            categories={categories}
            onCategoryCreated={fetchData}
          />
        </div>

        <div className="dashboard-column">
          <CreateFaqForm
            categories={categories}
            onFaqCreated={fetchData}
          />
          <FaqList
            faqs={faqs}
            categories={categories}
            onDataChanged={fetchData}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;