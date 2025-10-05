import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the API module
jest.mock('./api/api', () => ({
  CaseService: {
    getCases: jest.fn(() => Promise.resolve([])),
    getCase: jest.fn(() => Promise.resolve(null)),
    updateCase: jest.fn(() => Promise.resolve(null)),
    emailBank: jest.fn(() => Promise.resolve({ message: 'Email sent' })),
    uploadEvidence: jest.fn(() => Promise.resolve({ filename: 'test.pdf' }))
  }
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ children }) => <div>{children}</div>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useLocation: () => ({ pathname: '/' })
}));

// Mock VoiceIntegrationHook
jest.mock('./components/VoiceIntegrationHook', () => {
  return jest.fn(() => ({
    selectCase: jest.fn(),
    filterCases: jest.fn(),
    clearFilters: jest.fn(),
    showAllCases: jest.fn(),
    closeCaseDetails: jest.fn(),
    getCaseSummary: jest.fn(),
    getStatistics: jest.fn(),
    getCurrentState: jest.fn(() => ({
      totalCases: 0,
      filteredCases: 0,
      selectedCase: null,
      showCaseDetails: false,
      currentFilters: {},
      isListening: false
    })),
    getCommandHistory: jest.fn(() => []),
    getAvailableCommands: jest.fn(() => []),
    getSampleCommands: jest.fn(() => [])
  }));
});

test('renders demo mode banner', () => {
  render(<App />);
  const demoBanner = screen.getByText(/DEMO MODE/i);
  expect(demoBanner).toBeInTheDocument();
});

test('renders header with application title', () => {
  render(<App />);
  const title = screen.getByText(/Merchant Category Code/i);
  expect(title).toBeInTheDocument();
});

test('renders navigation tabs', () => {
  render(<App />);
  const alertsTab = screen.getByText('Alerts');
  const casesTab = screen.getByText('Cases');
  expect(alertsTab).toBeInTheDocument();
  expect(casesTab).toBeInTheDocument();
});



