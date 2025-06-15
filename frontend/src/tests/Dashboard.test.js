// Test file to verify all components are working correctly
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from '../components/Dashboard/Dashboard';
import TrendsFeed from '../components/Dashboard/TrendsFeed';

const theme = createTheme();

// Mock services
jest.mock('../services/clothing', () => ({
  getAllItems: () => Promise.resolve([
    { _id: '1', name: 'Blue Shirt', category: 'tops', color: 'blue', season: 'summer' }
  ]),
  getWearFrequencyStats: () => Promise.resolve({})
}));

jest.mock('../services/outfits', () => ({
  getAllOutfits: () => Promise.resolve([
    { _id: '1', name: 'Casual Outfit', items: [], createdAt: new Date() }
  ])
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe('Dashboard Components', () => {
  test('Dashboard renders without crashing', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );
    expect(screen.getByText(/Good (Morning|Afternoon|Evening)!/)).toBeInTheDocument();
  });

  test('TrendsFeed renders without crashing', () => {
    const mockItems = [
      { _id: '1', name: 'Blue Shirt', category: 'tops', color: 'blue', season: 'summer' }
    ];
    
    render(
      <TestWrapper>
        <TrendsFeed userItems={mockItems} />
      </TestWrapper>
    );
    expect(screen.getByText(/Fashion Trends & Tips/)).toBeInTheDocument();
  });
});
