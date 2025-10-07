import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AdvancedSearch.css';

const AdvancedSearch = ({ onSearchResults, onFiltersChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    location: '',
    moveInDate: '',
    petFriendly: false,
    furnished: false,
    parking: false,
    amenities: [],
    radius: 10,
    sortBy: 'relevance'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useAuth();

  // Available amenities
  const availableAmenities = [
    'Swimming Pool', 'Gym/Fitness Center', 'Parking', 'Balcony/Patio',
    'In-unit Laundry', 'Air Conditioning', 'Dishwasher', 'Hardwood Floors',
    'Walk-in Closet', 'Fireplace', 'Garden/Yard', 'Elevator',
    'Concierge', 'Rooftop Access', 'Storage Unit', 'Bike Storage'
  ];

  // Sample search suggestions
  const sampleSuggestions = [
    'Downtown apartments under $2000',
    '2 bedroom house with parking',
    'Pet-friendly condos near subway',
    'Furnished studio apartments',
    'Luxury apartments with pool'
  ];

  // Load saved searches
  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem(`savedSearches_${user.id}`) || '[]');
      setSavedSearches(saved);
    }
  }, [user]);

  // Search suggestions based on query
  useEffect(() => {
    if (searchQuery.length > 2) {
      const suggestions = sampleSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query, currentFilters) => {
      performSearch(query, currentFilters);
    }, 500),
    []
  );

  // Trigger search when query or filters change
  useEffect(() => {
    debouncedSearch(searchQuery, filters);
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [searchQuery, filters, debouncedSearch, onFiltersChange]);

  const performSearch = async (query, searchFilters) => {
    // Mock search results - replace with actual API call
    const mockResults = generateMockResults(query, searchFilters);
    if (onSearchResults) {
      onSearchResults(mockResults);
    }
  };

  const generateMockResults = (query, searchFilters) => {
    // This would be replaced with actual API call
    const baseResults = [
      {
        id: 1,
        title: 'Modern Downtown Apartment',
        price: 2400,
        bedrooms: 2,
        bathrooms: 2,
        location: 'Downtown',
        type: 'apartment',
        petFriendly: true,
        furnished: false,
        amenities: ['Swimming Pool', 'Gym/Fitness Center', 'Parking'],
        image: '/api/placeholder/300/200',
        rating: 4.5,
        distance: 2.3
      },
      {
        id: 2,
        title: 'Cozy Suburban House',
        price: 3200,
        bedrooms: 3,
        bathrooms: 2.5,
        location: 'Suburbs',
        type: 'house',
        petFriendly: true,
        furnished: true,
        amenities: ['Garden/Yard', 'Parking', 'Fireplace'],
        image: '/api/placeholder/300/200',
        rating: 4.2,
        distance: 5.1
      },
      {
        id: 3,
        title: 'Luxury City Condo',
        price: 1800,
        bedrooms: 1,
        bathrooms: 1,
        location: 'City Center',
        type: 'condo',
        petFriendly: false,
        furnished: false,
        amenities: ['Concierge', 'Rooftop Access', 'Elevator'],
        image: '/api/placeholder/300/200',
        rating: 4.7,
        distance: 1.2
      }
    ];

    // Apply filters
    return baseResults.filter(property => {
      if (searchFilters.priceRange.min && property.price < parseInt(searchFilters.priceRange.min)) return false;
      if (searchFilters.priceRange.max && property.price > parseInt(searchFilters.priceRange.max)) return false;
      if (searchFilters.bedrooms && property.bedrooms !== parseInt(searchFilters.bedrooms)) return false;
      if (searchFilters.bathrooms && property.bathrooms < parseInt(searchFilters.bathrooms)) return false;
      if (searchFilters.propertyType && property.type !== searchFilters.propertyType) return false;
      if (searchFilters.location && !property.location.toLowerCase().includes(searchFilters.location.toLowerCase())) return false;
      if (searchFilters.petFriendly && !property.petFriendly) return false;
      if (searchFilters.furnished && !property.furnished) return false;
      if (searchFilters.amenities.length > 0) {
        const hasAllAmenities = searchFilters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      if (query && !property.title.toLowerCase().includes(query.toLowerCase()) && 
          !property.location.toLowerCase().includes(query.toLowerCase())) return false;
      
      return true;
    });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
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

  const saveCurrentSearch = () => {
    if (!user || !searchQuery.trim()) return;

    const searchData = {
      id: Date.now(),
      query: searchQuery,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
      name: searchQuery || 'Untitled Search'
    };

    const updated = [...savedSearches, searchData];
    setSavedSearches(updated);
    localStorage.setItem(`savedSearches_${user.id}`, JSON.stringify(updated));
  };

  const loadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
  };

  const deleteSavedSearch = (searchId) => {
    const updated = savedSearches.filter(search => search.id !== searchId);
    setSavedSearches(updated);
    localStorage.setItem(`savedSearches_${user.id}`, JSON.stringify(updated));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      priceRange: { min: '', max: '' },
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      location: '',
      moveInDate: '',
      petFriendly: false,
      furnished: false,
      parking: false,
      amenities: [],
      radius: 10,
      sortBy: 'relevance'
    });
  };

  return (
    <div className="advanced-search">
      {/* Main Search Bar */}
      <div className="search-bar-container">
        <div className="main-search-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for properties, locations, or keywords..."
              className="search-input"
            />
            <button className="voice-search-btn" title="Voice Search">🎤</button>
          </div>
          
          <div className="search-actions">
            <button
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              🔧 {showAdvanced ? 'Simple' : 'Advanced'}
            </button>
            <button className="search-btn">
              🔍 Search
            </button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (
          <div className="search-suggestions">
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setSearchQuery(suggestion);
                  setShowSuggestions(false);
                }}
              >
                <span className="suggestion-icon">🔍</span>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filters-header">
            <h3>Advanced Filters</h3>
            <div className="filter-actions">
              <button onClick={saveCurrentSearch} className="save-search-btn">
                💾 Save Search
              </button>
              <button onClick={clearAllFilters} className="clear-filters-btn">
                🗑️ Clear All
              </button>
            </div>
          </div>

          <div className="filters-grid">
            {/* Price Range */}
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-range">
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  placeholder="Min"
                  className="price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  placeholder="Max"
                  className="price-input"
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="filter-group">
              <label>Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Bathrooms</label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="filter-group">
              <label>Property Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              >
                <option value="">Any Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>

            {/* Location */}
            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="City, neighborhood, or ZIP"
              />
            </div>

            {/* Move-in Date */}
            <div className="filter-group">
              <label>Move-in Date</label>
              <input
                type="date"
                value={filters.moveInDate}
                onChange={(e) => handleFilterChange('moveInDate', e.target.value)}
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="quick-filters">
            <label className="checkbox-filter">
              <input
                type="checkbox"
                checked={filters.petFriendly}
                onChange={(e) => handleFilterChange('petFriendly', e.target.checked)}
              />
              <span className="checkmark">🐕</span>
              Pet Friendly
            </label>

            <label className="checkbox-filter">
              <input
                type="checkbox"
                checked={filters.furnished}
                onChange={(e) => handleFilterChange('furnished', e.target.checked)}
              />
              <span className="checkmark">🛋️</span>
              Furnished
            </label>

            <label className="checkbox-filter">
              <input
                type="checkbox"
                checked={filters.parking}
                onChange={(e) => handleFilterChange('parking', e.target.checked)}
              />
              <span className="checkmark">🚗</span>
              Parking
            </label>
          </div>

          {/* Amenities */}
          <div className="amenities-section">
            <label>Amenities</label>
            <div className="amenities-grid">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  <span className="amenity-name">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="sort-section">
            <label>Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="sort-select"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="saved-searches">
          <h4>Saved Searches</h4>
          <div className="saved-searches-list">
            {savedSearches.map((search) => (
              <div key={search.id} className="saved-search-item">
                <div className="search-info">
                  <div className="search-name">{search.name}</div>
                  <div className="search-date">
                    {new Date(search.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="search-actions">
                  <button
                    onClick={() => loadSavedSearch(search)}
                    className="load-search-btn"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteSavedSearch(search.id)}
                    className="delete-search-btn"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default AdvancedSearch;