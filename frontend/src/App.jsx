// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PublicFaqUI from './components/PublicFaqUI';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  return (
    <div className="App">
      {/* This nav is just for development, you can remove it later */}
      <nav className="temp-nav">
        <Link to="/" style={{ marginRight: '10px' }}>Login</Link>
        <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
        <Link to="/search" style={{ marginRight: '10px' }}>Public Search</Link>
        <Link to="/admin/dashboard" style={{ marginRight: '10px' }}>Admin Dashboard</Link>
        <Link to="/admin/analytics">Analytics</Link>
      </nav>

      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<PublicFaqUI />} />

        {/* --- Protected Admin Routes --- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;