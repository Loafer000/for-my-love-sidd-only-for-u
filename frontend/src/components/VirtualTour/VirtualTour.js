import React, { useState, useEffect, useRef } from 'react';
import './VirtualTour.css';

const VirtualTour = ({ propertyId, tourData = null }) => {
  const [currentView, setCurrentView] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tourType, setTourType] = useState('360');
  const [showHotspots, setShowHotspots] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const tourContainerRef = useRef(null);
  const audioRef = useRef(null);

  // Sample tour data
  const defaultTourData = {
    id: propertyId || 1,
    title: 'Modern Downtown Apartment Tour',
    rooms: [
      {
        id: 1,
        name: 'Living Room',
        image360: '/api/placeholder/800/400',
        description: 'Spacious living area with modern furnishing and city views',
        hotspots: [
          { x: 30, y: 60, label: 'Premium Sound System', info: 'Bose surround sound system included' },
          { x: 70, y: 40, label: 'Smart TV', info: '55" 4K Smart TV with streaming services' },
          { x: 50, y: 80, label: 'Designer Furniture', info: 'Contemporary furniture package available' }
        ]
      },
      {
        id: 2,
        name: 'Kitchen',
        image360: '/api/placeholder/800/400',
        description: 'Fully equipped modern kitchen with stainless steel appliances',
        hotspots: [
          { x: 20, y: 50, label: 'Refrigerator', info: 'Energy-efficient stainless steel refrigerator' },
          { x: 60, y: 30, label: 'Granite Countertops', info: 'Premium granite countertops with breakfast bar' },
          { x: 80, y: 70, label: 'Dishwasher', info: 'Quiet operation dishwasher included' }
        ]
      },
      {
        id: 3,
        name: 'Bedroom',
        image360: '/api/placeholder/800/400',
        description: 'Master bedroom with walk-in closet and en-suite bathroom',
        hotspots: [
          { x: 25, y: 45, label: 'Walk-in Closet', info: 'Spacious walk-in closet with built-in organizers' },
          { x: 75, y: 35, label: 'City View', info: 'Panoramic city skyline views' },
          { x: 50, y: 85, label: 'Hardwood Floors', info: 'Premium hardwood flooring throughout' }
        ]
      },
      {
        id: 4,
        name: 'Bathroom',
        image360: '/api/placeholder/800/400',
        description: 'Luxury bathroom with marble finishes and modern fixtures',
        hotspots: [
          { x: 40, y: 30, label: 'Rainfall Shower', info: 'Luxury rainfall shower head with body jets' },
          { x: 70, y: 60, label: 'Marble Vanity', info: 'Double vanity with marble countertop' },
          { x: 20, y: 80, label: 'Heated Floors', info: 'Radiant floor heating system' }
        ]
      }
    ],
    videoTour: '/api/placeholder/video/tour.mp4',
    floorPlan: '/api/placeholder/600/400',
    audioNarration: '/api/placeholder/audio/narration.mp3'
  };

  const tourInfo = tourData || defaultTourData;

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRoomChange = (roomIndex) => {
    setCurrentView(roomIndex);
    setIsLoading(true);
    
    // Simulate room loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (tourContainerRef.current.requestFullscreen) {
        tourContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const currentRoom = tourInfo.rooms[currentView];

  const TourControls = () => (
    <div className="tour-controls">
      <div className="control-group">
        <button
          className={`control-btn ${tourType === '360' ? 'active' : ''}`}
          onClick={() => setTourType('360')}
        >
          🏠 360° Tour
        </button>
        <button
          className={`control-btn ${tourType === 'video' ? 'active' : ''}`}
          onClick={() => setTourType('video')}
        >
          🎥 Video Tour
        </button>
        <button
          className={`control-btn ${tourType === 'floor' ? 'active' : ''}`}
          onClick={() => setTourType('floor')}
        >
          📋 Floor Plan
        </button>
      </div>
      
      <div className="control-group">
        <button
          className={`control-btn ${showHotspots ? 'active' : ''}`}
          onClick={() => setShowHotspots(!showHotspots)}
        >
          📍 Hotspots
        </button>
        <button
          className={`control-btn ${audioEnabled ? 'active' : ''}`}
          onClick={toggleAudio}
        >
          {audioEnabled ? '🔊' : '🔇'} Audio
        </button>
        <button className="control-btn" onClick={toggleFullscreen}>
          {isFullscreen ? '🪟' : '⛶'} Fullscreen
        </button>
      </div>
    </div>
  );

  const RoomNavigation = () => (
    <div className="room-navigation">
      <div className="room-tabs">
        {tourInfo.rooms.map((room, index) => (
          <button
            key={room.id}
            className={`room-tab ${index === currentView ? 'active' : ''}`}
            onClick={() => handleRoomChange(index)}
          >
            <span className="room-icon">
              {index === 0 ? '🛋️' : index === 1 ? '🍽️' : index === 2 ? '🛏️' : '🚿'}
            </span>
            <span className="room-name">{room.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const Tour360View = () => (
    <div className="tour-360-container">
      {isLoading ? (
        <div className="tour-loading">
          <div className="loading-spinner"></div>
          <p>Loading {currentRoom.name}...</p>
        </div>
      ) : (
        <div className="tour-360-viewer">
          <img
            src={currentRoom.image360}
            alt={`360° view of ${currentRoom.name}`}
            className="tour-360-image"
            onError={(e) => {
              e.target.src = '/api/placeholder/800/400';
            }}
          />
          
          {showHotspots && currentRoom.hotspots.map((hotspot, index) => (
            <div
              key={index}
              className="tour-hotspot"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              title={hotspot.info}
            >
              <div className="hotspot-marker">
                <div className="hotspot-pulse"></div>
                <div className="hotspot-dot"></div>
              </div>
              <div className="hotspot-tooltip">
                <div className="tooltip-title">{hotspot.label}</div>
                <div className="tooltip-content">{hotspot.info}</div>
              </div>
            </div>
          ))}
          
          <div className="tour-info-overlay">
            <h3>{currentRoom.name}</h3>
            <p>{currentRoom.description}</p>
          </div>
        </div>
      )}
    </div>
  );

  const VideoTourView = () => (
    <div className="video-tour-container">
      <video
        controls
        poster="/api/placeholder/800/450"
        className="tour-video"
      >
        <source src={tourInfo.videoTour} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="video-info">
        <h3>Complete Property Walkthrough</h3>
        <p>Take a guided tour through every room and amenity</p>
        <div className="video-features">
          <span className="feature">🎯 Professional narration</span>
          <span className="feature">📱 Mobile optimized</span>
          <span className="feature">⚡ HD quality</span>
        </div>
      </div>
    </div>
  );

  const FloorPlanView = () => (
    <div className="floor-plan-container">
      <div className="floor-plan-viewer">
        <img
          src={tourInfo.floorPlan}
          alt="Interactive floor plan"
          className="floor-plan-image"
          onError={(e) => {
            e.target.src = '/api/placeholder/600/400';
          }}
        />
        
        <div className="floor-plan-rooms">
          {tourInfo.rooms.map((room, index) => (
            <button
              key={room.id}
              className={`floor-room ${index === currentView ? 'active' : ''}`}
              style={{
                left: `${20 + (index * 20)}%`,
                top: `${30 + (index * 15)}%`
              }}
              onClick={() => handleRoomChange(index)}
            >
              <span className="room-label">{room.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="floor-plan-info">
        <h3>Interactive Floor Plan</h3>
        <p>Click on rooms to explore in 360°</p>
        <div className="plan-details">
          <div className="detail-item">
            <strong>Total Area:</strong> 1,200 sq ft
          </div>
          <div className="detail-item">
            <strong>Rooms:</strong> {tourInfo.rooms.length}
          </div>
          <div className="detail-item">
            <strong>Layout:</strong> Open concept
          </div>
        </div>
      </div>
    </div>
  );

  const renderTourContent = () => {
    switch (tourType) {
      case '360':
        return <Tour360View />;
      case 'video':
        return <VideoTourView />;
      case 'floor':
        return <FloorPlanView />;
      default:
        return <Tour360View />;
    }
  };

  return (
    <div className="virtual-tour" ref={tourContainerRef}>
      <div className="tour-header">
        <div className="tour-title">
          <h2>{tourInfo.title}</h2>
          <div className="tour-badges">
            <span className="badge premium">Premium Tour</span>
            <span className="badge interactive">Interactive</span>
          </div>
        </div>
        
        <TourControls />
      </div>

      {tourType === '360' && <RoomNavigation />}
      
      <div className="tour-main-content">
        {renderTourContent()}
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        loop
        preload="metadata"
      >
        <source src={tourInfo.audioNarration} type="audio/mpeg" />
      </audio>

      {/* Tour Progress */}
      {tourType === '360' && (
        <div className="tour-progress">
          <div className="progress-info">
            Room {currentView + 1} of {tourInfo.rooms.length}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentView + 1) / tourInfo.rooms.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTour;