import React, { useState, useRef, useEffect } from 'react';
import './MediaGallery.css';

const MediaGallery = ({ propertyId, mediaData = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  // Sample media data
  const defaultMediaData = {
    id: propertyId || 1,
    title: 'Modern Downtown Apartment Gallery',
    media: [
      {
        id: 1,
        type: 'image',
        category: 'exterior',
        url: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/200/150',
        title: 'Building Exterior',
        description: 'Modern glass facade with city views',
        tags: ['exterior', 'building', 'architecture']
      },
      {
        id: 2,
        type: 'image',
        category: 'living',
        url: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/200/150',
        title: 'Living Room',
        description: 'Spacious living area with modern furnishing',
        tags: ['interior', 'living room', 'furniture']
      },
      {
        id: 3,
        type: 'video',
        category: 'tour',
        url: '/api/placeholder/video/tour.mp4',
        thumbnail: '/api/placeholder/200/150',
        title: 'Property Tour',
        description: 'Complete walkthrough of the property',
        duration: '3:45',
        tags: ['tour', 'walkthrough', 'video']
      },
      {
        id: 4,
        type: 'image',
        category: 'kitchen',
        url: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/200/150',
        title: 'Modern Kitchen',
        description: 'Fully equipped kitchen with premium appliances',
        tags: ['interior', 'kitchen', 'appliances']
      },
      {
        id: 5,
        type: 'image',
        category: 'bedroom',
        url: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/200/150',
        title: 'Master Bedroom',
        description: 'Comfortable bedroom with city views',
        tags: ['interior', 'bedroom', 'views']
      },
      {
        id: 6,
        type: 'image',
        category: 'bathroom',
        url: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/200/150',
        title: 'Luxury Bathroom',
        description: 'Spa-like bathroom with marble finishes',
        tags: ['interior', 'bathroom', 'luxury']
      },
      {
        id: 7,
        type: 'video',
        category: 'amenities',
        url: '/api/placeholder/video/amenities.mp4',
        thumbnail: '/api/placeholder/200/150',
        title: 'Building Amenities',
        description: 'Explore the building facilities',
        duration: '2:20',
        tags: ['amenities', 'facilities', 'building']
      },
      {
        id: 8,
        type: 'image',
        category: 'amenities',
        url: '/api/placeholder/800/600',
        thumbnail: '/api/placeholder/200/150',
        title: 'Rooftop Pool',
        description: 'Stunning rooftop pool with city skyline',
        tags: ['amenities', 'pool', 'rooftop']
      }
    ]
  };

  const gallery = mediaData || defaultMediaData;

  const categories = [
    { key: 'all', label: 'All Media', icon: '🏠' },
    { key: 'exterior', label: 'Exterior', icon: '🏢' },
    { key: 'living', label: 'Living Areas', icon: '🛋️' },
    { key: 'kitchen', label: 'Kitchen', icon: '🍽️' },
    { key: 'bedroom', label: 'Bedrooms', icon: '🛏️' },
    { key: 'bathroom', label: 'Bathrooms', icon: '🚿' },
    { key: 'amenities', label: 'Amenities', icon: '🏊‍♂️' },
    { key: 'tour', label: 'Tours', icon: '🎥' }
  ];

  const getFilteredMedia = () => {
    if (selectedCategory === 'all') {
      return gallery.media;
    }
    return gallery.media.filter(item => item.category === selectedCategory);
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const navigateMedia = (direction) => {
    const filteredMedia = getFilteredMedia();
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredMedia.length
      : (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
    setCurrentIndex(newIndex);
    setZoomLevel(1);
  };

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.max(1, Math.min(3, prev + delta)));
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const MediaItem = ({ item, index, onClick }) => (
    <div 
      className={`media-item ${item.type}`}
      onClick={() => onClick(index)}
    >
      <div className="media-thumbnail">
        <img 
          src={item.thumbnail}
          alt={item.title}
          onError={(e) => {
            e.target.src = '/api/placeholder/200/150';
          }}
        />
        
        {item.type === 'video' && (
          <div className="video-overlay">
            <div className="play-button">▶</div>
            <div className="video-duration">{item.duration}</div>
          </div>
        )}
        
        <div className="media-overlay">
          <div className="media-info">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredMedia = getFilteredMedia();
  const currentItem = filteredMedia[currentIndex];

  return (
    <div className="media-gallery">
      <div className="gallery-header">
        <div className="gallery-title">
          <h2>{gallery.title}</h2>
          <span className="media-count">{filteredMedia.length} items</span>
        </div>
        
        <div className="gallery-controls">
          <div className="view-modes">
            <button
              className={`view-mode ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </button>
            <button
              className={`view-mode ${viewMode === 'masonry' ? 'active' : ''}`}
              onClick={() => setViewMode('masonry')}
            >
              ⊟ Masonry
            </button>
            <button
              className={`view-mode ${viewMode === 'slideshow' ? 'active' : ''}`}
              onClick={() => setViewMode('slideshow')}
            >
              ⊡ Slideshow
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filters">
        {categories.map(category => {
          const count = category.key === 'all' 
            ? gallery.media.length 
            : gallery.media.filter(item => item.category === category.key).length;
          
          if (count === 0 && category.key !== 'all') return null;
          
          return (
            <button
              key={category.key}
              className={`category-filter ${selectedCategory === category.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.key)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
              <span className="category-count">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Gallery Content */}
      <div className="gallery-content">
        {viewMode === 'slideshow' ? (
          <div className="slideshow-mode">
            <div className="slideshow-main">
              {currentItem?.type === 'image' ? (
                <img
                  src={currentItem.url}
                  alt={currentItem.title}
                  className="slideshow-image"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/800/600';
                  }}
                />
              ) : (
                <video
                  ref={videoRef}
                  className="slideshow-video"
                  controls
                  poster={currentItem?.thumbnail}
                >
                  <source src={currentItem?.url} type="video/mp4" />
                </video>
              )}
              
              <button 
                className="nav-button prev"
                onClick={() => navigateMedia('prev')}
              >
                ‹
              </button>
              <button 
                className="nav-button next"
                onClick={() => navigateMedia('next')}
              >
                ›
              </button>
            </div>
            
            <div className="slideshow-info">
              <h3>{currentItem?.title}</h3>
              <p>{currentItem?.description}</p>
              <div className="slideshow-tags">
                {currentItem?.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="slideshow-thumbnails">
              {filteredMedia.map((item, index) => (
                <button
                  key={item.id}
                  className={`thumbnail-nav ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img src={item.thumbnail} alt={item.title} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`gallery-grid ${viewMode}`}>
            {filteredMedia.map((item, index) => (
              <MediaItem
                key={item.id}
                item={item}
                index={index}
                onClick={openLightbox}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <div className="lightbox-header">
              <div className="lightbox-title">
                <h3>{currentItem?.title}</h3>
                <span className="lightbox-counter">
                  {currentIndex + 1} of {filteredMedia.length}
                </span>
              </div>
              
              <div className="lightbox-controls">
                {currentItem?.type === 'image' && (
                  <>
                    <button 
                      className="zoom-btn"
                      onClick={() => handleZoom(-0.5)}
                    >
                      🔍-
                    </button>
                    <button 
                      className="zoom-btn"
                      onClick={() => handleZoom(0.5)}
                    >
                      🔍+
                    </button>
                  </>
                )}
                <button className="close-btn" onClick={closeLightbox}>
                  ×
                </button>
              </div>
            </div>
            
            <div className="lightbox-media">
              {currentItem?.type === 'image' ? (
                <img
                  ref={imageRef}
                  src={currentItem.url}
                  alt={currentItem.title}
                  style={{ transform: `scale(${zoomLevel})` }}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/800/600';
                  }}
                />
              ) : (
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  poster={currentItem?.thumbnail}
                >
                  <source src={currentItem?.url} type="video/mp4" />
                </video>
              )}
              
              <button 
                className="lightbox-nav prev"
                onClick={() => navigateMedia('prev')}
              >
                ‹
              </button>
              <button 
                className="lightbox-nav next"
                onClick={() => navigateMedia('next')}
              >
                ›
              </button>
            </div>
            
            <div className="lightbox-footer">
              <p>{currentItem?.description}</p>
              <div className="media-tags">
                {currentItem?.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;