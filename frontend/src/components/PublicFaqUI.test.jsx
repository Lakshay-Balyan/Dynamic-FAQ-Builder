// frontend/src/components/PublicFaqUI.test.jsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// --- FIX: Import 'beforeEach' ---
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PublicFaqUI from './PublicFaqUI';
import apiClient from '../api/axiosConfig';

// Mock the apiClient
vi.mock('../api/axiosConfig', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(), // Mock post for view tracking
  },
}));

describe('PublicFaqUI Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Mock the initial category fetch
    apiClient.get.mockImplementation((url) => {
      if (url === '/public/categories') {
        return Promise.resolve({ data: [{ id: 1, name: 'General' }] });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('renders and displays categories on load', async () => {
    render(
      <BrowserRouter>
        <PublicFaqUI />
      </BrowserRouter>
    );
    
    // --- FIX: Wait for the *categories* to appear first ---
    // This confirms the "Loading..." state is gone.
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /general/i })).toBeInTheDocument();
    });

    // Now we can safely check for the other elements
    expect(screen.getByRole('heading', { name: /knowledge base/i })).toBeInTheDocument();
  });

  it('performs a search and displays results', async () => {
    // Mock the search API call
    const mockResults = [
      { id: 1, question: 'What is React?', answer: 'A JS library.', category_name: 'General' },
    ];
    apiClient.get.mockImplementation((url) => {
      if (url.startsWith('/public/search')) {
        return Promise.resolve({ data: mockResults });
      }
      return Promise.resolve({ data: [] }); // No categories for this test
    });

    render(
      <BrowserRouter>
        <PublicFaqUI />
      </BrowserRouter>
    );

    // --- FIX: Wait for the search box to appear (after loading) ---
    const searchBox = await screen.findByPlaceholderText(/search for answers/i);
    
    // 1. Simulate typing
    fireEvent.change(searchBox, { target: { value: 'React' } });

    // 2. Simulate clicking
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    // 3. Wait for the results
    await waitFor(() => {
      // This function now finds an element with that text content
  // AND clarifies it must be an 'h3' tag.
  expect(screen.getByText((content, node) => {
    return node.textContent === "What is React?";
  }, { selector: 'h3' })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /general/i })).not.toBeInTheDocument();
    });
  });

  it('shows "no results" message for an empty search', async () => {
    // Mock the search API call to return nothing
    apiClient.get.mockImplementation((url) => {
      if (url.startsWith('/public/search')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <PublicFaqUI />
      </BrowserRouter>
    );

    // --- FIX: Wait for the search box to appear (after loading) ---
    const searchBox = await screen.findByPlaceholderText(/search for answers/i);

    // 1. Type and search
    fireEvent.change(searchBox, { target: { value: 'xyz' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // 2. Wait for the "no results" message
    await waitFor(() => {
      expect(screen.getByText('No results found for your search.')).toBeInTheDocument();
    });
  });
});