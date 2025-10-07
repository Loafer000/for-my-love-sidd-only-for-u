import React, { useState, useEffect } from 'react';

const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
  const sizes = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
      {text && <p className="mt-2 text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

const FullPageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="large" text={text} />
      </div>
    </div>
  );
};

const SkeletonLoader = ({ className = '', rows = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="bg-gray-200 h-4 rounded mb-2 last:mb-0" 
             style={{ width: `${100 - (index * 10)}%` }}>
        </div>
      ))}
    </div>
  );
};

const CardSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="bg-gray-200 h-6 rounded mb-4 w-3/4"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 h-4 rounded w-full"></div>
        <div className="bg-gray-200 h-4 rounded w-5/6"></div>
        <div className="bg-gray-200 h-4 rounded w-4/6"></div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="bg-gray-200 h-4 rounded w-1/4"></div>
        <div className="bg-gray-200 h-8 rounded w-20"></div>
      </div>
    </div>
  );
};

const PropertyCardSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-48 w-full"></div>
      <div className="p-4">
        <div className="bg-gray-200 h-6 rounded mb-2 w-3/4"></div>
        <div className="bg-gray-200 h-4 rounded mb-3 w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="bg-gray-200 h-5 rounded w-1/3"></div>
          <div className="bg-gray-200 h-4 rounded w-1/4"></div>
        </div>
        <div className="flex space-x-2 mt-3">
          <div className="bg-gray-200 h-6 rounded w-16"></div>
          <div className="bg-gray-200 h-6 rounded w-20"></div>
          <div className="bg-gray-200 h-6 rounded w-14"></div>
        </div>
      </div>
    </div>
  );
};

const LoadingButton = ({ loading, disabled, children, className = '', ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`${className} ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''} 
        flex items-center justify-center space-x-2`}
    >
      {loading && <LoadingSpinner size="small" text="" />}
      <span>{children}</span>
    </button>
  );
};

const LazyLoader = ({ children, fallback, delay = 200 }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (loading) {
    return fallback || <LoadingSpinner />;
  }

  return children;
};

export {
  LoadingSpinner,
  FullPageLoader,
  SkeletonLoader,
  CardSkeleton,
  PropertyCardSkeleton,
  LoadingButton,
  LazyLoader
};