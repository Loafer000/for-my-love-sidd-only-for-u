import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ImageGallery from '../components/Property/ImageGallery';
import PropertyInfo from '../components/Property/PropertyInfo';
import ContactLandlord from '../components/Property/ContactLandlord';
import PropertyBooking from '../components/Property/PropertyBooking';
import Reviews from '../components/Property/Reviews';
import MapView from '../components/Map/MapView';
import AuthModal from '../components/Auth/AuthModal';
import toast from 'react-hot-toast';
import { bookingAPI } from '../services/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const { currentProperty, loading, getPropertyById } = useProperty();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (id) {
      getPropertyById(id);
    }
  }, [id, getPropertyById]);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentProperty?.title,
        text: `Check out this property: ${currentProperty?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleBookProperty = (bookingType = 'booking') => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowBookingModal(bookingType);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      // Here we'll integrate with backend API
      // Process booking data
      toast.success('Booking request submitted successfully!');
      setShowBookingModal(false);
      
      // Integrate with backend API
      const bookingPayload = {
        propertyId: id,
        bookingType: bookingData.bookingType || 'inquiry',
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        message: bookingData.message,
        moveInDate: bookingData.moveInDate,
        leaseDuration: bookingData.leaseDuration,
        visitDate: bookingData.visitDate,
        visitTime: bookingData.visitTime,
        specialRequests: bookingData.specialRequests
      };

      const response = await bookingAPI.createBooking(bookingPayload);
      if (response.success) {
        toast.success(response.message);
      } else {
        throw new Error(response.message || 'Failed to submit booking');
      }
    } catch (error) {
      toast.error('Failed to submit booking request');
      console.error('Booking error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!currentProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600">
            The property you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-2xl mb-4">
                🏢 {currentProperty.propertyType}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4">
                {currentProperty.title}
              </h1>
              <p className="text-xl text-gray-600 flex items-center">
                <svg className="w-6 h-6 mr-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {currentProperty.location}
              </p>
              <div className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-2xl shadow-lg">
                💰 ${currentProperty.price?.toLocaleString()}/month
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <ImageGallery images={currentProperty.images} />

            {/* Property Information */}
            <PropertyInfo property={currentProperty} />

            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">Location</h3>
              </div>
              <div className="h-64">
                <MapView 
                  properties={[currentProperty]} 
                  center={currentProperty.coordinates}
                  zoom={15}
                />
              </div>
            </div>

            {/* Reviews */}
            <Reviews reviews={currentProperty.reviews} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Price & Contact */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    ${currentProperty.price}
                    <span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                </div>
                <ContactLandlord landlord={currentProperty.landlord} />
                
                {/* Booking Actions */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => handleBookProperty('booking')}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    📝 Book This Property
                  </button>
                  <button
                    onClick={() => handleBookProperty('visit')}
                    className="w-full border-2 border-indigo-200 text-indigo-600 py-3 px-6 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                  >
                    📞 Schedule Visit
                  </button>
                  <button
                    onClick={() => handleBookProperty('inquiry')}
                    className="w-full border-2 border-gray-200 text-gray-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    💬 Send Inquiry
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Property Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">{currentProperty.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floors</span>
                    <span className="font-medium">{currentProperty.floors || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking Spaces</span>
                    <span className="font-medium">{currentProperty.parkingSpaces || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area</span>
                    <span className="font-medium">{currentProperty.area} sq ft</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {currentProperty.amenities && currentProperty.amenities.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentProperty.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <PropertyBooking
          property={currentProperty}
          initialTab={typeof showBookingModal === 'string' ? showBookingModal : 'inquiry'}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          initialMode="login"
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            setShowBookingModal(true);
          }}
        />
      )}
    </div>
  );
};

export default PropertyDetails;