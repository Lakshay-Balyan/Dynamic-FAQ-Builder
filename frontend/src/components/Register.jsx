// src/components/Register.jsx
import React, { useState } from 'react';
import apiClient from '../api/axiosConfig'; // Use apiClient
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Editor');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await apiClient.post('/auth/register', {
        username,
        password,
        role,
      });

      setMessage(`User ${res.data.username} created! Redirecting to login...`);
      setTimeout(() => navigate('/'), 2000); 
    } catch (err) {
      if (err.response) {
        setMessage(`Error: ${err.response.data.message}`);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Register New User</h2>
      <form onSubmit={handleRegister}>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select 
            id="role"
            className="form-select"
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Editor">Editor</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>

        {message && <p className="form-error">{message}</p>}

        <button type="submit" className="form-button">
          Register User
        </button>
      </form>

      <p className="form-switch-link">
        Already have an account? 
        <Link to="/"> Login here</Link>
      </p>
    </div>
  );
}

export default Register;