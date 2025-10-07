import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { APIError } from '../services/enhancedAPI_fixed';

// Test utilities for React Testing Library

// Custom render function with router
export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

// Mock API responses
export const mockAPIResponse = (data, success = true, status = 200) => {
  if (success) {
    return Promise.resolve({
      ok: true,
      status,
      json: () => Promise.resolve(data),
      headers: new Map([['content-type', 'application/json']]),
    });
  } else {
    return Promise.reject(new APIError(data.message || 'API Error', status, data));
  }
};

// Mock fetch function
export const mockFetch = (responses) => {
  let callCount = 0;
  
  global.fetch = jest.fn(() => {
    const response = responses[callCount] || responses[responses.length - 1];
    callCount++;
    return response;
  });
};

// Test data generators
export const generateTestUser = (overrides = {}) => ({
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phoneNumber: '+1234567890',
  userType: 'tenant',
  profilePicture: null,
  isVerified: true,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const generateTestProperty = (overrides = {}) => ({
  id: '1',
  title: 'Test Property',
  description: 'A beautiful test property',
  price: 50000,
  location: {
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    coordinates: [12.345, 67.890],
  },
  propertyType: 'apartment',
  bhk: 2,
  area: 1200,
  amenities: ['parking', 'gym'],
  photos: ['photo1.jpg', 'photo2.jpg'],
  available: true,
  owner: '1',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const generateTestBooking = (overrides = {}) => ({
  id: '1',
  property: generateTestProperty(),
  tenant: generateTestUser(),
  checkIn: new Date().toISOString(),
  checkOut: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'confirmed',
  totalAmount: 50000,
  createdAt: new Date().toISOString(),
  ...overrides,
});

// Form testing utilities
export const fillForm = async (user, formData) => {
  for (const [fieldName, value] of Object.entries(formData)) {
    const field = screen.getByLabelText(new RegExp(fieldName, 'i'));
    await user.clear(field);
    await user.type(field, value);
  }
};

export const submitForm = async (user, buttonText = /submit/i) => {
  const submitButton = screen.getByRole('button', { name: buttonText });
  await user.click(submitButton);
};

// Wait for element utilities
export const waitForElement = async (selector) => {
  return waitFor(() => screen.getByTestId(selector));
};

export const waitForText = async (text) => {
  return waitFor(() => screen.getByText(text));
};

// Error testing utilities
export const expectErrorMessage = (message) => {
  expect(screen.getByText(message)).toBeInTheDocument();
};

export const expectSuccessMessage = (message) => {
  expect(screen.getByText(message)).toBeInTheDocument();
};

// Loading state testing
export const expectLoadingState = () => {
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
};

export const expectNoLoadingState = () => {
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
};

// Mock localStorage
export const mockLocalStorage = () => {
  const store = {};
  
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
  };
};

// Mock console methods
export const mockConsole = () => {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });
  
  afterEach(() => {
    Object.assign(console, originalConsole);
  });
};

// Test component wrapper
export const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <div data-testid="test-wrapper">
      {children}
    </div>
  </BrowserRouter>
);

// API integration test helpers
export const testAPIEndpoint = async (apiFunction, testCases) => {
  for (const testCase of testCases) {
    const { input, expectedOutput, shouldFail = false } = testCase;
    
    if (shouldFail) {
      await expect(apiFunction(input)).rejects.toThrow();
    } else {
      const result = await apiFunction(input);
      expect(result).toEqual(expectedOutput);
    }
  }
};

// Performance testing utility
export const measurePerformance = (fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    console.log(`Performance: ${fn.name} took ${end - start} milliseconds`);
    return result;
  };
};

// Accessibility testing helpers
export const testA11y = async (component) => {
  const { container } = render(component);
  
  // Check for proper heading structure
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    expect(heading).toHaveAttribute('id');
  });
  
  // Check for alt text on images
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    expect(img).toHaveAttribute('alt');
  });
  
  // Check for form labels
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const label = container.querySelector(`label[for="${input.id}"]`);
    expect(label || input.getAttribute('aria-label')).toBeTruthy();
  });
};

// Mobile testing utilities
export const testMobileResponsiveness = (component) => {
  const breakpoints = [
    { width: 320, height: 568 }, // iPhone 5
    { width: 375, height: 667 }, // iPhone 6/7/8
    { width: 414, height: 896 }, // iPhone XR
    { width: 768, height: 1024 }, // iPad
    { width: 1024, height: 768 }, // iPad Landscape
    { width: 1920, height: 1080 }, // Desktop
  ];
  
  breakpoints.forEach(({ width, height }) => {
    Object.defineProperty(window, 'innerWidth', { value: width });
    Object.defineProperty(window, 'innerHeight', { value: height });
    
    const { container } = render(component);
    
    // Test that content is visible and accessible at this breakpoint
    expect(container.firstChild).toBeVisible();
  });
};

export default {
  renderWithRouter,
  mockAPIResponse,
  mockFetch,
  generateTestUser,
  generateTestProperty,
  generateTestBooking,
  fillForm,
  submitForm,
  waitForElement,
  waitForText,
  expectErrorMessage,
  expectSuccessMessage,
  expectLoadingState,
  expectNoLoadingState,
  mockLocalStorage,
  mockConsole,
  TestWrapper,
  testAPIEndpoint,
  measurePerformance,
  testA11y,
  testMobileResponsiveness,
};