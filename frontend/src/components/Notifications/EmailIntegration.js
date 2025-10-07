import React, { useState, useEffect } from 'react';
import './EmailIntegration.css';

const EmailIntegration = ({ userId }) => {
  const [emailSettings, setEmailSettings] = useState({
    notifications: true,
    promotions: false,
    newsletters: true,
    applicationUpdates: true,
    paymentReminders: true,
    maintenanceUpdates: true,
    communityEvents: false,
    marketingEmails: false,
    weeklyDigest: true,
    instantAlerts: true
  });

  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Mock data
  const mockTemplates = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to ConnectSpace! 🏠',
      category: 'onboarding',
      description: 'Sent to new users upon registration',
      lastModified: new Date(),
      status: 'active',
      openRate: 85.4,
      clickRate: 12.3
    },
    {
      id: 'application_approved',
      name: 'Application Approved',
      subject: 'Great News! Your Application Has Been Approved ✅',
      category: 'applications',
      description: 'Sent when rental application is approved',
      lastModified: new Date(Date.now() - 86400000),
      status: 'active',
      openRate: 92.1,
      clickRate: 34.7
    },
    {
      id: 'payment_reminder',
      name: 'Payment Reminder',
      subject: 'Rent Payment Due Soon 💰',
      category: 'payments',
      description: 'Sent 3 days before rent is due',
      lastModified: new Date(Date.now() - 172800000),
      status: 'active',
      openRate: 78.9,
      clickRate: 45.2
    },
    {
      id: 'maintenance_scheduled',
      name: 'Maintenance Scheduled',
      subject: 'Maintenance Visit Scheduled 🔧',
      category: 'maintenance',
      description: 'Sent when maintenance is scheduled',
      lastModified: new Date(Date.now() - 259200000),
      status: 'active',
      openRate: 88.7,
      clickRate: 28.9
    },
    {
      id: 'community_event',
      name: 'Community Event Invitation',
      subject: 'You\'re Invited! Community Event This Weekend 🎉',
      category: 'community',
      description: 'Sent for community events and gatherings',
      lastModified: new Date(Date.now() - 345600000),
      status: 'draft',
      openRate: 65.3,
      clickRate: 18.4
    }
  ];

  const mockEmailHistory = [
    {
      id: 'email_1',
      template: 'payment_reminder',
      recipient: 'john.doe@example.com',
      subject: 'Rent Payment Due Soon 💰',
      sentAt: new Date(Date.now() - 3600000),
      status: 'delivered',
      opened: true,
      clicked: false,
      openedAt: new Date(Date.now() - 1800000)
    },
    {
      id: 'email_2',
      template: 'application_approved',
      recipient: 'jane.smith@example.com',
      subject: 'Great News! Your Application Has Been Approved ✅',
      sentAt: new Date(Date.now() - 7200000),
      status: 'delivered',
      opened: true,
      clicked: true,
      openedAt: new Date(Date.now() - 6300000),
      clickedAt: new Date(Date.now() - 6000000)
    },
    {
      id: 'email_3',
      template: 'welcome',
      recipient: 'mike.johnson@example.com',
      subject: 'Welcome to ConnectSpace! 🏠',
      sentAt: new Date(Date.now() - 10800000),
      status: 'bounced',
      opened: false,
      clicked: false,
      bounceReason: 'Invalid email address'
    },
    {
      id: 'email_4',
      template: 'maintenance_scheduled',
      recipient: 'sarah.wilson@example.com',
      subject: 'Maintenance Visit Scheduled 🔧',
      sentAt: new Date(Date.now() - 14400000),
      status: 'delivered',
      opened: true,
      clicked: true,
      openedAt: new Date(Date.now() - 12600000),
      clickedAt: new Date(Date.now() - 12300000)
    }
  ];

  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailTemplates(mockTemplates);
      setEmailHistory(mockEmailHistory);
    } catch (error) {
      console.error('Failed to load email data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (setting, value) => {
    setEmailSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveEmailSettings = async () => {
    setLoading(true);
    try {
      // API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email settings saved:', emailSettings);
    } catch (error) {
      console.error('Failed to save email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTemplateContent = (templateId) => {
    const templates = {
      welcome: {
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center; color: white;">
              <h1>Welcome to ConnectSpace! 🏠</h1>
              <p>Your journey to finding the perfect home starts here</p>
            </div>
            <div style="padding: 2rem;">
              <h2>Hello {{firstName}},</h2>
              <p>We're excited to have you join our community! ConnectSpace makes finding and managing your rental property simple and stress-free.</p>
              
              <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
                <h3>Get Started:</h3>
                <ul>
                  <li>Complete your profile</li>
                  <li>Browse available properties</li>
                  <li>Schedule virtual tours</li>
                  <li>Submit applications online</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 2rem 0;">
                <a href="{{dashboardUrl}}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  Go to Dashboard
                </a>
              </div>
              
              <p>Questions? Reply to this email or contact our support team.</p>
              <p>Happy house hunting!</p>
            </div>
          </div>
        `
      },
      application_approved: {
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #10b981; padding: 2rem; text-align: center; color: white;">
              <h1>🎉 Application Approved!</h1>
              <p>Congratulations on your approved application</p>
            </div>
            <div style="padding: 2rem;">
              <h2>Great news, {{firstName}}!</h2>
              <p>Your application for <strong>{{propertyName}}</strong> has been approved!</p>
              
              <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 1.5rem; margin: 1.5rem 0;">
                <h3>Next Steps:</h3>
                <ol>
                  <li>Review and sign your lease agreement</li>
                  <li>Submit security deposit and first month's rent</li>
                  <li>Schedule your move-in inspection</li>
                  <li>Get your keys and move in!</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin: 2rem 0;">
                <a href="{{leaseUrl}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  View Lease Agreement
                </a>
              </div>
            </div>
          </div>
        `
      }
    };
    
    return templates[templateId] || { content: 'Template content not found.' };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✅';
      case 'bounced': return '❌';
      case 'pending': return '⏳';
      case 'failed': return '💥';
      default: return '📧';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'bounced': return '#ef4444';
      case 'pending': return '#f59e0b';
      case 'failed': return '#dc2626';
      default: return '#6b7280';
    }
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

  return (
    <div className="email-integration">
      {/* Header */}
      <div className="email-header">
        <div className="header-content">
          <h1>Email Integration & Settings</h1>
          <p>Manage your email preferences, templates, and delivery settings</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-details">
              <span className="stat-number">1,247</span>
              <span className="stat-label">Emails Sent</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-details">
              <span className="stat-number">89.3%</span>
              <span className="stat-label">Delivery Rate</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-details">
              <span className="stat-number">76.8%</span>
              <span className="stat-label">Open Rate</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🖱️</div>
            <div className="stat-details">
              <span className="stat-number">23.4%</span>
              <span className="stat-label">Click Rate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="email-content">
        {/* Email Preferences */}
        <div className="email-section">
          <div className="section-header">
            <h2>Email Preferences</h2>
            <p>Choose what types of emails you want to receive</p>
          </div>
          
          <div className="preferences-grid">
            <div className="preference-category">
              <h3>🔔 Notifications</h3>
              <div className="preference-items">
                <div className="preference-item">
                  <div className="preference-info">
                    <span className="preference-name">Application Updates</span>
                    <span className="preference-desc">Status changes on your applications</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailSettings.applicationUpdates}
                      onChange={(e) => handleSettingChange('applicationUpdates', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="preference-item">
                  <div className="preference-info">
                    <span className="preference-name">Payment Reminders</span>
                    <span className="preference-desc">Rent and fee payment notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailSettings.paymentReminders}
                      onChange={(e) => handleSettingChange('paymentReminders', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="preference-item">
                  <div className="preference-info">
                    <span className="preference-name">Maintenance Updates</span>
                    <span className="preference-desc">Service request status updates</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailSettings.maintenanceUpdates}
                      onChange={(e) => handleSettingChange('maintenanceUpdates', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="preference-item">
                  <div className="preference-info">
                    <span className="preference-name">Instant Alerts</span>
                    <span className="preference-desc">Urgent notifications and updates</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailSettings.instantAlerts}
                      onChange={(e) => handleSettingChange('instantAlerts', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="preference-category">
              <h3>🏘️ Community</h3>
              <div className="preference-items">
                <div className="preference-item">
                  <div className="preference-info">
                    <span className="preference-name">Community Events</span>
                    <span className="preference-desc">Invitations to building events</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailSettings.communityEvents}
                      onChange={(e) => handleSettingChange('communityEvents', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="preference-item">
                  <div className="preference-info">
                    <span className="preference-name">Newsletters</span>
                    <span className="preference-desc">Monthly community newsletters</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailSettings.newsletters}
                      onChange={(e) => handleSettingChange('newsletters', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="preference-item">
                  <div className="preference-info">
                    <span className="preference-name">Weekly Digest</span>
                    <span className="preference-desc">Summary of weekly activity</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailSettings.weeklyDigest}
                      onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="preference-category">
              <h3>📢 Marketing</h3>
              <div className="preference-items">
                <div className="preference-item">
                  <div className="preference-info">
                    <span className="preference-name">Promotional Offers</span>
                    <span className="preference-desc">Special deals and discounts</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailSettings.promotions}
                      onChange={(e) => handleSettingChange('promotions', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="preference-item">
                  <div className="preference-info">
                    <span className="preference-name">Marketing Emails</span>
                    <span className="preference-desc">Product updates and features</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailSettings.marketingEmails}
                      onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="section-actions">
            <button 
              className="save-btn"
              onClick={saveEmailSettings}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Email Templates */}
        <div className="email-section">
          <div className="section-header">
            <h2>Email Templates</h2>
            <p>Manage automated email templates and their performance</p>
          </div>
          
          <div className="templates-grid">
            {emailTemplates.map(template => (
              <div 
                key={template.id} 
                className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="template-header">
                  <div className="template-info">
                    <h4>{template.name}</h4>
                    <span className={`template-status ${template.status}`}>
                      {template.status}
                    </span>
                  </div>
                  
                  <div className="template-actions">
                    <button className="action-btn edit-btn" title="Edit template">
                      ✏️
                    </button>
                    <button 
                      className="action-btn preview-btn" 
                      title="Preview template"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewMode(true);
                        setSelectedTemplate(template);
                      }}
                    >
                      👁️
                    </button>
                  </div>
                </div>
                
                <div className="template-subject">
                  {template.subject}
                </div>
                
                <div className="template-description">
                  {template.description}
                </div>
                
                <div className="template-stats">
                  <div className="stat-item">
                    <span className="stat-label">Open Rate</span>
                    <span className="stat-value">{template.openRate}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Click Rate</span>
                    <span className="stat-value">{template.clickRate}%</span>
                  </div>
                </div>
                
                <div className="template-footer">
                  <span className="last-modified">
                    Modified {formatTimestamp(template.lastModified)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email History */}
        <div className="email-section">
          <div className="section-header">
            <h2>Recent Email Activity</h2>
            <p>Track delivery status and engagement metrics</p>
          </div>
          
          <div className="email-history">
            <div className="history-header">
              <div className="history-filters">
                <button className="filter-btn active">All Emails</button>
                <button className="filter-btn">Delivered</button>
                <button className="filter-btn">Opened</button>
                <button className="filter-btn">Clicked</button>
                <button className="filter-btn">Bounced</button>
              </div>
              
              <div className="history-search">
                <input 
                  type="text" 
                  placeholder="Search emails..."
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>
            
            <div className="history-list">
              {emailHistory.map(email => (
                <div key={email.id} className="history-item">
                  <div className="email-status">
                    <span 
                      className="status-icon"
                      style={{ color: getStatusColor(email.status) }}
                    >
                      {getStatusIcon(email.status)}
                    </span>
                  </div>
                  
                  <div className="email-details">
                    <div className="email-subject">{email.subject}</div>
                    <div className="email-recipient">To: {email.recipient}</div>
                    <div className="email-template">Template: {email.template}</div>
                  </div>
                  
                  <div className="email-metrics">
                    <div className="metric-item">
                      <span className="metric-icon">📤</span>
                      <span className="metric-label">Sent</span>
                      <span className="metric-time">{formatTimestamp(email.sentAt)}</span>
                    </div>
                    
                    {email.opened && (
                      <div className="metric-item">
                        <span className="metric-icon">👁️</span>
                        <span className="metric-label">Opened</span>
                        <span className="metric-time">{formatTimestamp(email.openedAt)}</span>
                      </div>
                    )}
                    
                    {email.clicked && (
                      <div className="metric-item">
                        <span className="metric-icon">🖱️</span>
                        <span className="metric-label">Clicked</span>
                        <span className="metric-time">{formatTimestamp(email.clickedAt)}</span>
                      </div>
                    )}
                    
                    {email.status === 'bounced' && (
                      <div className="metric-item error">
                        <span className="metric-icon">⚠️</span>
                        <span className="metric-label">{email.bounceReason}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="email-actions">
                    <button className="action-btn view-btn" title="View details">
                      👁️
                    </button>
                    <button className="action-btn resend-btn" title="Resend email">
                      🔄
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Email Template Preview Modal */}
      {previewMode && selectedTemplate && (
        <div className="preview-modal-overlay" onClick={() => setPreviewMode(false)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>Template Preview: {selectedTemplate.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setPreviewMode(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="preview-content">
              <div className="preview-subject">
                <strong>Subject:</strong> {selectedTemplate.subject}
              </div>
              
              <div 
                className="preview-body"
                dangerouslySetInnerHTML={{ 
                  __html: getTemplateContent(selectedTemplate.id).content 
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailIntegration;