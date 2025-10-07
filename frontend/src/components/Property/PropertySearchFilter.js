import React, { useState, useEffect } from 'react';

const PropertySearchFilter = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    searchText: '',
    location: '',
    propertyType: '',
    priceRange: { min: '', max: '' },
    bedrooms: '',
    bathrooms: '',
    furnishing: '',
    amenities: [],
    availability: '',
    sortBy: 'newest',
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const propertyTypes = [
    'Apartment', 'House', 'Villa', 'Studio', 'PG/Hostel',
    'Commercial Office', 'Shop/Showroom', 'Warehouse'
  ];

  const amenitiesList = [
    'Air Conditioning', 'Balcony', 'CCTV Security', 'Club House',
    'Elevator', 'Garden', 'Gym/Fitness Center', 'Internet/WiFi',
    'Kitchen Appliances', 'Laundry', 'Parking', 'Power Backup',
    'Security Guard', 'Swimming Pool', 'Water Supply'
  ];

  const furnishingOptions = [
    'Fully Furnished', 'Semi Furnished', 'Unfurnished'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'area-large', label: 'Area: Largest First' },
    { value: 'area-small', label: 'Area: Smallest First' }
  ];

  // Mock location suggestions - in real app, this would come from API
  const locationData = [
    'Koramangala, Bangalore',
    'HSR Layout, Bangalore',
    'Indiranagar, Bangalore',
    'Whitefield, Bangalore',
    'Electronic City, Bangalore',
    'Jayanagar, Bangalore',
    'JP Nagar, Bangalore',
    'Marathahalli, Bangalore',
    'Sarjapur Road, Bangalore',
    'Hebbal, Bangalore'
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleLocationSearch = (value) => {
    handleFilterChange('location', value);
    
    if (value.length > 2) {
      const suggestions = locationData.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocationSuggestion = (location) => {
    handleFilterChange('location', location);
    setShowLocationSuggestions(false);
  };

  const clearFilters = () => {
    setFilters({
      searchText: '',
      location: '',
      propertyType: '',
      priceRange: { min: '', max: '' },
      bedrooms: '',
      bathrooms: '',
      furnishing: '',
      amenities: [],
      availability: '',
      sortBy: 'newest'
    });
    setShowAdvanced(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchText) count++;
    if (filters.location) count++;
    if (filters.propertyType) count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.furnishing) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.availability) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Basic Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by property name, area, or keywords..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Location Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Location (e.g., Koramangala, Bangalore)"
            value={filters.location}
            onChange={(e) => handleLocationSearch(e.target.value)}
            onFocus={() => filters.location.length > 2 && setShowLocationSuggestions(true)}
            onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 150)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          {/* Location Suggestions */}
          {showLocationSuggestions && locationSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {locationSuggestions.map((location, index) => (
                <button
                  key={index}
                  onClick={() => selectLocationSuggestion(location)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="w-full lg:w-48">
          <select
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Property Types</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          <svg 
            className={`w-4 h-4 mr-1 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
          Advanced Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
        </button>

        <div className="flex items-center space-x-4">
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all filters
            </button>
          )}
          
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range (₹/month)
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: '< ₹20K', min: '', max: '20000' },
                { label: '₹20K - ₹40K', min: '20000', max: '40000' },
                { label: '₹40K - ₹60K', min: '40000', max: '60000' },
                { label: '₹60K - ₹80K', min: '60000', max: '80000' },
                { label: '> ₹80K', min: '80000', max: '' }
              ].map(range => (
                <button
                  key={range.label}
                  onClick={() => setFilters(prev => ({ ...prev, priceRange: { min: range.min, max: range.max } }))}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bedrooms
              </label>
              <div className="flex flex-wrap gap-2">
                {['Studio', '1', '2', '3', '4', '5+'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange('bedrooms', filters.bedrooms === option ? '' : option)}
                    className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                      filters.bedrooms === option
                        ? 'bg-primary-100 border-primary-500 text-primary-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option === 'Studio' ? 'Studio' : `${option} BHK`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bathrooms
              </label>
              <div className="flex flex-wrap gap-2">
                {['1', '2', '3', '4', '5+'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange('bathrooms', filters.bathrooms === option ? '' : option)}
                    className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                      filters.bathrooms === option
                        ? 'bg-primary-100 border-primary-500 text-primary-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Furnishing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Furnishing
            </label>
            <div className="flex flex-wrap gap-2">
              {furnishingOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleFilterChange('furnishing', filters.furnishing === option ? '' : option)}
                  className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                    filters.furnishing === option
                      ? 'bg-primary-100 border-primary-500 text-primary-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {amenitiesList.map(amenity => (
                <label
                  key={amenity}
                  className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
            {filters.amenities.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {filters.amenities.length} amenities selected
              </p>
            )}
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Availability
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'immediate', label: 'Immediate' },
                { value: 'within-week', label: 'Within 1 Week' },
                { value: 'within-month', label: 'Within 1 Month' },
                { value: 'flexible', label: 'Flexible' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('availability', filters.availability === option.value ? '' : option.value)}
                  className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                    filters.availability === option.value
                      ? 'bg-primary-100 border-primary-500 text-primary-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySearchFilter;