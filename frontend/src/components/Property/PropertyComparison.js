import React, { useState, useEffect } from 'react';
import './PropertyComparison.css';

const PropertyComparison = ({ properties = [] }) => {
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  const sampleProperties = [
    {
      id: 1,
      title: 'Downtown Apartment',
      price: 2400,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      location: 'Downtown',
      amenities: ['Gym', 'Pool', 'Parking', 'Balcony'],
      rating: 4.5,
      yearBuilt: 2018,
      petFriendly: true,
      furnished: false
    },
    {
      id: 2,
      title: 'Suburban House',
      price: 3200,
      bedrooms: 3,
      bathrooms: 2.5,
      area: 1800,
      location: 'Suburbs',
      amenities: ['Garden', 'Garage', 'Fireplace'],
      rating: 4.2,
      yearBuilt: 2015,
      petFriendly: true,
      furnished: true
    },
    {
      id: 3,
      title: 'City Condo',
      price: 1800,
      bedrooms: 1,
      bathrooms: 1,
      area: 800,
      location: 'City Center',
      amenities: ['Gym', 'Concierge', 'Rooftop'],
      rating: 4.0,
      yearBuilt: 2020,
      petFriendly: false,
      furnished: false
    }
  ];

  useEffect(() => {
    setComparisonData(properties.length > 0 ? properties : sampleProperties);
  }, [properties]);

  const handlePropertySelect = (property) => {
    if (selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties(selectedProperties.filter(p => p.id !== property.id));
    } else if (selectedProperties.length < 3) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const getComparisonFeatures = () => [
    { key: 'price', label: 'Monthly Rent', format: (val) => `$${val.toLocaleString()}` },
    { key: 'bedrooms', label: 'Bedrooms', format: (val) => val },
    { key: 'bathrooms', label: 'Bathrooms', format: (val) => val },
    { key: 'area', label: 'Area (sq ft)', format: (val) => val.toLocaleString() },
    { key: 'location', label: 'Location', format: (val) => val },
    { key: 'rating', label: 'Rating', format: (val) => `${val}/5 ⭐` },
    { key: 'yearBuilt', label: 'Year Built', format: (val) => val },
    { key: 'petFriendly', label: 'Pet Friendly', format: (val) => val ? '✅ Yes' : '❌ No' },
    { key: 'furnished', label: 'Furnished', format: (val) => val ? '✅ Yes' : '❌ No' }
  ];

  const getBestValue = (feature, properties) => {
    if (properties.length === 0) return null;
    
    switch (feature) {
      case 'price':
        return Math.min(...properties.map(p => p.price));
      case 'area':
        return Math.max(...properties.map(p => p.area));
      case 'rating':
        return Math.max(...properties.map(p => p.rating));
      case 'yearBuilt':
        return Math.max(...properties.map(p => p.yearBuilt));
      default:
        return null;
    }
  };

  const isHighlighted = (property, feature, bestValue) => {
    if (!bestValue) return false;
    return property[feature] === bestValue;
  };

  return (
    <div className="property-comparison">
      <div className="comparison-header">
        <h2>Compare Properties</h2>
        <p>Select up to 3 properties to compare side by side</p>
      </div>

      {/* Property Selection */}
      <div className="property-selection">
        <h3>Available Properties</h3>
        <div className="property-cards">
          {comparisonData.map((property) => (
            <div
              key={property.id}
              className={`property-card ${selectedProperties.find(p => p.id === property.id) ? 'selected' : ''}`}
              onClick={() => handlePropertySelect(property)}
            >
              <div className="property-image">
                <div className="image-placeholder">🏠</div>
              </div>
              <div className="property-info">
                <h4>{property.title}</h4>
                <div className="property-price">${property.price}/month</div>
                <div className="property-details">
                  {property.bedrooms}BR • {property.bathrooms}BA • {property.area}sq ft
                </div>
              </div>
              <div className="selection-indicator">
                {selectedProperties.find(p => p.id === property.id) ? '✓' : '+'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedProperties.length > 0 && (
        <div className="comparison-table-container">
          <h3>Property Comparison</h3>
          <div className="comparison-table">
            <div className="comparison-row header-row">
              <div className="feature-label">Features</div>
              {selectedProperties.map((property) => (
                <div key={property.id} className="property-column">
                  <div className="property-header">
                    <h4>{property.title}</h4>
                    <div className="property-price">${property.price}/month</div>
                  </div>
                </div>
              ))}
            </div>

            {getComparisonFeatures().map((feature) => {
              const bestValue = getBestValue(feature.key, selectedProperties);
              return (
                <div key={feature.key} className="comparison-row">
                  <div className="feature-label">{feature.label}</div>
                  {selectedProperties.map((property) => (
                    <div
                      key={property.id}
                      className={`feature-value ${isHighlighted(property, feature.key, bestValue) ? 'highlighted' : ''}`}
                    >
                      {feature.format(property[feature.key])}
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Amenities Comparison */}
            <div className="comparison-row">
              <div className="feature-label">Amenities</div>
              {selectedProperties.map((property) => (
                <div key={property.id} className="feature-value amenities-list">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="comparison-summary">
            <h4>Comparison Insights</h4>
            <div className="insights">
              {selectedProperties.length >= 2 && (
                <>
                  <div className="insight">
                    <span className="insight-icon">💰</span>
                    <span>Most affordable: {selectedProperties.reduce((min, p) => p.price < min.price ? p : min).title}</span>
                  </div>
                  <div className="insight">
                    <span className="insight-icon">📏</span>
                    <span>Largest space: {selectedProperties.reduce((max, p) => p.area > max.area ? p : max).title}</span>
                  </div>
                  <div className="insight">
                    <span className="insight-icon">⭐</span>
                    <span>Highest rated: {selectedProperties.reduce((max, p) => p.rating > max.rating ? p : max).title}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyComparison;