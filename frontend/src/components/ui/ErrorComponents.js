import React from 'react';

const ErrorMessage = ({ 
  message = 'An unexpected error occurred', 
  type = 'error',
  icon = null,
  onRetry = null,
  className = ''
}) => {
  const typeStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  const typeIcons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅'
  };

  return (
    <div className={`border rounded-lg p-4 ${typeStyles[type]} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="text-xl">
          {icon || typeIcons[type]}
        </div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const NotFound = ({ 
  title = 'Not Found', 
  message = 'The page you are looking for does not exist.',
  showHomeButton = true 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>
        {showHomeButton && (
          <button
            onClick={() => window.location.href = '/'}
            className="btn btn-primary"
          >
            Go Home
          </button>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ 
  icon = '📭', 
  title = 'No items found', 
  message = 'There are no items to display at the moment.',
  actionLabel = null,
  onAction = null 
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

const NetworkError = ({ onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-4xl mb-4">🌐</div>
      <h3 className="text-lg font-medium text-red-900 mb-2">
        Connection Problem
      </h3>
      <p className="text-red-700 mb-4">
        Unable to connect to the server. Please check your internet connection.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

const UnauthorizedError = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <div className="text-4xl mb-4">🔒</div>
      <h3 className="text-lg font-medium text-yellow-900 mb-2">
        Access Denied
      </h3>
      <p className="text-yellow-700 mb-4">
        You don't have permission to access this resource.
      </p>
      <button
        onClick={() => window.location.href = '/login'}
        className="btn btn-primary"
      >
        Login
      </button>
    </div>
  );
};

const MaintenanceMode = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Under Maintenance
        </h1>
        <p className="text-gray-600 mb-6">
          We're currently performing scheduled maintenance. 
          Please check back in a few minutes.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-secondary"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

const ErrorFallback = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-2">
          We're sorry for the inconvenience.
        </p>
        {error && (
          <details className="mb-4 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">
              Error Details
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        <div className="space-x-3">
          <button
            onClick={resetError}
            className="btn btn-primary"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="btn btn-secondary"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export {
  ErrorMessage,
  NotFound,
  EmptyState,
  NetworkError,
  UnauthorizedError,
  MaintenanceMode,
  ErrorFallback
};