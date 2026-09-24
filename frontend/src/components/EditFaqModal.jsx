// src/components/EditFaqModal.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig'; // Import global client

function EditFaqModal({ faq, categories, show, onClose, onSaved }) {
  const [formData, setFormData] = useState({ /* ... */ });
  const [message, setMessage] = useState('');

  // ... (useEffect and handleChange are the same) ...
  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category_id: categories.find(c => c.name === faq.category_name)?.id || ''
      });
    }
  }, [faq, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      // Use apiClient directly
      await apiClient.put(
        `/faqs/${faq.id}`,
        formData
      );

      setMessage('FAQ updated successfully!');
      onSaved();
      onClose();
      
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || 'Update failed'}`);
    }
  };

  // ... (rest of the component is the same) ...
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit FAQ</h3>
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* ... (form groups) ... */}
          <div className="form-group">
            <label htmlFor="edit-category">Category:</label>
            <select 
              id="edit-category" 
              name="category_id"
              className="form-select" 
              value={formData.category_id} 
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-question">Question:</label>
            <input
              id="edit-question"
              type="text"
              name="question"
              className="form-input"
              value={formData.question}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-answer">Answer:</label>
            <textarea
              id="edit-answer"
              name="answer"
              className="form-input"
              value={formData.answer}
              onChange={handleChange}
              required
            />
          </div>
          
          {message && <p>{message}</p>}

          <div className="modal-actions">
            <button type="button" className="form-button" onClick={onClose} style={{ background: '#aaa' }}>
              Cancel
            </button>
            <button type="submit" className="form-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditFaqModal;