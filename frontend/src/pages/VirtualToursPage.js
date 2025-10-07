import React, { useState } from 'react';
import VirtualTour from '../components/VirtualTour/VirtualTour';
import MediaGallery from '../components/VirtualTour/MediaGallery';
import NeighborhoodExplorer from '../components/VirtualTour/NeighborhoodExplorer';
import './VirtualToursPage.css';

const VirtualToursPage = () => {
  const [activeTab, setActiveTab] = useState('virtual-tour');
  const [propertyId] = useState(1);

  // Sample property data for the demo
  const propertyData = {
    id: 1,
    title: "Luxury Downtown Apartment",
    address: "123 Downtown Plaza, City Center",
    price: "$2,800/month",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600"
    ]
  };

  const tabs = [
    {
      id: 'virtual-tour',
      label: '360° Virtual Tour',
      icon: '🔄',
      description: 'Immersive room-by-room exploration'
    },
    {
      id: 'media-gallery',
      label: 'Media Gallery',
      icon: '🖼️',
      description: 'Photos, videos & property media'
    },
    {
      id: 'neighborhood',
      label: 'Neighborhood Explorer',
      icon: '🏙️',
      description: 'Discover local amenities & walkability'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'virtual-tour':
        return <VirtualTour propertyId={propertyId} />;
      case 'media-gallery':
        return <MediaGallery propertyId={propertyId} />;
      case 'neighborhood':
        return <NeighborhoodExplorer propertyLocation={propertyData} />;
      default:
        return <VirtualTour propertyId={propertyId} />;
    }
  };

  return (
    <div className="virtual-tours-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="property-summary">
            <h1>{propertyData.title}</h1>
            <p className="property-address">📍 {propertyData.address}</p>
            <div className="property-details">
              <span className="price">{propertyData.price}</span>
              <span className="separator">•</span>
              <span className="specs">
                {propertyData.bedrooms} bed • {propertyData.bathrooms} bath • {propertyData.sqft} sqft
              </span>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="action-btn primary">
              📞 Schedule Tour
            </button>
            <button className="action-btn secondary">
              💾 Save Property
            </button>
            <button className="action-btn secondary">
              📤 Share
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tour-navigation">
        <div className="nav-container">
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <div className="tab-content">
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-description">{tab.description}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="nav-indicator">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="tour-content">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="feature-highlights">
        <div className="highlights-container">
          <h2>Week 2: Virtual Tours & Enhanced Media</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>360° Virtual Tours</h3>
              <p>Immersive room-by-room exploration with interactive hotspots and detailed property walkthroughs</p>
              <ul className="feature-list">
                <li>Interactive hotspots with information</li>
                <li>Room navigation and floor plans</li>
                <li>Audio narration and fullscreen mode</li>
                <li>Tour progress tracking</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🖼️</div>
              <h3>Enhanced Media Gallery</h3>
              <p>Professional media management with multiple viewing modes and advanced organization features</p>
              <ul className="feature-list">
                <li>Grid, masonry & slideshow modes</li>
                <li>Category filtering and tagging</li>
                <li>Lightbox with zoom controls</li>
                <li>Video integration and playback</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏙️</div>
              <h3>Neighborhood Explorer</h3>
              <p>Comprehensive neighborhood insights with walkability scores and local amenities discovery</p>
              <ul className="feature-list">
                <li>Walk/bike/transit score integration</li>
                <li>Points of interest categorization</li>
                <li>Walking distance calculations</li>
                <li>Demographics and area insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Status */}
      <div className="implementation-status">
        <div className="status-container">
          <h3>Implementation Progress</h3>
          <div className="status-grid">
            <div className="status-item completed">
              <div className="status-indicator">✅</div>
              <div className="status-content">
                <h4>Virtual Tour Component</h4>
                <p>Complete with 360° views, hotspots, and navigation</p>
              </div>
            </div>
            
            <div className="status-item completed">
              <div className="status-indicator">✅</div>
              <div className="status-content">
                <h4>Media Gallery System</h4>
                <p>Multi-view gallery with lightbox and video support</p>
              </div>
            </div>
            
            <div className="status-item completed">
              <div className="status-indicator">✅</div>
              <div className="status-content">
                <h4>Neighborhood Explorer</h4>
                <p>POI discovery with walkability and demographics</p>
              </div>
            </div>
            
            <div className="status-item next">
              <div className="status-indicator">📋</div>
              <div className="status-content">
                <h4>Integration & Testing</h4>
                <p>Next: Connect with property listings and mobile optimization</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Explore?</h2>
          <p>Experience the future of property viewing with our advanced virtual tour technology</p>
          <div className="cta-buttons">
            <button className="cta-btn primary">
              Start Virtual Tour
            </button>
            <button className="cta-btn secondary">
              Schedule Live Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualToursPage;