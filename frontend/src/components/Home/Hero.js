import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    type: 'login'
  });

  const handleAddProperty = () => {
    if (isAuthenticated) {
      // Redirect to dashboard with add property intent
      navigate('/dashboard?tab=properties&action=add');
    } else {
      // Open login modal first
      setAuthModal({ isOpen: true, type: 'login' });
    }
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, type: 'login' });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/30 to-purple-500/30 rounded-full filter blur-3xl animate-float animation-delay-4000"></div>
      </div>
      
      {/* Dynamic Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 flex items-center min-h-screen">
        <div className="text-center w-full">
          {/* Animated Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl mb-8 animate-bounce-in shadow-2xl">
            <svg className="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-fade-in">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Commercial Space
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl mb-12 text-blue-100 max-w-4xl mx-auto animate-slide-up leading-relaxed">
            Connect with <span className="text-cyan-400 font-semibold">verified landlords</span> and discover 
            <span className="text-purple-300 font-semibold"> premium commercial properties</span> that power your business success
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up mb-16">
            <Link
              to="/search"
              className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-3xl transform hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-xl animate-pulse-glow"
            >
              <svg className="w-6 h-6 mr-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Properties
            </Link>
            <button
              onClick={handleAddProperty}
              className="group px-10 py-5 border-3 border-white/50 backdrop-blur-md bg-white/10 text-white hover:bg-white hover:text-indigo-900 font-bold rounded-3xl transform hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-xl"
            >
              <svg className="w-6 h-6 mr-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              List Your Property
            </button>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-bounce-in">
              <div className="text-4xl font-bold text-cyan-400 mb-2">10,000+</div>
              <div className="text-blue-200">Properties Listed</div>
            </div>
            <div className="text-center animate-bounce-in animation-delay-2000">
              <div className="text-4xl font-bold text-purple-400 mb-2">5,000+</div>
              <div className="text-blue-200">Happy Businesses</div>
            </div>
            <div className="text-center animate-bounce-in animation-delay-4000">
              <div className="text-4xl font-bold text-pink-400 mb-2">50+</div>
              <div className="text-blue-200">Cities Covered</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50 via-indigo-50/50 to-transparent"></div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.type}
        onClose={closeAuthModal}
        onSuccess={() => {
          // Redirect to dashboard with add property action after successful login
          navigate('/dashboard?tab=properties&action=add');
        }}
      />
    </section>
  );
};

export default Hero;