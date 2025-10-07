import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Report error to logging service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: reportErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    });
  };

  toggleDetails = () => {
    this.setState(prevState => ({ 
      showDetails: !prevState.showDetails 
    }));
  };

  render() {
    if (this.state.hasError) {
      const { error, showDetails } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">�</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600">
                We encountered an unexpected error. Don't worry, it's not your fault!
              </p>
            </div>

            {/* Error Details (Development Mode) */}
            {isDevelopment && error && (
              <div className="mb-6">
                <button
                  onClick={this.toggleDetails}
                  className="text-sm text-blue-600 hover:text-blue-800 underline mb-3"
                >
                  {showDetails ? 'Hide' : 'Show'} Error Details
                </button>
                
                {showDetails && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <h3 className="text-sm font-semibold text-red-800 mb-2">Error Message:</h3>
                    <p className="text-sm text-red-700 mb-3 font-mono">
                      {error.message}
                    </p>
                    
                    {error.stack && (
                      <>
                        <h3 className="text-sm font-semibold text-red-800 mb-2">Stack Trace:</h3>
                        <pre className="text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto max-h-32">
                          {error.stack}
                        </pre>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Go Home
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                Refresh Page
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                If this problem persists, please contact support or try again later.
              </p>
              {isDevelopment && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  Development Mode - Error details are shown above
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;