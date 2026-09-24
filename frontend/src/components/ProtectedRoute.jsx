// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(); // Get user from context

  if (loading) {
    return <div>Loading...</div>; // Show loading screen
  }

  if (!user) {
    // If no user, redirect to the login page
    return <Navigate to="/" replace />;
  }

  // If user exists, show the child component
  return children;
}

export default ProtectedRoute;