// Service Worker for ConnectSpace PWA
const CACHE_NAME = 'connectspace-v1.0.0';
const API_CACHE_NAME = 'connectspace-api-v1.0.0';
const IMAGE_CACHE_NAME = 'connectspace-images-v1.0.0';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
  '/offline.html'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/properties',
  '/api/user/profile',
  '/api/favorites',
  '/api/notifications'
];

// Background sync tags
const SYNC_TAGS = {
  PROPERTY_SEARCH: 'property-search',
  FAVORITE_PROPERTY: 'favorite-property',
  PROPERTY_INQUIRY: 'property-inquiry',
  MAINTENANCE_REQUEST: 'maintenance-request',
  NOTIFICATION_SYNC: 'notification-sync'
};

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE_NAME),
      caches.open(IMAGE_CACHE_NAME)
    ]).then(() => {
      console.log('[SW] Static assets cached successfully');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME && 
              cacheName !== IMAGE_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Cache cleanup completed');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    if (url.pathname.startsWith('/api/')) {
      // API requests - network first, then cache
      event.respondWith(handleApiRequest(request));
    } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      // Image requests - cache first, then network
      event.respondWith(handleImageRequest(request));
    } else {
      // Static assets - cache first, then network
      event.respondWith(handleStaticRequest(request));
    }
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for API request, trying cache');
    
    // Fall back to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for critical API endpoints
    if (request.url.includes('/api/properties')) {
      return new Response(JSON.stringify({
        properties: [],
        message: 'Offline - showing cached data',
        offline: true
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    throw error;
  }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to load image:', request.url);
    // Return placeholder image for offline
    return new Response(
      '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Image not available offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Handle static asset requests with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok && networkResponse.status < 400) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for static request');
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await cache.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case SYNC_TAGS.PROPERTY_SEARCH:
      event.waitUntil(syncPropertySearch());
      break;
    case SYNC_TAGS.FAVORITE_PROPERTY:
      event.waitUntil(syncFavoriteProperty());
      break;
    case SYNC_TAGS.PROPERTY_INQUIRY:
      event.waitUntil(syncPropertyInquiry());
      break;
    case SYNC_TAGS.MAINTENANCE_REQUEST:
      event.waitUntil(syncMaintenanceRequest());
      break;
    case SYNC_TAGS.NOTIFICATION_SYNC:
      event.waitUntil(syncNotifications());
      break;
  }
});

// Sync offline property searches
async function syncPropertySearch() {
  try {
    const searches = await getStoredData('offline-searches');
    
    for (const search of searches) {
      try {
        const response = await fetch('/api/properties/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(search.data)
        });
        
        if (response.ok) {
          await removeStoredData('offline-searches', search.id);
          console.log('[SW] Synced offline search:', search.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync search:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed for property search:', error);
  }
}

// Sync offline favorite actions
async function syncFavoriteProperty() {
  try {
    const favorites = await getStoredData('offline-favorites');
    
    for (const favorite of favorites) {
      try {
        const response = await fetch(`/api/favorites/${favorite.action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(favorite.data)
        });
        
        if (response.ok) {
          await removeStoredData('offline-favorites', favorite.id);
          console.log('[SW] Synced offline favorite:', favorite.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync favorite:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed for favorites:', error);
  }
}

// Sync offline property inquiries
async function syncPropertyInquiry() {
  try {
    const inquiries = await getStoredData('offline-inquiries');
    
    for (const inquiry of inquiries) {
      try {
        const response = await fetch('/api/properties/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiry.data)
        });
        
        if (response.ok) {
          await removeStoredData('offline-inquiries', inquiry.id);
          console.log('[SW] Synced offline inquiry:', inquiry.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync inquiry:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed for inquiries:', error);
  }
}

// Sync offline maintenance requests
async function syncMaintenanceRequest() {
  try {
    const requests = await getStoredData('offline-maintenance');
    
    for (const request of requests) {
      try {
        const response = await fetch('/api/maintenance/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request.data)
        });
        
        if (response.ok) {
          await removeStoredData('offline-maintenance', request.id);
          console.log('[SW] Synced offline maintenance request:', request.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync maintenance request:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed for maintenance:', error);
  }
}

// Sync notifications
async function syncNotifications() {
  try {
    const response = await fetch('/api/notifications/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastSync: await getLastSyncTime() })
    });
    
    if (response.ok) {
      const data = await response.json();
      await setLastSyncTime(Date.now());
      
      // Show new notifications
      if (data.notifications && data.notifications.length > 0) {
        for (const notification of data.notifications) {
          self.registration.showNotification(notification.title, {
            body: notification.message,
            icon: '/images/icons/icon-192x192.png',
            badge: '/images/icons/badge-72x72.png',
            data: notification,
            actions: [
              { action: 'view', title: 'View' },
              { action: 'dismiss', title: 'Dismiss' }
            ]
          });
        }
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync notifications:', error);
  }
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/images/icons/icon-192x192.png',
      badge: '/images/icons/badge-72x72.png',
      image: data.image,
      data: data,
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      requireInteraction: data.priority === 'high',
      silent: data.priority === 'low'
    })
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();
  
  const { data } = event.notification;
  
  if (event.action === 'view' || !event.action) {
    // Open the app to the relevant page
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          // Focus existing window or open new one
          if (clientList.length > 0) {
            const client = clientList[0];
            client.focus();
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              data: data
            });
          } else {
            return clients.openWindow(data.url || '/');
          }
        })
    );
  }
});

// Message handling from main thread
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_CLEAR':
      clearAllCaches();
      break;
    case 'STORE_OFFLINE_DATA':
      storeOfflineData(data.key, data.value);
      break;
    case 'REGISTER_BACKGROUND_SYNC':
      if (self.registration.sync) {
        self.registration.sync.register(data.tag);
      }
      break;
  }
});

// Utility functions for IndexedDB operations
async function getStoredData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ConnectSpaceDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function removeStoredData(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ConnectSpaceDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

async function storeOfflineData(storeName, data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ConnectSpaceDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const addRequest = store.add({ ...data, timestamp: Date.now() });
      
      addRequest.onsuccess = () => resolve(addRequest.result);
      addRequest.onerror = () => reject(addRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getLastSyncTime() {
  const stored = await getStoredData('sync-metadata');
  return stored.find(item => item.key === 'lastNotificationSync')?.value || 0;
}

async function setLastSyncTime(timestamp) {
  await storeOfflineData('sync-metadata', {
    key: 'lastNotificationSync',
    value: timestamp
  });
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('[SW] All caches cleared');
}

console.log('[SW] Service worker loaded successfully');