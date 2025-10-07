import React, { useState, useEffect } from 'react';
import PropertyFavorites from '../Favorites/PropertyFavorites';
import './SmartSearchResults.css';

const SmartSearchResults = ({ searchResults = [], isLoading = false, searchQuery = '', filters = {} }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(12);
  const [showMap, setShowMap] = useState(false);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const getSortedResults = () => {
    const sorted = [...searchResults];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'distance':
        return sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
      case 'relevance':
      default:
        return sorted; // Assume backend returns results by relevance
    }
  };

  const getPaginatedResults = () => {
    const sorted = getSortedResults();
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return sorted.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(searchResults.length / resultsPerPage);
  };

  const getResultsStats = () => {
    if (searchResults.length === 0) return null;
    
    const prices = searchResults.map(r => r.price).filter(Boolean);
    const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    
    return { avgPrice, minPrice, maxPrice };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const highlightSearchTerm = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="search-highlight">{part}</span> : 
        part
    );
  };

  const PropertyCard = ({ property }) => (
    <div className="property-card">
      <div className="property-image-container">
        <img 
          src={property.image || '/api/placeholder/300/200'} 
          alt={property.title}
          className="property-image"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200';
          }}
        />
        <div className="property-badges">
          {property.featured && <span className="badge featured">Featured</span>}
          {property.verified && <span className="badge verified">✓ Verified</span>}
        </div>
        <PropertyFavorites property={property} size="medium" />
      </div>
      
      <div className="property-content">
        <div className="property-header">
          <h3 className="property-title">
            {highlightSearchTerm(property.title, searchQuery)}
          </h3>
          {property.rating && (
            <div className="property-rating">
              <span className="stars">⭐</span>
              <span>{property.rating}</span>
            </div>
          )}
        </div>
        
        <div className="property-price">
          {formatPrice(property.price)}<span className="price-period">/month</span>
        </div>
        
        <div className="property-details">
          <div className="detail-item">
            <span className="icon">🛏️</span>
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="detail-item">
            <span className="icon">🚿</span>
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="detail-item">
            <span className="icon">📐</span>
            <span>{property.area} sq ft</span>
          </div>
        </div>
        
        <div className="property-location">
          <span className="icon">📍</span>
          <span>{highlightSearchTerm(property.location, searchQuery)}</span>
          {property.distance && (
            <span className="distance">({property.distance} mi away)</span>
          )}
        </div>
        
        {property.amenities && property.amenities.length > 0 && (
          <div className="property-amenities">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="amenity-tag">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="more-amenities">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="property-actions">
          <button className="contact-btn">Contact</button>
          <button className="view-details-btn">View Details</button>
        </div>
      </div>
    </div>
  );

  const stats = getResultsStats();

  if (isLoading) {
    return (
      <div className="search-results-loading">
        <div className="loading-spinner"></div>
        <p>Finding perfect properties for you...</p>
      </div>
    );
  }

  return (
    <div className="smart-search-results">
      {/* Results Header */}
      <div className="results-header">
        <div className="results-info">
          <h2>
            {searchResults.length} {searchResults.length === 1 ? 'Property' : 'Properties'} Found
            {searchQuery && <span className="search-query"> for "{searchQuery}"</span>}
          </h2>
          
          {stats && (
            <div className="results-stats">
              <span className="stat">
                Avg: {formatPrice(stats.avgPrice)}
              </span>
              <span className="stat">
                Range: {formatPrice(stats.minPrice)} - {formatPrice(stats.maxPrice)}
              </span>
            </div>
          )}
        </div>
        
        <div className="results-controls">
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰ List
            </button>
            <button
              className={`view-btn ${showMap ? 'active' : ''}`}
              onClick={() => setShowMap(!showMap)}
            >
              🗺️ Map
            </button>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="relevance">Most Relevant</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="distance">Nearest First</option>
            <option value="newest">Newest Listed</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.priceRange?.min || filters.priceRange?.max || filters.bedrooms || 
        filters.propertyType || filters.amenities?.length > 0) && (
        <div className="active-filters">
          <span className="filters-label">Active filters:</span>
          <div className="filter-tags">
            {filters.priceRange?.min && (
              <span className="filter-tag">
                Min: {formatPrice(filters.priceRange.min)} ×
              </span>
            )}
            {filters.priceRange?.max && (
              <span className="filter-tag">
                Max: {formatPrice(filters.priceRange.max)} ×
              </span>
            )}
            {filters.bedrooms && (
              <span className="filter-tag">
                {filters.bedrooms}+ bedrooms ×
              </span>
            )}
            {filters.propertyType && (
              <span className="filter-tag">
                {filters.propertyType} ×
              </span>
            )}
            {filters.amenities?.map((amenity, index) => (
              <span key={index} className="filter-tag">
                {amenity} ×
              </span>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No properties found</h3>
          <p>Try adjusting your search criteria or filters to find more properties.</p>
          <div className="suggestions">
            <h4>Suggestions:</h4>
            <ul>
              <li>Broaden your price range</li>
              <li>Try different locations nearby</li>
              <li>Remove some filters</li>
              <li>Consider different property types</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          {/* Results Grid/List */}
          <div className={`results-container ${viewMode}`}>
            {getPaginatedResults().map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {getTotalPages() > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                « Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))}
                disabled={currentPage === getTotalPages()}
              >
                Next »
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="results-summary">
            Showing {((currentPage - 1) * resultsPerPage) + 1} - {Math.min(currentPage * resultsPerPage, searchResults.length)} of {searchResults.length} properties
          </div>
        </>
      )}
    </div>
  );
};

export default SmartSearchResults;