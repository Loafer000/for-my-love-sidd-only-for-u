import React, { useState, useEffect, useCallback } from 'react';
import './PWAManager.css';

const PWAManager = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [offlineActions, setOfflineActions] = useState([]);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [networkSpeed, setNetworkSpeed] = useState('unknown');

  // Initialize PWA manager
  useEffect(() => {
    initializePWA();
    setupEventListeners();
    checkInstallStatus();
    checkPushPermission();
    loadOfflineActions();
    detectNetworkSpeed();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const initializePWA = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setSwUpdateAvailable(true);
            }
          });
        });

        // Listen for SW messages
        navigator.serviceWorker.addEventListener('message', handleSWMessage);

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const setupEventListeners = () => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
  };

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    syncOfflineActions();
    detectNetworkSpeed();
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setNetworkSpeed('offline');
  }, []);

  const handleInstallPrompt = useCallback((event) => {
    event.preventDefault();
    setInstallPrompt(event);
  }, []);

  const handleSWMessage = (event) => {
    const { type, data } = event.data;
    
    switch (type) {
      case 'SYNC_STATUS':
        setSyncStatus(data.status);
        break;
      case 'OFFLINE_ACTION_COMPLETED':
        removeOfflineAction(data.actionId);
        break;
      case 'NOTIFICATION_CLICKED':
        handleNotificationClick(data);
        break;
    }
  };

  const checkInstallStatus = () => {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  };

  const checkPushPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = Notification.permission;
      setPushEnabled(permission === 'granted');
    }
  };

  const loadOfflineActions = () => {
    const stored = localStorage.getItem('connectspace-offline-actions');
    if (stored) {
      try {
        setOfflineActions(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse offline actions:', error);
      }
    }
  };

  const saveOfflineActions = (actions) => {
    localStorage.setItem('connectspace-offline-actions', JSON.stringify(actions));
    setOfflineActions(actions);
  };

  const detectNetworkSpeed = async () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const effectiveType = connection.effectiveType;
      setNetworkSpeed(effectiveType);
    } else {
      // Fallback: measure download speed
      try {
        const startTime = performance.now();
        await fetch('/images/icons/icon-192x192.png', { cache: 'no-store' });
        const endTime = performance.now();
        const speed = endTime - startTime;
        
        if (speed < 100) setNetworkSpeed('4g');
        else if (speed < 300) setNetworkSpeed('3g');
        else if (speed < 1000) setNetworkSpeed('2g');
        else setNetworkSpeed('slow-2g');
      } catch (error) {
        setNetworkSpeed('unknown');
      }
    }
  };

  // PWA Installation
  const installPWA = async () => {
    if (!installPrompt) return;

    try {
      const result = await installPrompt.prompt();
      console.log('Install prompt result:', result);
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setInstallPrompt(null);
        showToast('App installed successfully! 🎉');
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
    }
  };

  // Service Worker Update
  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  // Push Notifications
  const enablePushNotifications = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      showToast('Push notifications not supported', 'error');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
        });

        // Send subscription to server
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        });

        setPushEnabled(true);
        showToast('Push notifications enabled! 🔔');
      } else {
        showToast('Push notifications permission denied', 'error');
      }
    } catch (error) {
      console.error('Push notification setup failed:', error);
      showToast('Failed to enable push notifications', 'error');
    }
  };

  const disablePushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify server
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });
      }

      setPushEnabled(false);
      showToast('Push notifications disabled');
    } catch (error) {
      console.error('Failed to disable push notifications:', error);
    }
  };

  // Offline Actions Management
  const addOfflineAction = (action) => {
    const newAction = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...action
    };
    
    const updatedActions = [...offlineActions, newAction];
    saveOfflineActions(updatedActions);

    // Register background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register(action.syncTag || 'default-sync');
      });
    }

    showToast(`Action queued for sync: ${action.type}`);
  };

  const removeOfflineAction = (actionId) => {
    const updatedActions = offlineActions.filter(action => action.id !== actionId);
    saveOfflineActions(updatedActions);
  };

  const syncOfflineActions = async () => {
    if (offlineActions.length === 0) return;

    setSyncStatus('syncing');
    let syncedCount = 0;

    for (const action of offlineActions) {
      try {
        await performAction(action);
        removeOfflineAction(action.id);
        syncedCount++;
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }

    setSyncStatus('idle');
    
    if (syncedCount > 0) {
      showToast(`${syncedCount} actions synced successfully! ✅`);
    }
  };

  const performAction = async (action) => {
    const { type, data, endpoint, method = 'POST' } = action;

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to sync ${type}: ${response.statusText}`);
    }

    return response.json();
  };

  // Cache Management
  const clearCache = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration.active) {
        registration.active.postMessage({ type: 'CACHE_CLEAR' });
        showToast('Cache cleared successfully! 🗑️');
      }
    }
  };

  const estimateCacheSize = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const used = (estimate.usage / 1024 / 1024).toFixed(2); // MB
        const quota = (estimate.quota / 1024 / 1024).toFixed(2); // MB
        return { used, quota, percentage: ((estimate.usage / estimate.quota) * 100).toFixed(1) };
      } catch (error) {
        console.error('Failed to estimate storage:', error);
        return null;
      }
    }
    return null;
  };

  // Utility Functions
  const showToast = (message, type = 'info') => {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `pwa-toast pwa-toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const handleNotificationClick = (data) => {
    // Handle notification clicks based on type
    switch (data.type) {
      case 'property-update':
        window.location.href = `/properties/${data.propertyId}`;
        break;
      case 'maintenance-request':
        window.location.href = `/maintenance/${data.requestId}`;
        break;
      case 'message':
        window.location.href = `/messages/${data.messageId}`;
        break;
      default:
        window.location.href = '/dashboard';
    }
  };

  // Share API
  const shareProperty = async (property) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: `${window.location.origin}/properties/${property.id}`
        });
      } catch (error) {
        console.error('Share failed:', error);
        // Fallback to clipboard
        copyToClipboard(`${window.location.origin}/properties/${property.id}`);
      }
    } else {
      // Fallback for browsers without Web Share API
      copyToClipboard(`${window.location.origin}/properties/${property.id}`);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Link copied to clipboard! 📋');
    } catch (error) {
      console.error('Copy failed:', error);
      showToast('Failed to copy link', 'error');
    }
  };

  // Network Quality Indicator
  const getNetworkQualityColor = () => {
    switch (networkSpeed) {
      case '4g': return '#10b981';
      case '3g': return '#f59e0b';
      case '2g': return '#ef4444';
      case 'slow-2g': return '#dc2626';
      case 'offline': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const getNetworkQualityIcon = () => {
    switch (networkSpeed) {
      case '4g': return '📶';
      case '3g': return '📶';
      case '2g': return '📱';
      case 'slow-2g': return '🐌';
      case 'offline': return '📡';
      default: return '❓';
    }
  };

  // Public API for other components
  window.PWAManager = {
    addOfflineAction,
    shareProperty,
    isOnline,
    networkSpeed,
    pushEnabled
  };

  return (
    <div className="pwa-manager">
      {/* Network Status Indicator */}
      <div className={`network-indicator ${isOnline ? 'online' : 'offline'}`}>
        <span className="network-icon" style={{ color: getNetworkQualityColor() }}>
          {getNetworkQualityIcon()}
        </span>
        <span className="network-text">
          {isOnline ? networkSpeed.toUpperCase() : 'Offline'}
        </span>
      </div>

      {/* Install Prompt */}
      {installPrompt && !isInstalled && (
        <div className="install-prompt">
          <div className="install-content">
            <div className="install-icon">📱</div>
            <div className="install-text">
              <h3>Install ConnectSpace</h3>
              <p>Get the full app experience with offline access and notifications!</p>
            </div>
            <div className="install-actions">
              <button className="install-btn" onClick={installPWA}>
                Install
              </button>
              <button className="dismiss-btn" onClick={() => setInstallPrompt(null)}>
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Available */}
      {swUpdateAvailable && (
        <div className="update-prompt">
          <div className="update-content">
            <div className="update-icon">🔄</div>
            <div className="update-text">
              <h3>Update Available</h3>
              <p>A new version of ConnectSpace is ready!</p>
            </div>
            <div className="update-actions">
              <button className="update-btn" onClick={updateServiceWorker}>
                Update Now
              </button>
              <button className="dismiss-btn" onClick={() => setSwUpdateAvailable(false)}>
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Actions Queue */}
      {offlineActions.length > 0 && (
        <div className="offline-queue">
          <div className="queue-header">
            <span className="queue-icon">⏳</span>
            <span className="queue-count">{offlineActions.length}</span>
            <span className="queue-text">Pending Actions</span>
            {syncStatus === 'syncing' && <div className="sync-spinner"></div>}
          </div>
        </div>
      )}

      {/* Push Notification Toggle */}
      {!isInstalled && 'Notification' in window && (
        <div className="push-prompt">
          <div className="push-content">
            <div className="push-icon">🔔</div>
            <div className="push-text">
              <h4>Stay Updated</h4>
              <p>Get notifications for property updates and messages</p>
            </div>
            <button 
              className={`push-toggle ${pushEnabled ? 'enabled' : 'disabled'}`}
              onClick={pushEnabled ? disablePushNotifications : enablePushNotifications}
            >
              {pushEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAManager;