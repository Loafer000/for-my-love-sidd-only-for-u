import React, { useState, useEffect } from 'react';
import IntegrationHub from './IntegrationHub';
import AutomationBuilder from './AutomationBuilder';
import PWAManager from '../PWA/PWAManager';
import MobileOptimizer from '../PWA/MobileOptimizer';
import './IntegrationManager.css';

const IntegrationManager = () => {
  const [activeView, setActiveView] = useState('hub');
  const [mobileOptimized, setMobileOptimized] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('online');
  const [systemStats, setSystemStats] = useState({
    totalIntegrations: 8,
    activeIntegrations: 5,
    totalAutomations: 4,
    activeAutomations: 3,
    webhooksActive: 3,
    lastSyncTime: new Date()
  });

  useEffect(() => {
    // Initialize PWA and mobile optimization
    initializeSystemOptimization();
    
    // Monitor network status
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  const initializeSystemOptimization = async () => {
    try {
      // Initialize mobile optimizer
      if (window.MobileOptimizer) {
        const optimizer = window.MobileOptimizer;
        await optimizer.initialize();
        setMobileOptimized(true);
      }

      // Check PWA installation status
      if (window.PWAManager) {
        const pwaManager = window.PWAManager;
        const isInstalled = await pwaManager.isInstalled();
        setPwaInstalled(isInstalled);
      }

      // Enable performance monitoring
      enablePerformanceMonitoring();
      
    } catch (error) {
      console.error('Failed to initialize system optimization:', error);
    }
  };

  const enablePerformanceMonitoring = () => {
    // Monitor performance metrics
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            console.log('Navigation timing:', {
              loadTime: entry.loadEventEnd - entry.loadEventStart,
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              firstPaint: entry.loadEventEnd - entry.fetchStart
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    
    // Use haptic feedback if available
    if (window.MobileOptimizer && window.MobileOptimizer.hapticFeedback) {
      window.MobileOptimizer.hapticFeedback('light');
    }
  };

  const refreshSystemStats = async () => {
    try {
      // Simulate API call to refresh stats
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSystemStats(prev => ({
        ...prev,
        lastSyncTime: new Date()
      }));
      
      showNotification('System stats refreshed', 'success');
    } catch (error) {
      showNotification('Failed to refresh stats', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    if (window.PWAManager && window.PWAManager.showNotification) {
      window.PWAManager.showNotification(message, type);
    } else {
      // Fallback to console or simple alert
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  };

  const exportIntegrationData = async () => {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        systemStats,
        integrations: [], // Would fetch from API
        automations: [], // Would fetch from API
        webhooks: [] // Would fetch from API
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `connectspace-integrations-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification('Integration data exported successfully', 'success');
    } catch (error) {
      showNotification('Failed to export integration data', 'error');
    }
  };

  const syncAllIntegrations = async () => {
    try {
      showNotification('Starting sync for all integrations...', 'info');
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setSystemStats(prev => ({
        ...prev,
        lastSyncTime: new Date()
      }));
      
      showNotification('All integrations synced successfully', 'success');
    } catch (error) {
      showNotification('Failed to sync integrations', 'error');
    }
  };

  const renderSystemOverview = () => (
    <div className="system-overview">
      <div className="overview-header">
        <h2>System Overview</h2>
        <div className="header-actions">
          <button className="refresh-btn" onClick={refreshSystemStats}>
            🔄 Refresh
          </button>
          <button className="export-btn" onClick={exportIntegrationData}>
            📥 Export Data
          </button>
          <button className="sync-btn" onClick={syncAllIntegrations}>
            🔗 Sync All
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <h3>{systemStats.activeIntegrations}/{systemStats.totalIntegrations}</h3>
            <p>Active Integrations</p>
          </div>
          <div className="stat-trend positive">+2 this week</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{systemStats.activeAutomations}/{systemStats.totalAutomations}</h3>
            <p>Active Automations</p>
          </div>
          <div className="stat-trend positive">+1 this week</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <h3>{systemStats.webhooksActive}</h3>
            <p>Webhooks Active</p>
          </div>
          <div className="stat-trend neutral">No change</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <h3>{mobileOptimized ? 'Enabled' : 'Disabled'}</h3>
            <p>Mobile Optimization</p>
          </div>
          <div className="stat-indicator">
            <div className={`status-dot ${mobileOptimized ? 'active' : 'inactive'}`}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <h3>{pwaInstalled ? 'Installed' : 'Available'}</h3>
            <p>PWA Status</p>
          </div>
          <div className="stat-indicator">
            <div className={`status-dot ${pwaInstalled ? 'active' : 'warning'}`}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-content">
            <h3>{networkStatus}</h3>
            <p>Network Status</p>
          </div>
          <div className="stat-indicator">
            <div className={`status-dot ${networkStatus === 'online' ? 'active' : 'error'}`}></div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🔗</div>
            <div className="activity-content">
              <p><strong>MLS Integration</strong> synced successfully</p>
              <span className="activity-time">2 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">⚡</div>
            <div className="activity-content">
              <p><strong>New Lead Welcome</strong> automation triggered</p>
              <span className="activity-time">5 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📧</div>
            <div className="activity-content">
              <p><strong>Email Service</strong> sent 15 notifications</p>
              <span className="activity-time">8 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💳</div>
            <div className="activity-content">
              <p><strong>Payment Gateway</strong> processed 3 transactions</p>
              <span className="activity-time">12 minutes ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="system-health">
        <h3>System Health</h3>
        <div className="health-metrics">
          <div className="health-item">
            <span className="health-label">API Response Time</span>
            <div className="health-bar">
              <div className="health-fill" style={{ width: '85%' }}></div>
            </div>
            <span className="health-value">245ms</span>
          </div>
          <div className="health-item">
            <span className="health-label">Integration Uptime</span>
            <div className="health-bar">
              <div className="health-fill" style={{ width: '99%' }}></div>
            </div>
            <span className="health-value">99.2%</span>
          </div>
          <div className="health-item">
            <span className="health-label">Automation Success Rate</span>
            <div className="health-bar">
              <div className="health-fill" style={{ width: '96%' }}></div>
            </div>
            <span className="health-value">96.8%</span>
          </div>
          <div className="health-item">
            <span className="health-label">Webhook Delivery</span>
            <div className="health-bar">
              <div className="health-fill" style={{ width: '98%' }}></div>
            </div>
            <span className="health-value">98.5%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeView) {
      case 'hub':
        return <IntegrationHub />;
      case 'builder':
        return <AutomationBuilder />;
      case 'overview':
        return renderSystemOverview();
      default:
        return <IntegrationHub />;
    }
  };

  return (
    <div className="integration-manager">
      {/* PWA Manager Component */}
      <PWAManager />
      
      {/* Mobile Optimizer Component */}
      <MobileOptimizer />
      
      {/* Main Navigation */}
      <div className="integration-nav-bar">
        <div className="nav-brand">
          <h1>ConnectSpace Integration Hub</h1>
          <p>Week 8: Integration & Automation + Mobile PWA Features</p>
        </div>
        
        <div className="nav-menu">
          <button
            className={`nav-btn ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => handleViewChange('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`nav-btn ${activeView === 'hub' ? 'active' : ''}`}
            onClick={() => handleViewChange('hub')}
          >
            🔗 Integrations
          </button>
          <button
            className={`nav-btn ${activeView === 'builder' ? 'active' : ''}`}
            onClick={() => handleViewChange('builder')}
          >
            ⚡ Automation Builder
          </button>
        </div>
        
        <div className="nav-status">
          <div className={`connection-status ${networkStatus}`}>
            <div className="status-indicator"></div>
            <span>{networkStatus}</span>
          </div>
          <div className="last-sync">
            Last sync: {systemStats.lastSyncTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="integration-content">
        {renderMainContent()}
      </div>

      {/* Footer Info */}
      <div className="integration-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Integration Features</h4>
            <ul>
              <li>✅ MLS Property Sync</li>
              <li>✅ CRM Integration</li>
              <li>✅ Payment Processing</li>
              <li>✅ Email/SMS Automation</li>
              <li>✅ Calendar Sync</li>
              <li>✅ Webhook Management</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>PWA Features</h4>
            <ul>
              <li>✅ Offline Functionality</li>
              <li>✅ Push Notifications</li>
              <li>✅ Background Sync</li>
              <li>✅ App Installation</li>
              <li>✅ Mobile Optimization</li>
              <li>✅ Performance Monitoring</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Automation Capabilities</h4>
            <ul>
              <li>✅ Lead Management</li>
              <li>✅ Property Updates</li>
              <li>✅ Maintenance Workflows</li>
              <li>✅ Payment Processing</li>
              <li>✅ Communication Auto</li>
              <li>✅ Report Generation</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 ConnectSpace - Advanced Real Estate Platform with Complete Integration & PWA Support</p>
          <p>Week 8: Integration & Automation + Week 5: Mobile Optimization & PWA Features</p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationManager;