import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const {
    id,
    title,
    location,
    price,
    floors,
    parkingSpaces,
    area,
    propertyType,
    images,
    landlord,
    amenities = []
  } = property;

  return (
    <div className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-102 transition-all duration-500 group relative">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Image */}
      <div className="relative overflow-hidden">
        <Link to={`/property/${id}`}>
          <img
            src={images?.[0] || '/default-property.svg'}
            alt={title}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110"
          />
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        
        {/* Price Badge */}
        <div className="absolute top-5 left-5">
          <div className="backdrop-blur-md bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg border border-white/20 transform group-hover:scale-105 transition-transform duration-300">
            💰 ${price.toLocaleString()}/month
          </div>
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-5 right-5">
          <div className="backdrop-blur-md bg-white/20 text-gray-800 px-3 py-1 rounded-xl text-xs font-semibold border border-white/30 shadow-lg">
            {propertyType}
          </div>
        </div>

        {/* Verified Badge */}
        {landlord?.verified && (
          <div className="absolute bottom-5 right-5">
            <div className="backdrop-blur-md bg-gradient-to-r from-emerald-500/90 to-green-500/90 text-white px-3 py-2 rounded-2xl text-xs font-bold flex items-center shadow-lg border border-white/20 transform group-hover:scale-105 transition-transform duration-300">
              <svg className="w-4 h-4 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Location */}
        <div className="mb-4">
          <Link to={`/property/${id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="text-gray-600 flex items-center text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {location}
          </p>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V7l6-6 6 6v14H9v-6H7v6H3z" />
              </svg>
              {floors || 1} floor{floors > 1 ? 's' : ''}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {parkingSpaces || 0} parking
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {area} sq ft
            </span>
          </div>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {propertyType}
          </span>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-gray-500 text-xs px-1">
                  +{amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            {landlord?.avatar ? (
              <img
                src={landlord.avatar}
                alt={landlord?.name}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-medium mr-2">
                {(landlord?.name || 'L').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm text-gray-600">
              {landlord?.name}
            </span>
            {landlord?.rating && (
              <div className="flex items-center ml-2">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-gray-500">
                  {landlord.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Add to favorites"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <Link
              to={`/property/${id}`}
              className="btn btn-primary text-sm px-4 py-2"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;