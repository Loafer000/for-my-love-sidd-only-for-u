import React, { useState, useEffect } from 'react';
import { useErrorHandler, useFormValidation, validationRules } from '../hooks/useEnhancedHooks';
import { LoadingButton } from './ui/LoadingComponents';
import { ErrorMessage } from './ui/ErrorComponents';

// Enhanced Login Form with validation and error handling
const EnhancedLoginForm = () => {
  const { handleAsync, error, isLoading, clearError } = useErrorHandler();
  
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    reset
  } = useFormValidation(
    { email: '', password: '' },
    {
      email: [validationRules.required(), validationRules.email()],
      password: [validationRules.required(), validationRules.minLength(6)]
    }
  );

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }

    try {
      await handleAsync(async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Handle successful login
        alert('Login successful!');
        reset();
      });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Enhanced Login Form</h2>
      
      {error && (
        <ErrorMessage 
          message={error.message || 'Login failed'} 
          type="error" 
          onRetry={() => clearError()}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <LoadingButton
          type="submit"
          loading={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </LoadingButton>
      </form>
    </div>
  );
};

// Property Search with auto-suggestions
const PropertySearchDemo = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API call with debouncing
      const timer = setTimeout(async () => {
        // TODO: Connect to real location API (Google Places, etc.)
        // const response = await fetch(`/api/locations/search?q=${query}`);
        // const suggestions = await response.json();
        
        // Empty suggestions until real API is connected
        setSuggestions([]);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Property Search</h3>
      
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search locations..."
        />
        
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  setSuggestions([]);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Test Dashboard Component
// DEPRECATED: Test Dashboard Component - Remove in production  
// This component was for development testing only
import React from 'react';

const TestDashboard = () => {
  return (
    <div className="test-dashboard-deprecated">
      <h2>Test Dashboard</h2>
      <p>This component has been deprecated and will be removed in production.</p>
      <p>Use the main application dashboard instead.</p>
    </div>
  );
};

export default TestDashboard;

/* ORIGINAL COMPONENT - DEPRECATED  
const TestDashboardOriginal = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 ConnectSpace Testing Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Interactive demonstration of enhanced components and functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EnhancedLoginForm />
          <PropertySearchDemo />
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✅ Testing Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">🔒 Form Validation</h3>
              <p className="text-green-700 text-sm">Real-time validation with custom rules</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">⚡ Error Handling</h3>
              <p className="text-blue-700 text-sm">Comprehensive error management system</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">🎯 Loading States</h3>
              <p className="text-purple-700 text-sm">Smart loading indicators and buttons</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">🔍 Auto-complete</h3>
              <p className="text-yellow-700 text-sm">Debounced search with suggestions</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2">♿ Accessibility</h3>
              <p className="text-red-700 text-sm">WCAG 2.1 AA compliant components</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-800 mb-2">📱 Responsive</h3>
              <p className="text-indigo-700 text-sm">Mobile-first responsive design</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
*/