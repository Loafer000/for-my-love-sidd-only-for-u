import React, { useState, useEffect } from 'react';
import NotificationCenter from '../components/Notifications/NotificationCenter';
import EmailIntegration from '../components/Notifications/EmailIntegration';
import CommunityHub from '../components/Notifications/CommunityHub';
import './CommunicationPage.css';

const CommunicationPage = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [communicationStats, setCommunicationStats] = useState({});

  // Mock stats data
  const mockStats = {
    notifications: {
      total: 47,
      unread: 12,
      thisWeek: 23
    },
    emails: {
      sent: 1247,
      deliveryRate: 89.3,
      openRate: 76.8,
      clickRate: 23.4
    },
    community: {
      activeMembers: 142,
      postsThisWeek: 28,
      upcomingEvents: 5,
      discussions: 15
    }
  };

  const tabs = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      description: 'Real-time alerts and updates',
      color: '#3b82f6'
    },
    {
      id: 'email',
      label: 'Email Integration',
      icon: '📧',
      description: 'Email preferences and templates',
      color: '#8b5cf6'
    },
    {
      id: 'community',
      label: 'Community Hub',
      icon: '👥',
      description: 'Social features and events',
      color: '#06b6d4'
    },
    {
      id: 'settings',
      label: 'Communication Settings',
      icon: '⚙️',
      description: 'Manage all communication preferences',
      color: '#64748b'
    }
  ];

  useEffect(() => {
    loadCommunicationStats();
  }, []);

  const loadCommunicationStats = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCommunicationStats(mockStats);
      setUnreadCount(mockStats.notifications.unread);
    } catch (error) {
      console.error('Failed to load communication stats:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h2>Notification Center</h2>
              <p>Stay updated with real-time notifications and alerts</p>
              <button 
                className="open-notifications-btn"
                onClick={() => setShowNotificationCenter(true)}
              >
                <span className="btn-icon">🔔</span>
                Open Notification Center
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>
            </div>
            
            <div className="notification-features">
              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h3>Real-time Alerts</h3>
                  <p>Instant notifications for important updates, application status changes, and urgent messages</p>
                  <div className="feature-stats">
                    <span className="stat">{communicationStats.notifications?.total || 0} Total</span>
                    <span className="stat">{communicationStats.notifications?.unread || 0} Unread</span>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">🎯</div>
                  <h3>Smart Categorization</h3>
                  <p>Notifications automatically categorized by type: applications, payments, maintenance, and community</p>
                  <div className="feature-list">
                    <span className="list-item">Applications</span>
                    <span className="list-item">Payments</span>
                    <span className="list-item">Maintenance</span>
                    <span className="list-item">Community</span>
                  </div>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">🔧</div>
                  <h3>Customizable Preferences</h3>
                  <p>Fine-tune what notifications you receive and how you want to be alerted</p>
                  <div className="preference-toggles">
                    <div className="toggle-item">
                      <span>Push Notifications</span>
                      <div className="toggle-switch active"></div>
                    </div>
                    <div className="toggle-item">
                      <span>Email Alerts</span>
                      <div className="toggle-switch active"></div>
                    </div>
                    <div className="toggle-item">
                      <span>SMS Notifications</span>
                      <div className="toggle-switch"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'email':
        return <EmailIntegration userId={userId} />;
        
      case 'community':
        return <CommunityHub userId={userId} />;
        
      case 'settings':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h2>Communication Settings</h2>
              <p>Manage all your communication preferences in one place</p>
            </div>
            
            <div className="settings-sections">
              <div className="settings-section">
                <h3>🔔 Notification Preferences</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-name">Desktop Notifications</span>
                      <span className="setting-desc">Show notifications in browser</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-name">Sound Alerts</span>
                      <span className="setting-desc">Play sound for new notifications</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-name">Badge Counts</span>
                      <span className="setting-desc">Show unread count badges</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>📧 Email Settings</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-name">Email Frequency</span>
                      <span className="setting-desc">How often to receive email updates</span>
                    </div>
                    <select className="setting-select">
                      <option>Immediately</option>
                      <option>Hourly Digest</option>
                      <option>Daily Digest</option>
                      <option>Weekly Digest</option>
                    </select>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-name">Marketing Emails</span>
                      <span className="setting-desc">Promotional content and updates</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>👥 Community Settings</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-name">Profile Visibility</span>
                      <span className="setting-desc">Who can see your profile in directory</span>
                    </div>
                    <select className="setting-select">
                      <option>All Residents</option>
                      <option>Same Building Only</option>
                      <option>Private</option>
                    </select>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-name">Event Notifications</span>
                      <span className="setting-desc">Get notified about community events</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <span className="setting-name">Direct Messages</span>
                      <span className="setting-desc">Allow other residents to message you</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="settings-actions">
                <button className="save-settings-btn">
                  💾 Save All Settings
                </button>
                <button className="export-settings-btn">
                  📤 Export Settings
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="communication-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Communication & Notifications</h1>
          <p>Stay connected with advanced notification systems, email integration, and community features</p>
          
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-icon">🔔</div>
              <div className="stat-details">
                <span className="stat-number">{communicationStats.notifications?.total || 0}</span>
                <span className="stat-label">Total Notifications</span>
                <span className="stat-sublabel">{communicationStats.notifications?.unread || 0} unread</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📧</div>
              <div className="stat-details">
                <span className="stat-number">{communicationStats.emails?.sent || 0}</span>
                <span className="stat-label">Emails Sent</span>
                <span className="stat-sublabel">{communicationStats.emails?.deliveryRate || 0}% delivery rate</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-details">
                <span className="stat-number">{communicationStats.community?.activeMembers || 0}</span>
                <span className="stat-label">Active Members</span>
                <span className="stat-sublabel">{communicationStats.community?.postsThisWeek || 0} posts this week</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🎉</div>
              <div className="stat-details">
                <span className="stat-number">{communicationStats.community?.upcomingEvents || 0}</span>
                <span className="stat-label">Upcoming Events</span>
                <span className="stat-sublabel">{communicationStats.community?.discussions || 0} active discussions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="communication-nav">
        <div className="nav-container">
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ '--tab-color': tab.color }}
              >
                <div className="tab-icon">{tab.icon}</div>
                <div className="tab-content">
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-description">{tab.description}</span>
                </div>
                {tab.id === 'notifications' && unreadCount > 0 && (
                  <span className="tab-badge">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="communication-content">
        {renderContent()}
      </div>

      {/* Week 4 Feature Overview */}
      <div className="feature-overview">
        <div className="overview-container">
          <h2>Week 4: Advanced Communication System</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <div className="overview-icon">🔔</div>
              <h3>Smart Notifications</h3>
              <p>Real-time notification center with intelligent categorization and filtering</p>
              <ul className="feature-list">
                <li>Real-time push notifications</li>
                <li>Smart categorization by type</li>
                <li>Customizable notification preferences</li>
                <li>Mark as read/unread functionality</li>
                <li>Notification history and search</li>
              </ul>
            </div>
            
            <div className="overview-card">
              <div className="overview-icon">📧</div>
              <h3>Email Integration</h3>
              <p>Comprehensive email management with templates and analytics</p>
              <ul className="feature-list">
                <li>Customizable email preferences</li>
                <li>Professional email templates</li>
                <li>Delivery and engagement tracking</li>
                <li>Email history and performance metrics</li>
                <li>Automated email workflows</li>
              </ul>
            </div>
            
            <div className="overview-card">
              <div className="overview-icon">👥</div>
              <h3>Community Hub</h3>
              <p>Social platform connecting residents with events and discussions</p>
              <ul className="feature-list">
                <li>Community feed and posts</li>
                <li>Event creation and RSVP system</li>
                <li>Discussion forums and voting</li>
                <li>Resident directory</li>
                <li>Community announcements</li>
              </ul>
            </div>
            
            <div className="overview-card">
              <div className="overview-icon">⚙️</div>
              <h3>Unified Settings</h3>
              <p>Centralized communication preferences and privacy controls</p>
              <ul className="feature-list">
                <li>Notification frequency controls</li>
                <li>Privacy and visibility settings</li>
                <li>Email subscription management</li>
                <li>Communication channel preferences</li>
                <li>Export and backup options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Progress */}
      <div className="implementation-progress">
        <div className="progress-container">
          <h3>Week 4 Implementation Status</h3>
          <div className="progress-items">
            <div className="progress-item completed">
              <div className="progress-icon">✅</div>
              <div className="progress-content">
                <h4>Notification Center</h4>
                <p>Real-time notifications with categorization and management</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="progress-item completed">
              <div className="progress-icon">✅</div>
              <div className="progress-content">
                <h4>Email Integration System</h4>
                <p>Email preferences, templates, and delivery tracking</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="progress-item completed">
              <div className="progress-icon">✅</div>
              <div className="progress-content">
                <h4>Community Hub</h4>
                <p>Social features, events, and resident communication</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="progress-item ready">
              <div className="progress-icon">🚀</div>
              <div className="progress-content">
                <h4>Week 5 Planning</h4>
                <p>Ready for next phase: Advanced landlord tools and analytics</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification Center */}
      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        userId={userId}
      />

      {/* Floating Action Button */}
      <button 
        className="floating-notification-btn"
        onClick={() => setShowNotificationCenter(true)}
        title="Open Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="floating-badge">{unreadCount}</span>
        )}
      </button>
    </div>
  );
};

export default CommunicationPage;