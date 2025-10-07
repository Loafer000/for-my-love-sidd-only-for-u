import React, { useState, useCallback } from 'react';
import AdvancedSearch from '../components/Search/AdvancedSearch';
import SmartSearchResults from '../components/Search/SmartSearchResults';
import { FavoritesList } from '../components/Favorites/PropertyFavorites';
import './SmartSearchPage.css';

const SmartSearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});
  const [activeTab, setActiveTab] = useState('search');

  // Sample data for demonstration
  const sampleResults = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      price: 2400,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      location: 'Downtown Seattle',
      type: 'apartment',
      petFriendly: true,
      furnished: false,
      amenities: ['Swimming Pool', 'Gym/Fitness Center', 'Parking', 'Balcony/Patio'],
      image: '/api/placeholder/400/300',
      rating: 4.5,
      distance: 2.3,
      featured: true,
      verified: true,
      createdAt: '2024-10-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Cozy Suburban House',
      price: 3200,
      bedrooms: 3,
      bathrooms: 2.5,
      area: 1800,
      location: 'Bellevue Suburbs',
      type: 'house',
      petFriendly: true,
      furnished: true,
      amenities: ['Garden/Yard', 'Parking', 'Fireplace', 'In-unit Laundry'],
      image: '/api/placeholder/400/300',
      rating: 4.2,
      distance: 5.1,
      verified: true,
      createdAt: '2024-09-28T00:00:00Z'
    },
    {
      id: 3,
      title: 'Luxury City Condo',
      price: 1800,
      bedrooms: 1,
      bathrooms: 1,
      area: 800,
      location: 'Capitol Hill',
      type: 'condo',
      petFriendly: false,
      furnished: false,
      amenities: ['Concierge', 'Rooftop Access', 'Elevator', 'Gym/Fitness Center'],
      image: '/api/placeholder/400/300',
      rating: 4.7,
      distance: 1.2,
      featured: true,
      verified: true,
      createdAt: '2024-10-02T00:00:00Z'
    },
    {
      id: 4,
      title: 'Student-Friendly Studio',
      price: 1200,
      bedrooms: 0,
      bathrooms: 1,
      area: 500,
      location: 'University District',
      type: 'studio',
      petFriendly: false,
      furnished: true,
      amenities: ['WiFi Included', 'Study Lounge', 'Laundry Facility'],
      image: '/api/placeholder/400/300',
      rating: 4.0,
      distance: 3.8,
      verified: true,
      createdAt: '2024-09-30T00:00:00Z'
    },
    {
      id: 5,
      title: 'Waterfront Townhouse',
      price: 4500,
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      location: 'Queen Anne',
      type: 'townhouse',
      petFriendly: true,
      furnished: false,
      amenities: ['Water View', 'Private Deck', 'Parking', 'Fireplace', 'Storage Unit'],
      image: '/api/placeholder/400/300',
      rating: 4.8,
      distance: 2.9,
      featured: true,
      verified: true,
      createdAt: '2024-10-03T00:00:00Z'
    },
    {
      id: 6,
      title: 'Affordable Family Home',
      price: 2800,
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      location: 'Greenwood',
      type: 'house',
      petFriendly: true,
      furnished: false,
      amenities: ['Backyard', 'Garage', 'School District', 'Playground Nearby'],
      image: '/api/placeholder/400/300',
      rating: 4.1,
      distance: 6.2,
      verified: true,
      createdAt: '2024-09-25T00:00:00Z'
    }
  ];

  const handleSearchResults = useCallback((results) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setSearchResults(results);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleFiltersChange = useCallback((filters) => {
    setCurrentFilters(filters);
  }, []);

  // Initialize with sample data on first load
  React.useEffect(() => {
    handleSearchResults(sampleResults);
  }, [handleSearchResults]);

  const getTabContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="search-tab-content">
            <AdvancedSearch 
              onSearchResults={handleSearchResults}
              onFiltersChange={handleFiltersChange}
            />
            <SmartSearchResults
              searchResults={searchResults}
              isLoading={isLoading}
              searchQuery={searchQuery}
              filters={currentFilters}
            />
          </div>
        );
      case 'favorites':
        return <FavoritesList />;
      default:
        return null;
    }
  };

  return (
    <div className="smart-search-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Find Your Perfect Property</h1>
          <p>Advanced search with smart filtering and personalized recommendations</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-number">{searchResults.length}+</div>
            <div className="stat-label">Properties</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Locations</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </div>

      <div className="page-navigation">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <span className="tab-icon">🔍</span>
            <span>Smart Search</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <span className="tab-icon">❤️</span>
            <span>My Favorites</span>
          </button>
        </div>
      </div>

      <div className="page-content">
        {getTabContent()}
      </div>

      {/* Quick Tips */}
      <div className="search-tips">
        <h3>Search Tips</h3>
        <div className="tips-grid">
          <div className="tip-item">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <strong>Use specific keywords</strong>
              <p>Try "pet-friendly downtown apartment" for better results</p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">🎯</div>
            <div className="tip-content">
              <strong>Save your searches</strong>
              <p>Get notified when new properties match your criteria</p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">❤️</div>
            <div className="tip-content">
              <strong>Heart your favorites</strong>
              <p>Build a collection of properties you love</p>
            </div>
          </div>
          <div className="tip-item">
            <div className="tip-icon">📱</div>
            <div className="tip-content">
              <strong>Mobile optimized</strong>
              <p>Search on-the-go with our responsive design</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSearchPage;