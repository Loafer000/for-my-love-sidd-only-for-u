import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    type: 'login'
  });
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Search', href: '/search' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const premiumNavigation = [
    { name: 'Advanced Features', href: '/advanced-features', premium: true },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const openAuthModal = (type) => {
    setAuthModal({
      isOpen: true,
      type: type
    });
    setIsOpen(false);
  };

  const closeAuthModal = () => {
    setAuthModal({
      isOpen: false,
      type: 'login'
    });
  };

  return (
    <nav className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-2xl sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  ConnectSpace
                </div>
                <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300">
                  Every Space Should Feel Like Home.
                </div>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive(item.href)
                    ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-white/50 hover:shadow-lg'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {!isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </Link>
            ))}
            
            {/* Premium Navigation - Always Visible */}
            {premiumNavigation.map((item) => (
              isAuthenticated ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                      : 'text-purple-700 hover:text-purple-600 hover:bg-purple-50 hover:shadow-lg border border-purple-200'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1">
                    <span>⭐</span>
                    {item.name}
                  </span>
                  {!isActive(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => openAuthModal('login')}
                  className="group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 text-purple-700 hover:text-purple-600 hover:bg-purple-50 hover:shadow-lg border border-purple-200"
                >
                  <span className="relative z-10 flex items-center gap-1">
                    <span>⭐</span>
                    {item.name}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt={user?.name || 'User'}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => openAuthModal('login')}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={() => openAuthModal('signup')}
                  className="btn btn-primary text-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Premium Navigation - Mobile */}
            {premiumNavigation.map((item) => (
              isAuthenticated ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium border-l-4 border-purple-500 ${
                    isActive(item.href)
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-purple-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  ⭐ {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => openAuthModal('login')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium border-l-4 border-purple-500 text-purple-700 hover:text-purple-600 hover:bg-purple-50"
                >
                  ⭐ {item.name}
                </button>
              )
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <button 
                  onClick={() => openAuthModal('login')}
                  className="block w-full text-left text-gray-700 hover:text-primary-600 font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={() => openAuthModal('signup')}
                  className="btn btn-primary w-full"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.type}
        onClose={closeAuthModal}
      />
    </nav>
  );
};

export default Navbar;