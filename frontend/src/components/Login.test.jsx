// frontend/src/components/Login.test.jsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// --- FIX 2: Added 'beforeEach' to the import ---
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
// --- FIX 1: Removed unused 'useAuth' import ---
// import { useAuth } from '../context/AuthContext'; // No longer needed

// Mock the AuthContext
const mockLogin = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows an error message on failed login', async () => {
    // 1. Setup the mock to simulate a failed login
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // 2. Fill out the form
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    
    // 3. Click the login button
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // 4. Wait for the error message to appear
    await waitFor(() => {
      // This assertion now covers your error-handling code
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
    });

    // Make sure we DID NOT redirect
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});