import React, { useState, useEffect } from 'react';
import './AdvancedFeatureTest.css';

const AdvancedFeatureTest = ({ onComplete }) => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [overallStatus, setOverallStatus] = useState('idle');

  const API_BASE = 'http://localhost:5000/api';

  // Get auth token from localStorage
  const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token;
  };

  // Advanced Feature Test Suite
  const advancedTests = [
    {
      name: 'Chat System API',
      tests: [
        {
          name: 'Test Chat System Health',
          endpoint: '/chat/test',
          method: 'GET',
          requiresAuth: true
        },
        {
          name: 'Get Mock Chat List',
          endpoint: '/chat/mock/list',
          method: 'GET',
          requiresAuth: true
        },
        {
          name: 'Get Mock Chat Messages',
          endpoint: '/chat/mock/sample123/messages',
          method: 'GET',
          requiresAuth: true
        }
      ]
    },
    {
      name: 'Review System API',
      tests: [
        {
          name: 'Test Review System Health',
          endpoint: '/reviews/test',
          method: 'GET',
          requiresAuth: true
        },
        {
          name: 'Get Property Reviews',
          endpoint: '/reviews/property/sample123',
          method: 'GET',
          requiresAuth: false
        }
      ]
    },
    {
      name: 'Analytics System API',
      tests: [
        {
          name: 'Test Analytics System Health',
          endpoint: '/analytics/test',
          method: 'GET',
          requiresAuth: true
        },
        {
          name: 'Get Mock Landlord Analytics',
          endpoint: '/analytics/mock/landlord',
          method: 'GET',
          requiresAuth: true
        },
        {
          name: 'Get Mock Tenant Analytics',
          endpoint: '/analytics/mock/tenant',
          method: 'GET',
          requiresAuth: true
        },
        {
          name: 'Get Mock Platform Analytics',
          endpoint: '/analytics/mock/platform',
          method: 'GET',
          requiresAuth: true
        }
      ]
    }
  ];

  const runSingleTest = async (test) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (test.requiresAuth) {
        const token = getAuthToken();
        if (!token) {
          throw new Error('Authentication required but no token found');
        }
        headers.Authorization = `Bearer ${token}`;
      }

      const options = {
        method: test.method,
        headers
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(`${API_BASE}${test.endpoint}`, options);
      const data = await response.json();

      return {
        success: response.ok,
        status: response.status,
        data: data,
        error: response.ok ? null : data.message || 'Request failed'
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        data: null,
        error: error.message
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    const results = {};

    for (const category of advancedTests) {
      setCurrentTest(`Testing ${category.name}...`);
      results[category.name] = {};

      for (const test of category.tests) {
        setCurrentTest(`${category.name}: ${test.name}`);
        const result = await runSingleTest(test);
        results[category.name][test.name] = result;

        // Add delay to see progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setTestResults(results);
    setIsRunning(false);
    setCurrentTest('');

    // Calculate overall status
    const allResults = Object.values(results).flatMap(category => Object.values(category));
    const hasFailures = allResults.some(result => !result.success);
    setOverallStatus(hasFailures ? 'failed' : 'passed');

    if (onComplete) {
      onComplete(results);
    }
  };

  const getResultIcon = (success) => {
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success) => {
    return success ? 'var(--success-color)' : 'var(--error-color)';
  };

  const calculateCategoryStats = (categoryResults) => {
    const total = Object.keys(categoryResults).length;
    const passed = Object.values(categoryResults).filter(result => result.success).length;
    return { passed, total };
  };

  useEffect(() => {
    // Auto-run tests when component mounts
    const timer = setTimeout(() => {
      runAllTests();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="integration-test-container">
      <div className="test-header">
        <h2>🚀 Advanced Features Integration Test</h2>
        <div className="test-status">
          <span className={`status-badge ${overallStatus}`}>
            {overallStatus === 'idle' && '⏱️ Ready'}
            {overallStatus === 'running' && '🔄 Running'}
            {overallStatus === 'passed' && '✅ All Passed'}
            {overallStatus === 'failed' && '❌ Some Failed'}
          </span>
        </div>
      </div>

      {currentTest && (
        <div className="current-test">
          <div className="loading-spinner"></div>
          <span>Running: {currentTest}</span>
        </div>
      )}

      <div className="controls">
        <button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="test-button primary"
        >
          {isRunning ? '🔄 Running Tests...' : '▶️ Run Advanced Feature Tests'}
        </button>
      </div>

      <div className="test-results">
        {Object.entries(testResults).map(([categoryName, categoryResults]) => {
          const stats = calculateCategoryStats(categoryResults);
          return (
            <div key={categoryName} className="test-category">
              <div className="category-header">
                <h3>{categoryName}</h3>
                <div className="category-stats">
                  <span className={stats.passed === stats.total ? 'success' : 'error'}>
                    {stats.passed}/{stats.total} Passed
                  </span>
                </div>
              </div>

              <div className="category-tests">
                {Object.entries(categoryResults).map(([testName, result]) => (
                  <div key={testName} className="test-result">
                    <div className="test-info">
                      <div className="test-name">
                        {getResultIcon(result.success)} {testName}
                      </div>
                      <div className="test-details">
                        <span 
                          className="status-code"
                          style={{ color: getStatusColor(result.success) }}
                        >
                          Status: {result.status}
                        </span>
                        {result.error && (
                          <span className="error-message">
                            Error: {result.error}
                          </span>
                        )}
                      </div>
                    </div>

                    {result.data && (
                      <details className="response-data">
                        <summary>Response Data</summary>
                        <pre>{JSON.stringify(result.data, null, 2)}</pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {overallStatus !== 'idle' && !isRunning && (
        <div className="test-summary">
          <h3>📊 Test Summary</h3>
          <div className="summary-stats">
            {Object.entries(testResults).map(([categoryName, categoryResults]) => {
              const stats = calculateCategoryStats(categoryResults);
              return (
                <div key={categoryName} className="category-summary">
                  <strong>{categoryName}:</strong>
                  <span className={stats.passed === stats.total ? 'success' : 'error'}>
                    {stats.passed}/{stats.total} tests passed
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="summary-actions">
            <p>
              {overallStatus === 'passed' 
                ? '🎉 All advanced features are working correctly!' 
                : '⚠️ Some advanced features need attention. Check failed tests above.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFeatureTest;