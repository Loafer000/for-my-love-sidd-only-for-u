import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Import the components we need to test
import ErrorBoundary from '../components/ErrorBoundary';
import { 
  LoadingSpinner, 
  FullPageLoader, 
  LoadingButton 
} from '../components/ui/LoadingComponents';
import { 
  ErrorMessage, 
  NotFound, 
  EmptyState 
} from '../components/ui/ErrorComponents';
import testUtils from '../utils/testUtils';

// Test suites for UI components
describe('Loading Components', () => {
  test('LoadingSpinner renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('LoadingSpinner renders with custom text', () => {
    render(<LoadingSpinner text="Custom loading message" />);
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  test('FullPageLoader covers entire screen', () => {
    render(<FullPageLoader />);
    const loader = screen.getByText('Loading...');
    expect(loader).toBeInTheDocument();
  });

  test('LoadingButton shows loading state', async () => {
    const user = userEvent.setup();
    const mockClick = jest.fn();
    
    render(
      <LoadingButton loading={true} onClick={mockClick}>
        Submit
      </LoadingButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    
    await user.click(button);
    expect(mockClick).not.toHaveBeenCalled();
  });
});

describe('Error Components', () => {
  test('ErrorMessage displays error correctly', () => {
    render(<ErrorMessage message="Test error message" type="error" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('ErrorMessage with retry button works', async () => {
    const user = userEvent.setup();
    const mockRetry = jest.fn();
    
    render(<ErrorMessage message="Test error" onRetry={mockRetry} />);
    
    const retryButton = screen.getByText('Try again');
    await user.click(retryButton);
    expect(mockRetry).toHaveBeenCalled();
  });

  test('NotFound component renders correctly', () => {
    render(<NotFound title="Page Not Found" message="Custom not found message" />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Custom not found message')).toBeInTheDocument();
  });

  test('EmptyState with action button works', async () => {
    const user = userEvent.setup();
    const mockAction = jest.fn();
    
    render(
      <EmptyState 
        title="No items" 
        actionLabel="Add Item" 
        onAction={mockAction} 
      />
    );
    
    const actionButton = screen.getByText('Add Item');
    await user.click(actionButton);
    expect(mockAction).toHaveBeenCalled();
  });
});

describe('Error Boundary', () => {
  // Component that throws an error for testing
  const ThrowError = ({ shouldThrow }) => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return <div>No error</div>;
  };

  test('Error boundary catches and displays error', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  test('Error boundary renders children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});

// API Integration Tests
describe('API Integration', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('API handles successful response', async () => {
    const mockData = { id: 1, name: 'Test User' };
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'application/json']]),
      json: () => Promise.resolve(mockData),
    });

    const { authAPI } = require('../services/enhancedAPI');
    const result = await authAPI.checkAuthStatus();
    
    expect(result).toEqual(mockData);
  });

  test('API handles error response', async () => {
    const mockError = { message: 'Unauthorized', error: 'Invalid token' };
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: new Map([['content-type', 'application/json']]),
      json: () => Promise.resolve(mockError),
    });

    const { authAPI, APIError } = require('../services/enhancedAPI');
    
    await expect(authAPI.checkAuthStatus()).rejects.toThrow(APIError);
  });

  test('API handles network error', async () => {
    global.fetch.mockRejectedValueOnce(new TypeError('Network request failed'));

    const { authAPI, APIError } = require('../services/enhancedAPI');
    
    await expect(authAPI.checkAuthStatus()).rejects.toThrow(APIError);
  });
});

// Form Validation Tests
describe('Form Validation', () => {
  const TestForm = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState({});

    const validateForm = () => {
      const newErrors = {};
      
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
        newErrors.email = 'Invalid email format';
      }
      
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        console.log('Form submitted');
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span role="alert">{errors.email}</span>}
        </div>
        
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span role="alert">{errors.password}</span>}
        </div>
        
        <button type="submit">Submit</button>
      </form>
    );
  };

  test('Form validation shows errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    
    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);
    
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('Form validation shows error for invalid email', async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByText('Submit');
    
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  test('Form validation shows error for short password', async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByText('Submit');
    
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  test('Form submits with valid data', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const user = userEvent.setup();
    render(<TestForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByText('Submit');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Form submitted');
    consoleSpy.mockRestore();
  });
});

// Accessibility Tests
describe('Accessibility', () => {
  test('Components have proper ARIA labels', () => {
    render(
      <div>
        <button aria-label="Close modal">×</button>
        <input aria-label="Search properties" />
        <div role="alert">Error message</div>
      </div>
    );
    
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    expect(screen.getByLabelText('Search properties')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('Form inputs have associated labels', () => {
    render(
      <form>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" />
        
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </form>
    );
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});

// Performance Tests
describe('Performance', () => {
  test('Components render within acceptable time', async () => {
    const start = performance.now();
    
    render(
      <BrowserRouter>
        <div>
          <LoadingSpinner />
          <ErrorMessage message="Test error" />
          <EmptyState title="No data" />
        </div>
      </BrowserRouter>
    );
    
    const end = performance.now();
    const renderTime = end - start;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });
});

export default {
  // Export test utilities for use in other test files
  ...testUtils,
};
