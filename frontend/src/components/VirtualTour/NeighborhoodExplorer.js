import React, { useState, useEffect, useRef } from 'react';
import './NeighborhoodExplorer.css';

const NeighborhoodExplorer = ({ propertyLocation = null, neighborhoodData = null }) => {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [walkingTime, setWalkingTime] = useState(null);
  const mapRef = useRef(null);

  // Default neighborhood data
  const defaultData = {
    location: propertyLocation || {
      address: "123 Downtown Plaza, City Center",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      neighborhood: "Downtown District",
      walkScore: 95,
      bikeScore: 88,
      transitScore: 92
    },
    overview: {
      description: "A vibrant downtown neighborhood with excellent walkability, diverse dining options, and convenient public transportation. Perfect for professionals and urban enthusiasts.",
      highlights: [
        "Excellent public transportation",
        "Walking distance to major employers",
        "Rich cultural and dining scene",
        "24/7 neighborhood activity",
        "Top-rated schools nearby"
      ],
      demographics: {
        medianAge: 32,
        population: 15420,
        averageIncome: 78500,
        education: "87% college educated"
      }
    },
    pointsOfInterest: {
      dining: [
        {
          id: 1,
          name: "The Urban Bistro",
          category: "Fine Dining",
          rating: 4.8,
          distance: "2 min walk",
          walkingTime: 2,
          description: "Award-winning contemporary cuisine",
          image: "/api/placeholder/200/150",
          coordinates: { lat: 40.7130, lng: -74.0058 }
        },
        {
          id: 2,
          name: "Corner Coffee House",
          category: "Coffee Shop",
          rating: 4.6,
          distance: "1 min walk",
          walkingTime: 1,
          description: "Artisanal coffee and pastries",
          image: "/api/placeholder/200/150",
          coordinates: { lat: 40.7127, lng: -74.0062 }
        },
        {
          id: 3,
          name: "Metro Market",
          category: "Grocery",
          rating: 4.4,
          distance: "3 min walk",
          walkingTime: 3,
          description: "Fresh groceries and organic produce",
          image: "/api/placeholder/200/150",
          coordinates: { lat: 40.7125, lng: -74.0055 }
        }
      ],
      transportation: [
        {
          id: 4,
          name: "Central Station",
          category: "Metro Station",
          rating: 4.5,
          distance: "4 min walk",
          walkingTime: 4,
          description: "Major transit hub with multiple lines",
          image: "/api/placeholder/200/150",
          coordinates: { lat: 40.7135, lng: -74.0065 }
        },
        {
          id: 5,
          name: "City Bus Terminal",
          category: "Bus Stop",
          rating: 4.2,
          distance: "2 min walk",
          walkingTime: 2,
          description: "Multiple bus routes to all city areas",
          image: "/api/placeholder/200/150",
          coordinates: { lat: 40.7132, lng: -74.0063 }
        }
      ],
      entertainment: [
        {
          id: 6,
          name: "Downtown Cinema",
          category: "Movie Theater",
          rating: 4.7,
          distance: "5 min walk",
          walkingTime: 5,
          description: "Latest movies and IMAX experience",
          image: "/api/placeholder/200/150",
          coordinates: { lat: 40.7140, lng: -74.0070 }
        },
        {
          id: 7,
          name: "City Park",
          category: "Park",
          rating: 4.9,
          distance: "6 min walk",
          walkingTime: 6,
          description: "Beautiful green space with walking trails",
          image: "/api/placeholder/200/150",
          coordinates: { lat: 40.7145, lng: -74.0050 }
        },
        {
          id: 8,
          name: "Arts District Gallery",
          category: "Art Gallery",
          rating: 4.6,
          distance: "8 min walk",
          walkingTime: 8,
          description: "Contemporary art exhibitions",
          image: "/api/placeholder/200/150",
          coordinates: { lat: 40.7120, lng: -74.0075 }
        }
      ],
      services: [
        {
          id: 9,
          name: "City Medical Center",
          category: "Hospital",
          rating: 4.5,
          distance: "7 min walk",
          walkingTime: 7,
          description: "Full-service medical facility",
          image: "/api/placeholder/200/150",
          coordinates: { lat: 40.7138, lng: -74.0045 }
        },
        {
          id: 10,
          name: "Downtown Fitness",
          category: "Gym",
          rating: 4.4,
          distance: "3 min walk",
          walkingTime: 3,
          description: "24/7 fitness center with pool",
          image: "/api/placeholder/200/150",
          coordinates: { lat: 40.7131, lng: -74.0068 }
        }
      ]
    }
  };

  const data = neighborhoodData || defaultData;

  const categories = [
    { key: 'overview', label: 'Overview', icon: '🏙️' },
    { key: 'dining', label: 'Dining', icon: '🍽️' },
    { key: 'transportation', label: 'Transport', icon: '🚇' },
    { key: 'entertainment', label: 'Entertainment', icon: '🎭' },
    { key: 'services', label: 'Services', icon: '🏥' }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return '#28a745';
    if (score >= 80) return '#ffc107';
    if (score >= 70) return '#fd7e14';
    return '#dc3545';
  };

  const handlePoiClick = (poi) => {
    setSelectedPoi(poi);
    setWalkingTime(poi.walkingTime);
  };

  const getDirections = (poi) => {
    setShowDirections(true);
    // In a real app, this would integrate with Google Maps or similar
    console.log(`Getting directions to ${poi.name}`);
  };

  const PoiCard = ({ poi, onClick }) => (
    <div className="poi-card" onClick={() => onClick(poi)}>
      <div className="poi-image">
        <img 
          src={poi.image} 
          alt={poi.name}
          onError={(e) => {
            e.target.src = '/api/placeholder/200/150';
          }}
        />
        <div className="poi-category">{poi.category}</div>
      </div>
      
      <div className="poi-content">
        <div className="poi-header">
          <h4>{poi.name}</h4>
          <div className="poi-rating">
            <span className="stars">★</span>
            <span>{poi.rating}</span>
          </div>
        </div>
        
        <p className="poi-description">{poi.description}</p>
        
        <div className="poi-footer">
          <span className="poi-distance">
            🚶‍♂️ {poi.distance}
          </span>
          <button 
            className="directions-btn"
            onClick={(e) => {
              e.stopPropagation();
              getDirections(poi);
            }}
          >
            Directions
          </button>
        </div>
      </div>
    </div>
  );

  const ScoreCard = ({ label, score, icon }) => (
    <div className="score-card">
      <div className="score-icon">{icon}</div>
      <div className="score-content">
        <div className="score-label">{label}</div>
        <div 
          className="score-value"
          style={{ color: getScoreColor(score) }}
        >
          {score}
        </div>
      </div>
    </div>
  );

  return (
    <div className="neighborhood-explorer">
      <div className="explorer-header">
        <div className="location-info">
          <h2>{data.location.neighborhood}</h2>
          <p className="address">{data.location.address}</p>
        </div>
        
        <div className="walkability-scores">
          <ScoreCard 
            label="Walk Score" 
            score={data.location.walkScore} 
            icon="🚶‍♂️"
          />
          <ScoreCard 
            label="Bike Score" 
            score={data.location.bikeScore} 
            icon="🚴‍♂️"
          />
          <ScoreCard 
            label="Transit Score" 
            score={data.location.transitScore} 
            icon="🚇"
          />
        </div>
      </div>

      <div className="explorer-navigation">
        {categories.map(category => {
          const poiCount = category.key === 'overview' 
            ? 0 
            : data.pointsOfInterest[category.key]?.length || 0;
          
          return (
            <button
              key={category.key}
              className={`nav-category ${activeCategory === category.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.key)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
              {poiCount > 0 && (
                <span className="category-count">({poiCount})</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="explorer-content">
        {activeCategory === 'overview' ? (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="overview-main">
                <h3>About the Neighborhood</h3>
                <p className="overview-description">{data.overview.description}</p>
                
                <div className="highlights">
                  <h4>Key Highlights</h4>
                  <ul className="highlights-list">
                    {data.overview.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="demographics-card">
                <h4>Demographics</h4>
                <div className="demo-stats">
                  <div className="stat">
                    <span className="stat-label">Median Age</span>
                    <span className="stat-value">{data.overview.demographics.medianAge}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Population</span>
                    <span className="stat-value">{data.overview.demographics.population.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Avg Income</span>
                    <span className="stat-value">${data.overview.demographics.averageIncome.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Education</span>
                    <span className="stat-value">{data.overview.demographics.education}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="poi-section">
            <div className="section-header">
              <h3>{categories.find(cat => cat.key === activeCategory)?.label} Nearby</h3>
              <p>Discover what's around your new home</p>
            </div>
            
            <div className="poi-grid">
              {data.pointsOfInterest[activeCategory]?.map(poi => (
                <PoiCard 
                  key={poi.id} 
                  poi={poi} 
                  onClick={handlePoiClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected POI Modal */}
      {selectedPoi && (
        <div className="poi-modal-overlay" onClick={() => setSelectedPoi(null)}>
          <div className="poi-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedPoi.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedPoi(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-image">
                <img 
                  src={selectedPoi.image} 
                  alt={selectedPoi.name}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/300';
                  }}
                />
              </div>
              
              <div className="modal-info">
                <div className="poi-details">
                  <span className="poi-category">{selectedPoi.category}</span>
                  <div className="poi-rating">
                    <span className="stars">★</span>
                    <span>{selectedPoi.rating}</span>
                  </div>
                </div>
                
                <p>{selectedPoi.description}</p>
                
                <div className="distance-info">
                  <div className="walk-time">
                    <span className="walk-icon">🚶‍♂️</span>
                    <span>{selectedPoi.walkingTime} min walk</span>
                  </div>
                  <div className="distance">
                    <span>{selectedPoi.distance}</span>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="directions-btn primary"
                    onClick={() => getDirections(selectedPoi)}
                  >
                    Get Directions
                  </button>
                  <button 
                    className="view-on-map-btn"
                    onClick={() => console.log('View on map')}
                  >
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Integration Placeholder */}
      <div className="map-section">
        <div className="map-container" ref={mapRef}>
          <div className="map-placeholder">
            <div className="map-icon">🗺️</div>
            <p>Interactive neighborhood map coming soon</p>
            <small>Explore nearby amenities and calculate walking distances</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodExplorer;