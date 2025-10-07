import React, { useState, useEffect } from 'react';
import './IntegrationHub.css';

const IntegrationHub = () => {
  const [integrations, setIntegrations] = useState({});
  const [activeIntegrations, setActiveIntegrations] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [apiKeys, setApiKeys] = useState({});
  const [syncStatus, setSyncStatus] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock integration data
  const mockIntegrationsData = {
    integrations: {
      mls: {
        id: 'mls',
        name: 'MLS Integration',
        description: 'Sync property listings with Multiple Listing Service',
        icon: '🏘️',
        status: 'connected',
        category: 'listings',
        features: ['Property Sync', 'Price Updates', 'Status Changes', 'Media Sync'],
        lastSync: new Date('2024-10-28T10:30:00'),
        syncFrequency: 'hourly',
        recordsCount: 15420,
        config: {
          mlsId: 'MLS-12345',
          apiEndpoint: 'https://api.mls.com/v2',
          syncFields: ['price', 'status', 'description', 'images'],
          autoSync: true
        }
      },
      crm: {
        id: 'crm',
        name: 'CRM System',
        description: 'Customer relationship management integration',
        icon: '👥',
        status: 'connected',
        category: 'customers',
        features: ['Contact Sync', 'Lead Management', 'Pipeline Tracking', 'Communication History'],
        lastSync: new Date('2024-10-28T11:15:00'),
        syncFrequency: 'real-time',
        recordsCount: 3847,
        config: {
          crmType: 'salesforce',
          apiKey: 'sf_api_key_***',
          webhookUrl: 'https://connectspace.com/webhooks/crm',
          syncDirection: 'bidirectional'
        }
      },
      paymentGateway: {
        id: 'paymentGateway',
        name: 'Payment Gateway',
        description: 'Process rental payments and security deposits',
        icon: '💳',
        status: 'connected',
        category: 'payments',
        features: ['Rent Collection', 'Security Deposits', 'Recurring Payments', 'Refunds'],
        lastSync: new Date('2024-10-28T12:00:00'),
        syncFrequency: 'real-time',
        recordsCount: 892,
        config: {
          provider: 'stripe',
          publicKey: 'pk_live_***',
          webhookSecret: 'whsec_***',
          currency: 'USD'
        }
      },
      emailService: {
        id: 'emailService',
        name: 'Email Service',
        description: 'Automated email communications and notifications',
        icon: '📧',
        status: 'connected',
        category: 'communications',
        features: ['Transactional Emails', 'Marketing Campaigns', 'Templates', 'Analytics'],
        lastSync: new Date('2024-10-28T12:30:00'),
        syncFrequency: 'real-time',
        recordsCount: 5203,
        config: {
          provider: 'sendgrid',
          apiKey: 'sg_api_key_***',
          fromEmail: 'noreply@connectspace.com',
          templates: ['welcome', 'property_inquiry', 'lease_reminder']
        }
      },
      smsService: {
        id: 'smsService',
        name: 'SMS Service',
        description: 'Text message notifications and alerts',
        icon: '📱',
        status: 'connected',
        category: 'communications',
        features: ['SMS Notifications', 'Two-Factor Auth', 'Bulk Messaging', 'Delivery Reports'],
        lastSync: new Date('2024-10-28T13:00:00'),
        syncFrequency: 'real-time',
        recordsCount: 1567,
        config: {
          provider: 'twilio',
          accountSid: 'AC***',
          authToken: 'auth_token_***',
          phoneNumber: '+1234567890'
        }
      },
      accountingSoftware: {
        id: 'accountingSoftware',
        name: 'Accounting Software',
        description: 'Sync financial data with accounting systems',
        icon: '📊',
        status: 'pending',
        category: 'finance',
        features: ['Invoice Sync', 'Expense Tracking', 'Tax Reports', 'Financial Analytics'],
        lastSync: null,
        syncFrequency: 'daily',
        recordsCount: 0,
        config: {}
      },
      maintenanceApp: {
        id: 'maintenanceApp',
        name: 'Maintenance Management',
        description: 'Connect with maintenance service providers',
        icon: '🔧',
        status: 'disconnected',
        category: 'maintenance',
        features: ['Work Order Sync', 'Vendor Management', 'Cost Tracking', 'Status Updates'],
        lastSync: null,
        syncFrequency: 'real-time',
        recordsCount: 0,
        config: {}
      },
      calendarSync: {
        id: 'calendarSync',
        name: 'Calendar Integration',
        description: 'Sync appointments and showings with calendar apps',
        icon: '📅',
        status: 'connected',
        category: 'scheduling',
        features: ['Appointment Sync', 'Showing Schedules', 'Reminders', 'Availability'],
        lastSync: new Date('2024-10-28T14:00:00'),
        syncFrequency: 'real-time',
        recordsCount: 234,
        config: {
          provider: 'google',
          calendarId: 'primary',
          timeZone: 'America/New_York'
        }
      }
    },
    automations: [
      {
        id: 'auto_001',
        name: 'New Lead Welcome Sequence',
        description: 'Automatically send welcome emails to new leads',
        trigger: 'new_lead_created',
        actions: ['send_welcome_email', 'create_crm_contact', 'assign_to_agent'],
        status: 'active',
        runsCount: 1247,
        successRate: 98.5,
        lastRun: new Date('2024-10-28T15:30:00')
      },
      {
        id: 'auto_002',
        name: 'Property Price Alert',
        description: 'Notify interested users when property prices change',
        trigger: 'property_price_updated',
        actions: ['send_price_alert', 'update_saved_searches', 'log_price_change'],
        status: 'active',
        runsCount: 456,
        successRate: 96.2,
        lastRun: new Date('2024-10-28T16:15:00')
      },
      {
        id: 'auto_003',
        name: 'Maintenance Request Follow-up',
        description: 'Follow up on maintenance requests after 24 hours',
        trigger: 'maintenance_request_created',
        actions: ['schedule_followup', 'notify_maintenance_team', 'update_tenant'],
        status: 'active',
        runsCount: 89,
        successRate: 94.7,
        lastRun: new Date('2024-10-28T17:00:00')
      },
      {
        id: 'auto_004',
        name: 'Lease Expiration Reminder',
        description: 'Send reminders 60 and 30 days before lease expiration',
        trigger: 'lease_expiration_approaching',
        actions: ['send_expiration_notice', 'update_lease_status', 'create_renewal_task'],
        status: 'paused',
        runsCount: 23,
        successRate: 100,
        lastRun: new Date('2024-10-25T09:00:00')
      }
    ],
    webhooks: [
      {
        id: 'webhook_001',
        name: 'MLS Property Updates',
        url: 'https://connectspace.com/webhooks/mls/property-update',
        events: ['property.created', 'property.updated', 'property.deleted'],
        status: 'active',
        lastTriggered: new Date('2024-10-28T16:45:00'),
        totalCalls: 15420,
        successRate: 99.1
      },
      {
        id: 'webhook_002',
        name: 'Payment Processing',
        url: 'https://connectspace.com/webhooks/payment/processed',
        events: ['payment.succeeded', 'payment.failed', 'payment.refunded'],
        status: 'active',
        lastTriggered: new Date('2024-10-28T17:30:00'),
        totalCalls: 892,
        successRate: 98.8
      },
      {
        id: 'webhook_003',
        name: 'CRM Contact Sync',
        url: 'https://connectspace.com/webhooks/crm/contact-sync',
        events: ['contact.created', 'contact.updated', 'deal.updated'],
        status: 'active',
        lastTriggered: new Date('2024-10-28T18:00:00'),
        totalCalls: 3847,
        successRate: 97.5
      }
    ]
  };

  const categories = [
    { id: 'all', label: 'All Integrations', icon: '🔗' },
    { id: 'listings', label: 'Property Listings', icon: '🏠' },
    { id: 'customers', label: 'Customer Management', icon: '👥' },
    { id: 'payments', label: 'Payments & Finance', icon: '💳' },
    { id: 'communications', label: 'Communications', icon: '📧' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'scheduling', label: 'Scheduling', icon: '📅' },
    { id: 'finance', label: 'Accounting', icon: '📊' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('integrations');

  useEffect(() => {
    loadIntegrationData();
  }, []);

  const loadIntegrationData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIntegrations(mockIntegrationsData.integrations);
      setActiveIntegrations(Object.keys(mockIntegrationsData.integrations).filter(
        key => mockIntegrationsData.integrations[key].status === 'connected'
      ));
      setAutomations(mockIntegrationsData.automations);
      setWebhooks(mockIntegrationsData.webhooks);
    } catch (error) {
      console.error('Failed to load integration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIntegrations = Object.values(integrations).filter(integration => 
    selectedCategory === 'all' || integration.category === selectedCategory
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'disconnected': return '#ef4444';
      case 'active': return '#10b981';
      case 'paused': return '#6b7280';
      case 'error': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  const formatLastSync = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const connectIntegration = async (integrationId) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => ({
        ...prev,
        [integrationId]: {
          ...prev[integrationId],
          status: 'connected',
          lastSync: new Date()
        }
      }));
      
      setActiveIntegrations(prev => [...prev, integrationId]);
      showToast(`${integrations[integrationId].name} connected successfully!`, 'success');
    } catch (error) {
      showToast('Failed to connect integration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const disconnectIntegration = async (integrationId) => {
    if (!window.confirm('Are you sure you want to disconnect this integration?')) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prev => ({
        ...prev,
        [integrationId]: {
          ...prev[integrationId],
          status: 'disconnected',
          lastSync: null
        }
      }));
      
      setActiveIntegrations(prev => prev.filter(id => id !== integrationId));
      showToast(`${integrations[integrationId].name} disconnected`, 'info');
    } catch (error) {
      showToast('Failed to disconnect integration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const syncIntegration = async (integrationId) => {
    setSyncStatus(prev => ({ ...prev, [integrationId]: 'syncing' }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIntegrations(prev => ({
        ...prev,
        [integrationId]: {
          ...prev[integrationId],
          lastSync: new Date()
        }
      }));
      
      setSyncStatus(prev => ({ ...prev, [integrationId]: 'success' }));
      showToast(`${integrations[integrationId].name} synced successfully!`, 'success');
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, [integrationId]: 'error' }));
      showToast('Sync failed', 'error');
    }

    setTimeout(() => {
      setSyncStatus(prev => ({ ...prev, [integrationId]: null }));
    }, 3000);
  };

  const toggleAutomation = async (automationId) => {
    const automation = automations.find(a => a.id === automationId);
    const newStatus = automation.status === 'active' ? 'paused' : 'active';
    
    try {
      setAutomations(prev => prev.map(a => 
        a.id === automationId ? { ...a, status: newStatus } : a
      ));
      
      showToast(`Automation ${newStatus}`, 'success');
    } catch (error) {
      showToast('Failed to update automation', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    // Toast implementation would go here
    console.log(`Toast: ${type} - ${message}`);
  };

  const renderIntegrations = () => (
    <div className="integrations-grid">
      {filteredIntegrations.map(integration => (
        <div key={integration.id} className="integration-card">
          <div className="integration-header">
            <div className="integration-icon">{integration.icon}</div>
            <div className="integration-info">
              <h3>{integration.name}</h3>
              <p>{integration.description}</p>
            </div>
            <div 
              className="integration-status"
              style={{ color: getStatusColor(integration.status) }}
            >
              <div className="status-dot" style={{ backgroundColor: getStatusColor(integration.status) }}></div>
              {integration.status}
            </div>
          </div>
          
          <div className="integration-features">
            {integration.features.map((feature, index) => (
              <span key={index} className="feature-tag">{feature}</span>
            ))}
          </div>
          
          <div className="integration-stats">
            <div className="stat">
              <span className="stat-value">{integration.recordsCount.toLocaleString()}</span>
              <span className="stat-label">Records</span>
            </div>
            <div className="stat">
              <span className="stat-value">{formatLastSync(integration.lastSync)}</span>
              <span className="stat-label">Last Sync</span>
            </div>
            <div className="stat">
              <span className="stat-value">{integration.syncFrequency}</span>
              <span className="stat-label">Frequency</span>
            </div>
          </div>
          
          <div className="integration-actions">
            {integration.status === 'connected' ? (
              <>
                <button 
                  className="sync-btn"
                  onClick={() => syncIntegration(integration.id)}
                  disabled={syncStatus[integration.id] === 'syncing'}
                >
                  {syncStatus[integration.id] === 'syncing' ? (
                    <>🔄 Syncing...</>
                  ) : (
                    '🔄 Sync Now'
                  )}
                </button>
                <button className="config-btn">⚙️ Configure</button>
                <button 
                  className="disconnect-btn"
                  onClick={() => disconnectIntegration(integration.id)}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button 
                className="connect-btn"
                onClick={() => connectIntegration(integration.id)}
                disabled={loading}
              >
                {integration.status === 'pending' ? 'Complete Setup' : 'Connect'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAutomations = () => (
    <div className="automations-list">
      {automations.map(automation => (
        <div key={automation.id} className="automation-card">
          <div className="automation-header">
            <div className="automation-info">
              <h3>{automation.name}</h3>
              <p>{automation.description}</p>
            </div>
            <div className="automation-toggle">
              <label className="switch">
                <input 
                  type="checkbox"
                  checked={automation.status === 'active'}
                  onChange={() => toggleAutomation(automation.id)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          
          <div className="automation-details">
            <div className="automation-flow">
              <div className="trigger">
                <span className="flow-label">Trigger</span>
                <span className="flow-value">{automation.trigger}</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="actions">
                <span className="flow-label">Actions</span>
                <div className="action-list">
                  {automation.actions.map((action, index) => (
                    <span key={index} className="action-tag">{action}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="automation-stats">
              <div className="stat">
                <span className="stat-value">{automation.runsCount}</span>
                <span className="stat-label">Total Runs</span>
              </div>
              <div className="stat">
                <span className="stat-value">{automation.successRate}%</span>
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat">
                <span className="stat-value">{formatLastSync(automation.lastRun)}</span>
                <span className="stat-label">Last Run</span>
              </div>
            </div>
          </div>
          
          <div className="automation-actions">
            <button className="edit-btn">✏️ Edit</button>
            <button className="test-btn">🧪 Test</button>
            <button className="logs-btn">📊 View Logs</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWebhooks = () => (
    <div className="webhooks-list">
      {webhooks.map(webhook => (
        <div key={webhook.id} className="webhook-card">
          <div className="webhook-header">
            <div className="webhook-info">
              <h3>{webhook.name}</h3>
              <code className="webhook-url">{webhook.url}</code>
            </div>
            <div 
              className="webhook-status"
              style={{ color: getStatusColor(webhook.status) }}
            >
              <div className="status-dot" style={{ backgroundColor: getStatusColor(webhook.status) }}></div>
              {webhook.status}
            </div>
          </div>
          
          <div className="webhook-events">
            <span className="events-label">Events:</span>
            {webhook.events.map((event, index) => (
              <span key={index} className="event-tag">{event}</span>
            ))}
          </div>
          
          <div className="webhook-stats">
            <div className="stat">
              <span className="stat-value">{webhook.totalCalls.toLocaleString()}</span>
              <span className="stat-label">Total Calls</span>
            </div>
            <div className="stat">
              <span className="stat-value">{webhook.successRate}%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat">
              <span className="stat-value">{formatLastSync(webhook.lastTriggered)}</span>
              <span className="stat-label">Last Triggered</span>
            </div>
          </div>
          
          <div className="webhook-actions">
            <button className="test-btn">🧪 Test</button>
            <button className="logs-btn">📊 Logs</button>
            <button className="edit-btn">✏️ Edit</button>
            <button className="delete-btn">🗑️ Delete</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="integration-hub">
      <div className="integration-header">
        <div className="header-content">
          <h1>Integration & Automation Hub</h1>
          <p>Connect external services and automate your workflows</p>
        </div>
        
        <div className="header-actions">
          <button className="add-integration-btn">+ Add Integration</button>
          <button className="create-automation-btn">+ Create Automation</button>
        </div>
      </div>

      <div className="integration-nav">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            🔗 Integrations ({Object.keys(integrations).length})
          </button>
          <button 
            className={`nav-tab ${activeTab === 'automations' ? 'active' : ''}`}
            onClick={() => setActiveTab('automations')}
          >
            ⚡ Automations ({automations.length})
          </button>
          <button 
            className={`nav-tab ${activeTab === 'webhooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('webhooks')}
          >
            🔗 Webhooks ({webhooks.length})
          </button>
        </div>
        
        {activeTab === 'integrations' && (
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="integration-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading integrations...</p>
          </div>
        ) : (
          <>
            {activeTab === 'integrations' && renderIntegrations()}
            {activeTab === 'automations' && renderAutomations()}
            {activeTab === 'webhooks' && renderWebhooks()}
          </>
        )}
      </div>
    </div>
  );
};

export default IntegrationHub;