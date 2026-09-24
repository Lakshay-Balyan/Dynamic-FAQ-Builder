// src/components/PublicFaqUI.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig'; // Import our global client
import SearchResult from './SearchResult';

function PublicFaqUI() {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // --- NEW: State to track the open/active FAQ ---
  const [activeFaqId, setActiveFaqId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use apiClient for all requests now
        const res = await apiClient.get('/public/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    setActiveFaqId(null); // Close any open FAQs
    if (!query) return;

    try {
      const res = await apiClient.get(`/public/search?q=${query}`);
      if (res.data.length === 0) {
        setMessage('No results found for your search.');
      }
      setResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
      setMessage('An error occurred during the search.');
    }
  };

  // --- NEW: Handle clicking an FAQ ---
  const handleFaqClick = (id) => {
    // If it's already open, close it
    if (activeFaqId === id) {
      setActiveFaqId(null);
      return;
    }

    // Otherwise, open the new one
    setActiveFaqId(id);
    
    // --- Send the analytics request (Implements FAQ-F-040) ---
    // We send this in the background and don't wait for it
    apiClient.post(`/analytics/view/${id}`)
      .catch(err => console.error('Failed to log view:', err));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="public-search-container">
      <h2>Knowledge Base</h2>
      
      <form className="search-bar-group" onSubmit={handleSearch}>
        {/* ... (input and button) ... */}
        <input 
          type="search" 
          placeholder="Search for answers..." 
          className="form-input" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="form-button">Search</button>
      </form>

      {message && <p>{message}</p>}

      {results.length > 0 ? (
        <div>
          <h2>Search Results</h2>
          {results.map((faq) => {
            // Check if this FAQ is the active one
            const isActive = faq.id === activeFaqId;
            return (
              <div 
                key={faq.id} 
                // --- UPDATED: Add new classes and click handler ---
                className={`faq-list-item-clickable ${isActive ? 'active' : ''}`}
              >
                <h3 onClick={() => handleFaqClick(faq.id)}>
                  <SearchResult text={faq.question} query={query} />
                </h3>
                <p>
                  <SearchResult text={faq.answer} query={query} />
                </p>
                <small style={{ padding: '0 1rem 1rem', display: 'block' }}>
                  Category: {faq.category_name}
                </small>
              </div>
            );
          })}
        </div>
      ) : (
        // ... (category display) ...
        <div>
          <h2>Categories</h2>
          {categories.length > 0 ? (
            categories.map(cat => (
              <div key={cat.id} className="faq-list-item">
                <h3>{cat.name}</h3>
              </div>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PublicFaqUI;