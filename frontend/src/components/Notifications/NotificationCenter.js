import React, { useState, useEffect, useRef } from 'react';
import './NotificationCenter.css';

const NotificationCenter = ({ isOpen, onClose, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef(null);

  // Mock notification data - replace with actual API calls
  const mockNotifications = [
    {
      id: 'notif_1',
      type: 'application_update',
      title: 'Application Status Updated',
      message: 'Your application for Sunset Apartments has been approved!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      priority: 'high',
      actionUrl: '/applications/app_123',
      icon: '✅',
      category: 'applications'
    },
    {
      id: 'notif_2',
      type: 'payment_reminder',
      title: 'Rent Payment Due Soon',
      message: 'Your rent payment of $1,200 is due in 3 days.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      priority: 'medium',
      actionUrl: '/payments',
      icon: '💰',
      category: 'payments'
    },
    {
      id: 'notif_3',
      type: 'maintenance_update',
      title: 'Maintenance Request Update',
      message: 'Your AC repair request has been scheduled for tomorrow at 2 PM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true,
      priority: 'medium',
      actionUrl: '/maintenance/req_456',
      icon: '🔧',
      category: 'maintenance'
    },
    {
      id: 'notif_4',
      type: 'community_event',
      title: 'Community BBQ This Weekend',
      message: 'Join us for a community barbecue this Saturday at 6 PM in the courtyard!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: false,
      priority: 'low',
      actionUrl: '/community/events',
      icon: '🍔',
      category: 'community'
    },
    {
      id: 'notif_5',
      type: 'lease_renewal',
      title: 'Lease Renewal Available',
      message: 'Your lease expires in 60 days. Renew now to secure your spot!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      priority: 'high',
      actionUrl: '/lease/renewal',
      icon: '📋',
      category: 'lease'
    },
    {
      id: 'notif_6',
      type: 'property_tour',
      title: 'Virtual Tour Scheduled',
      message: 'Your virtual tour for Ocean View Condos is confirmed for today at 3 PM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true,
      priority: 'medium',
      actionUrl: '/tours/tour_789',
      icon: '🏠',
      category: 'tours'
    },
    {
      id: 'notif_7',
      type: 'system_update',
      title: 'System Maintenance Tonight',
      message: 'ConnectSpace will be offline for maintenance tonight from 12-2 AM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      read: true,
      priority: 'low',
      actionUrl: null,
      icon: '⚙️',
      category: 'system'
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'unread', label: 'Unread', icon: '🔴' },
    { id: 'applications', label: 'Applications', icon: '📝' },
    { id: 'payments', label: 'Payments', icon: '💰' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'community', label: 'Community', icon: '👥' },
    { id: 'tours', label: 'Tours', icon: '🏠' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    // Count unread notifications
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  useEffect(() => {
    // Close on outside click
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      // API call to mark as read
      // await api.markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      // API call to mark all as read
      // await api.markAllNotificationsAsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
      
      // API call to delete notification
      // await api.deleteNotification(notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // Navigate to the action URL
      window.location.href = notification.actionUrl;
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    switch (activeFilter) {
      case 'unread':
        filtered = notifications.filter(n => !n.read);
        break;
      case 'applications':
      case 'payments':
      case 'maintenance':
      case 'community':
      case 'tours':
      case 'lease':
      case 'system':
        filtered = notifications.filter(n => n.category === activeFilter);
        break;
      default:
        filtered = notifications;
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  if (!isOpen) return null;

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notification-center-overlay">
      <div className="notification-center" ref={notificationRef}>
        {/* Header */}
        <div className="notification-header">
          <div className="header-left">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          
          <div className="header-actions">
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                ✓
              </button>
            )}
            <button 
              className="close-btn"
              onClick={onClose}
              title="Close notifications"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="notification-filters">
          <div className="filter-tabs">
            {filterOptions.map(filter => (
              <button
                key={filter.id}
                className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <span className="filter-icon">{filter.icon}</span>
                <span className="filter-label">{filter.label}</span>
                {filter.id === 'unread' && unreadCount > 0 && (
                  <span className="filter-count">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-container">
          {loading ? (
            <div className="notification-loading">
              <div className="loading-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <div className="no-notifications-icon">🔔</div>
              <h4>No notifications</h4>
              <p>
                {activeFilter === 'unread' 
                  ? "You're all caught up!" 
                  : `No ${activeFilter === 'all' ? '' : activeFilter + ' '}notifications to show.`
                }
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <div className="notification-icon">{notification.icon}</div>
                    
                    <div className="notification-body">
                      <div className="notification-title">
                        {notification.title}
                        {!notification.read && <span className="unread-dot"></span>}
                      </div>
                      
                      <div className="notification-message">
                        {notification.message}
                      </div>
                      
                      <div className="notification-timestamp">
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="notification-actions">
                    {notification.actionUrl && (
                      <button 
                        className="action-btn view-btn"
                        title="View details"
                      >
                        →
                      </button>
                    )}
                    
                    <button 
                      className="action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Delete notification"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="notification-footer">
          <div className="footer-actions">
            <button className="footer-btn settings-btn">
              ⚙️ Notification Settings
            </button>
            <button className="footer-btn history-btn">
              📋 View All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;