// Frontend-Backend Integration Test Component

import React, { useState, useEffect } from 'react';
import AdvancedFeatureTest from './AdvancedFeatureTest';

const IntegrationTest = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [testResults, setTestResults] = useState({
    backend: { status: 'testing', message: 'Testing...' },
    auth: { status: 'pending', message: 'Waiting...' },
    properties: { status: 'pending', message: 'Waiting...' },
    bookings: { status: 'pending', message: 'Waiting...' },
    payments: { status: 'pending', message: 'Waiting...' }
  });

  const updateResult = (test, status, message, data = null) => {
    setTestResults(prev => ({
      ...prev,
      [test]: { status, message, data }
    }));
  };

  const runTests = async () => {
    try {
      // Test 1: Backend Health Check
      updateResult('backend', 'testing', 'Checking backend health...');
      const healthResponse = await fetch('http://localhost:5000/api/health');
      const healthData = await healthResponse.json();
      
      if (healthResponse.ok) {
        updateResult('backend', 'success', 'Backend is running!', healthData);
        
        // Test 2: Auth Endpoints
        updateResult('auth', 'testing', 'Testing authentication endpoints...');
        const authResponse = await fetch('http://localhost:5000/api/auth/test');
        const authData = await authResponse.json();
        
        if (authResponse.ok) {
          updateResult('auth', 'success', 'Auth endpoints working!', authData);
        } else {
          updateResult('auth', 'error', 'Auth test failed');
        }

        // Test 3: Property Endpoints
        updateResult('properties', 'testing', 'Testing property endpoints...');
        const propResponse = await fetch('http://localhost:5000/api/properties/test');
        const propData = await propResponse.json();
        
        if (propResponse.ok) {
          updateResult('properties', 'success', 'Property endpoints working!', propData);
        } else {
          updateResult('properties', 'error', 'Property test failed');
        }

        // Test 4: Booking Endpoints
        updateResult('bookings', 'testing', 'Testing booking endpoints...');
        const bookingResponse = await fetch('http://localhost:5000/api/bookings/test');
        const bookingData = await bookingResponse.json();
        
        if (bookingResponse.ok) {
          updateResult('bookings', 'success', 'Booking endpoints working!', bookingData);
        } else {
          updateResult('bookings', 'error', 'Booking test failed');
        }

        // Test 5: Payment Endpoints
        updateResult('payments', 'testing', 'Testing payment endpoints...');
        const paymentResponse = await fetch('http://localhost:5000/api/payments/test');
        const paymentData = await paymentResponse.json();
        
        if (paymentResponse.ok) {
          updateResult('payments', 'success', 'Payment endpoints working!', paymentData);
        } else {
          updateResult('payments', 'error', 'Payment test failed');
        }

      } else {
        updateResult('backend', 'error', 'Backend health check failed');
      }
    } catch (error) {
      updateResult('backend', 'error', `Connection failed: ${error.message}`);
    }
  };

  useEffect(() => {
    runTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'testing': return '🔄';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 ConnectSpace Integration Test Suite
        </h1>
        <p className="text-gray-600">
          Complete testing of frontend-backend connectivity and all system features
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'basic'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          🔧 Basic API Tests
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'advanced'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          🚀 Advanced Features
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Core System API Testing
            </h2>
          </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(testResults).map(([test, result]) => (
          <div key={test} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg capitalize">
                {test === 'backend' ? 'Backend Health' : `${test} API`}
              </h3>
              <span className="text-2xl">
                {getStatusIcon(result.status)}
              </span>
            </div>
            
            <p className={`text-sm mb-2 ${getStatusColor(result.status)}`}>
              {result.message}
            </p>

            {result.data && (
              <div className="mt-3 p-2 bg-white rounded text-xs">
                <strong>Response:</strong>
                <pre className="mt-1 text-gray-600 overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={runTests}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          🔄 Run Tests Again
        </button>
      </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Basic Test Coverage</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Backend health and connectivity</li>
              <li>• Authentication API endpoints</li>
              <li>• Property management APIs</li>
              <li>• Booking system APIs</li>
              <li>• Payment processing APIs</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'advanced' && (
        <div>
          <AdvancedFeatureTest onComplete={(results) => {
            // Handle test completion results
          }} />
        </div>
      )}
    </div>
  );
};

export default IntegrationTest;