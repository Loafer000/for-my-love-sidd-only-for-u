import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './PropertyFavorites.css';

const PropertyFavorites = ({ property, size = 'medium' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesList, setFavoritesList] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const { user } = useAuth();

  // Load favorites from localStorage
  useEffect(() => {
    if (user) {
      const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      setFavoritesList(savedFavorites);
      
      if (property) {
        setIsFavorite(savedFavorites.some(fav => fav.id === property.id));
      }
    }
  }, [user, property]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Show login prompt or redirect to login
      alert('Please log in to save favorites');
      return;
    }

    if (!property) return;

    const updatedFavorites = isFavorite
      ? favoritesList.filter(fav => fav.id !== property.id)
      : [...favoritesList, { ...property, favoriteDate: new Date().toISOString() }];

    setFavoritesList(updatedFavorites);
    setIsFavorite(!isFavorite);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));

    // Show temporary tooltip
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'favorite-btn-small';
      case 'large': return 'favorite-btn-large';
      default: return 'favorite-btn-medium';
    }
  };

  if (!property) return null;

  return (
    <div className="property-favorite">
      <button
        className={`favorite-btn ${getSizeClass()} ${isFavorite ? 'favorite' : 'not-favorite'}`}
        onClick={toggleFavorite}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <span className="heart-icon">
          {isFavorite ? '❤️' : '🤍'}
        </span>
      </button>
      
      {showTooltip && (
        <div className={`favorite-tooltip ${isFavorite ? 'added' : 'removed'}`}>
          {isFavorite ? 'Added to favorites!' : 'Removed from favorites'}
        </div>
      )}
    </div>
  );
};

// Favorites List Component
export const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      setFavorites(savedFavorites);
    }
  }, [user]);

  const removeFavorite = (propertyId) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== propertyId);
    setFavorites(updatedFavorites);
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
    }
  };

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      setFavorites([]);
      if (user) {
        localStorage.removeItem(`favorites_${user.id}`);
      }
    }
  };

  const getSortedFavorites = () => {
    const sorted = [...favorites];
    
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.favoriteDate) - new Date(a.favoriteDate));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const exportFavorites = () => {
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `favorites_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const shareFavorites = () => {
    if (navigator.share && favorites.length > 0) {
      navigator.share({
        title: 'My Favorite Properties',
        text: `Check out my ${favorites.length} favorite properties on ConnectSpace`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      const shareText = `My Favorite Properties:\n${favorites.map(fav => 
        `${fav.title} - $${fav.price}/month`
      ).join('\n')}`;
      navigator.clipboard.writeText(shareText);
      alert('Favorites list copied to clipboard!');
    }
  };

  if (!user) {
    return (
      <div className="favorites-login-prompt">
        <div className="login-prompt-content">
          <h3>Save Your Favorite Properties</h3>
          <p>Log in to save properties you love and access them anytime.</p>
          <button className="login-btn">Log In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-list">
      <div className="favorites-header">
        <div className="header-left">
          <h2>My Favorites ({favorites.length})</h2>
          <p>Properties you've saved for later</p>
        </div>
        
        <div className="header-actions">
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
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Recently Added</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
          
          {favorites.length > 0 && (
            <>
              <button onClick={exportFavorites} className="export-btn">
                📥 Export
              </button>
              <button onClick={shareFavorites} className="share-btn">
                📤 Share
              </button>
              <button onClick={clearAllFavorites} className="clear-btn">
                🗑️ Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">❤️</div>
          <h3>No favorites yet</h3>
          <p>Start exploring properties and click the heart icon to save your favorites!</p>
          <button className="browse-btn">Browse Properties</button>
        </div>
      ) : (
        <div className={`favorites-grid ${viewMode}`}>
          {getSortedFavorites().map((property) => (
            <div key={property.id} className="favorite-property-card">
              <div className="property-image">
                <img 
                  src={property.image || '/api/placeholder/300/200'} 
                  alt={property.title}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/300/200';
                  }}
                />
                <div className="favorite-date">
                  Saved {new Date(property.favoriteDate).toLocaleDateString()}
                </div>
                <button
                  className="remove-favorite"
                  onClick={() => removeFavorite(property.id)}
                  title="Remove from favorites"
                >
                  ×
                </button>
              </div>
              
              <div className="property-details">
                <h3 className="property-title">{property.title}</h3>
                <div className="property-price">${property.price?.toLocaleString()}/month</div>
                <div className="property-info">
                  {property.bedrooms && `${property.bedrooms} bed`}
                  {property.bathrooms && ` • ${property.bathrooms} bath`}
                  {property.area && ` • ${property.area} sq ft`}
                </div>
                <div className="property-location">{property.location}</div>
                
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
              </div>
              
              <div className="property-actions">
                <button className="contact-btn">Contact</button>
                <button className="view-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyFavorites;