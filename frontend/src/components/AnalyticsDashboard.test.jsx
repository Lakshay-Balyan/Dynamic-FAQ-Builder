// frontend/src/components/AnalyticsDashboard.test.jsx

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AnalyticsDashboard from './AnalyticsDashboard';
import apiClient from '../api/axiosConfig';

// Mock the apiClient
vi.mock('../api/axiosConfig', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock the AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'testuser' },
  }),
}));

describe('AnalyticsDashboard Component', () => {
  it('renders analytics data correctly after fetching', async () => {
    // 1. Define the mock data
    const mockData = {
      topViews: [{ question: 'How to test?', view_count: 100 }],
      topSearches: [{ search_term: 'test', frequency: 50 }],
      zeroResults: [{ search_term: 'asdf', frequency: 10 }],
    };

    // 2. Mock the API call
    apiClient.get.mockResolvedValue({ data: mockData });

    // 3. Render the component
    render(
      <BrowserRouter>
        <AnalyticsDashboard />
      </BrowserRouter>
    );

    // 4. Wait for the data to appear and check
    await waitFor(() => {
      // Check for the "Top Viewed" data
      expect(screen.getByText('Top 10 Viewed FAQs')).toBeInTheDocument();
      expect(screen.getByText('How to test?')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();

      // Check for the "Top Searches" data
      expect(screen.getByText('Top 10 Search Terms')).toBeInTheDocument();
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();

      // Check for the "Zero Results" data
      expect(screen.getByText('Top 10 Zero-Result Searches')).toBeInTheDocument();
      expect(screen.getByText('asdf')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });
});