import React from 'react';

const PropertyInfo = ({ property }) => {
  const {
    description,
    floors,
    parkingSpaces,
    area,
    propertyType,
    amenities = [],
    landlord
  } = property;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        {/* Property Description */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
          <p className="text-gray-700 leading-relaxed">
            {description || 'This is a beautiful property with modern amenities and excellent location.'}
          </p>
        </div>

        {/* Property Details Grid */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{floors || 1}</div>
              <div className="text-sm text-gray-600">Floor{floors > 1 ? 's' : ''}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{parkingSpaces || 0}</div>
              <div className="text-sm text-gray-600">Parking Spaces</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{area}</div>
              <div className="text-sm text-gray-600">Sq Ft</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-gray-900">{propertyType}</div>
              <div className="text-sm text-gray-600">Type</div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Landlord Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Owner</h3>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <img
              src={landlord?.avatar || '/default-avatar.svg'}
              alt={landlord?.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <div className="flex items-center mb-1">
                <h4 className="font-semibold text-gray-900 mr-2">{landlord?.name}</h4>
                {landlord?.verified && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              {landlord?.rating && (
                <div className="flex items-center mb-1">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(landlord.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {landlord.rating.toFixed(1)} rating
                  </span>
                </div>
              )}
              <p className="text-sm text-gray-600">Property Owner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;