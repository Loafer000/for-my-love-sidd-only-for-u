import React, { useState, useEffect, useRef } from 'react';
import './MobileOptimizer.css';

const MobileOptimizer = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [touchDevice, setTouchDevice] = useState(false);
  const [networkSaveMode, setNetworkSaveMode] = useState(false);
  const [performanceMode, setPerformanceMode] = useState('auto');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [safariStandalone, setSafariStandalone] = useState(false);
  
  const containerRef = useRef(null);
  const lastTouchRef = useRef(0);

  useEffect(() => {
    initializeMobileOptimizer();
    setupEventListeners();
    detectDeviceCapabilities();
    optimizeViewport();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  const initializeMobileOptimizer = () => {
    // Detect mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isMobileViewport = window.innerWidth <= 768;
    setIsMobile(isMobileDevice || isMobileViewport);

    // Detect orientation
    const currentOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    setOrientation(currentOrientation);

    // Set initial viewport
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Detect touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setTouchDevice(hasTouch);

    // Check for Safari standalone mode (PWA)
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    setSafariStandalone(isStandalone);

    // Detect accessibility preferences
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPrefersReducedMotion(reducedMotion);

    // Detect network conditions
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const slowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
      setNetworkSaveMode(slowConnection || connection.saveData);
    }

    // Set performance mode based on device capabilities
    detectPerformanceMode();
  };

  const setupEventListeners = () => {
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    // Listen for network changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', handleNetworkChange);
    }
  };

  const detectDeviceCapabilities = () => {
    // Detect device memory
    const deviceMemory = navigator.deviceMemory || 4; // Default to 4GB
    const hardwareConcurrency = navigator.hardwareConcurrency || 4; // Default to 4 cores
    
    // Adjust performance mode based on hardware
    if (deviceMemory < 2 || hardwareConcurrency < 2) {
      setPerformanceMode('low');
    } else if (deviceMemory >= 8 && hardwareConcurrency >= 8) {
      setPerformanceMode('high');
    } else {
      setPerformanceMode('medium');
    }
  };

  const detectPerformanceMode = () => {
    // Use Performance Observer to measure device performance
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const totalTime = entries.reduce((sum, entry) => sum + entry.duration, 0);
          const averageTime = totalTime / entries.length;
          
          if (averageTime > 100) {
            setPerformanceMode('low');
          } else if (averageTime < 50) {
            setPerformanceMode('high');
          } else {
            setPerformanceMode('medium');
          }
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  };

  const optimizeViewport = () => {
    // Set viewport meta tag for mobile optimization
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }

    // Dynamic viewport settings based on device and orientation
    if (isMobile) {
      if (orientation === 'landscape' && viewport.height < 500) {
        // Landscape mode optimization
        viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no';
      } else {
        // Portrait mode optimization
        viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=5.0';
      }
    } else {
      viewportMeta.content = 'width=device-width, initial-scale=1.0';
    }

    // Add iOS specific meta tags
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      addIOSMetaTags();
    }

    // Add Android specific optimizations
    if (/Android/.test(navigator.userAgent)) {
      addAndroidOptimizations();
    }
  };

  const addIOSMetaTags = () => {
    const metaTags = [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'ConnectSpace' },
      { name: 'format-detection', content: 'telephone=no' }
    ];

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  };

  const addAndroidOptimizations = () => {
    const metaTags = [
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'theme-color', content: '#667eea' }
    ];

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  };

  const handleResize = () => {
    const newViewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    setViewport(newViewport);

    const newOrientation = newViewport.height > newViewport.width ? 'portrait' : 'landscape';
    if (newOrientation !== orientation) {
      setOrientation(newOrientation);
    }

    const newIsMobile = newViewport.width <= 768;
    if (newIsMobile !== isMobile) {
      setIsMobile(newIsMobile);
    }

    // Debounced viewport optimization
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(optimizeViewport, 150);
  };

  const handleOrientationChange = () => {
    // Wait for orientation change to complete
    setTimeout(() => {
      handleResize();
      optimizeViewport();
    }, 100);
  };

  const handleTouchStart = (event) => {
    const now = Date.now();
    const timeSinceLastTouch = now - lastTouchRef.current;
    
    // Detect double-tap to zoom (prevent if needed)
    if (timeSinceLastTouch < 300) {
      if (event.target.classList.contains('no-zoom')) {
        event.preventDefault();
      }
    }
    
    lastTouchRef.current = now;

    // Add touch feedback class
    if (event.target.classList.contains('touch-feedback')) {
      event.target.classList.add('touching');
      setTimeout(() => {
        event.target.classList.remove('touching');
      }, 150);
    }
  };

  const handleNetworkChange = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const slowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
      setNetworkSaveMode(slowConnection || connection.saveData);
    }
  };

  // Touch gesture utilities
  const addTouchGestures = (element, callbacks = {}) => {
    let startX, startY, startTime;
    let isSwipe = false;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      isSwipe = false;

      if (callbacks.onTouchStart) {
        callbacks.onTouchStart(e);
      }
    };

    const handleTouchMove = (e) => {
      if (!startX || !startY) return;

      const touch = e.touches[0];
      const diffX = startX - touch.clientX;
      const diffY = startY - touch.clientY;

      // Detect swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
        isSwipe = true;
        if (diffX > 0 && callbacks.onSwipeLeft) {
          callbacks.onSwipeLeft(e);
        } else if (diffX < 0 && callbacks.onSwipeRight) {
          callbacks.onSwipeRight(e);
        }
      } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 30) {
        isSwipe = true;
        if (diffY > 0 && callbacks.onSwipeUp) {
          callbacks.onSwipeUp(e);
        } else if (diffY < 0 && callbacks.onSwipeDown) {
          callbacks.onSwipeDown(e);
        }
      }

      if (callbacks.onTouchMove) {
        callbacks.onTouchMove(e);
      }
    };

    const handleTouchEnd = (e) => {
      const touchTime = Date.now() - startTime;
      
      if (!isSwipe && touchTime < 200 && callbacks.onTap) {
        callbacks.onTap(e);
      } else if (!isSwipe && touchTime >= 500 && callbacks.onLongPress) {
        callbacks.onLongPress(e);
      }

      if (callbacks.onTouchEnd) {
        callbacks.onTouchEnd(e);
      }

      startX = startY = startTime = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  };

  // Performance optimization utilities
  const optimizeImages = () => {
    if (!networkSaveMode) return;

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      // Use low-quality placeholder for slow networks
      if (img.dataset.srcLowQuality) {
        img.src = img.dataset.srcLowQuality;
      }
    });
  };

  const optimizeAnimations = () => {
    if (prefersReducedMotion || performanceMode === 'low') {
      document.body.classList.add('reduce-motion');
    }
  };

  const optimizeContent = () => {
    if (networkSaveMode) {
      // Hide non-essential content on slow networks
      const nonEssential = document.querySelectorAll('.non-essential');
      nonEssential.forEach(el => el.style.display = 'none');
    }

    if (performanceMode === 'low') {
      // Reduce visual effects for low-performance devices
      document.body.classList.add('low-performance');
    }
  };

  // Haptic feedback utility
  const hapticFeedback = (type = 'light') => {
    if ('vibrate' in navigator && touchDevice) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(50);
          break;
        case 'heavy':
          navigator.vibrate([100, 30, 100]);
          break;
        case 'error':
          navigator.vibrate([300, 100, 300]);
          break;
        case 'success':
          navigator.vibrate([100, 50, 100, 50, 100]);
          break;
      }
    }
  };

  // Safe area handling for devices with notches
  const getSafeAreaInsets = () => {
    const style = getComputedStyle(document.documentElement);
    return {
      top: style.getPropertyValue('--sat') || style.getPropertyValue('env(safe-area-inset-top)') || '0px',
      right: style.getPropertyValue('--sar') || style.getPropertyValue('env(safe-area-inset-right)') || '0px',
      bottom: style.getPropertyValue('--sab') || style.getPropertyValue('env(safe-area-inset-bottom)') || '0px',
      left: style.getPropertyValue('--sal') || style.getPropertyValue('env(safe-area-inset-left)') || '0px'
    };
  };

  // Keyboard handling for mobile inputs
  const handleVirtualKeyboard = () => {
    if (!isMobile) return;

    let initialViewportHeight = window.innerHeight;
    
    const handleViewportChange = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      if (heightDifference > 150) {
        // Keyboard is likely open
        document.body.classList.add('keyboard-open');
        document.body.style.setProperty('--keyboard-height', `${heightDifference}px`);
      } else {
        // Keyboard is likely closed
        document.body.classList.remove('keyboard-open');
        document.body.style.removeProperty('--keyboard-height');
      }
    };

    window.addEventListener('resize', handleViewportChange);
    
    return () => {
      window.removeEventListener('resize', handleViewportChange);
    };
  };

  // Expose utilities globally
  React.useEffect(() => {
    window.MobileOptimizer = {
      addTouchGestures,
      hapticFeedback,
      getSafeAreaInsets,
      isMobile,
      orientation,
      viewport,
      touchDevice,
      networkSaveMode,
      performanceMode,
      prefersReducedMotion
    };

    // Apply optimizations
    optimizeImages();
    optimizeAnimations();
    optimizeContent();
    handleVirtualKeyboard();
  }, [isMobile, orientation, networkSaveMode, performanceMode, prefersReducedMotion]);

  const containerClasses = [
    'mobile-optimizer-container',
    isMobile ? 'is-mobile' : 'is-desktop',
    `orientation-${orientation}`,
    `performance-${performanceMode}`,
    touchDevice ? 'touch-device' : 'no-touch',
    networkSaveMode ? 'network-save-mode' : 'normal-network',
    safariStandalone ? 'standalone' : 'browser',
    prefersReducedMotion ? 'reduce-motion' : 'normal-motion'
  ].join(' ');

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      style={{
        '--viewport-width': `${viewport.width}px`,
        '--viewport-height': `${viewport.height}px`,
        '--safe-area-inset-top': 'env(safe-area-inset-top)',
        '--safe-area-inset-right': 'env(safe-area-inset-right)',
        '--safe-area-inset-bottom': 'env(safe-area-inset-bottom)',
        '--safe-area-inset-left': 'env(safe-area-inset-left)'
      }}
    >
      {children}
      
      {/* Mobile-specific overlays and helpers */}
      {isMobile && (
        <>
          {/* Touch feedback overlay */}
          <div className="touch-feedback-overlay" />
          
          {/* Safe area indicators (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="safe-area-indicators">
              <div className="safe-area-top" />
              <div className="safe-area-right" />
              <div className="safe-area-bottom" />
              <div className="safe-area-left" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MobileOptimizer;