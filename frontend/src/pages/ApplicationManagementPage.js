import React, { useState } from 'react';
import ApplicationForm from '../components/Applications/ApplicationForm';
import ApplicationDashboard from '../components/Applications/ApplicationDashboard';
import LeaseManagement from '../components/Applications/LeaseManagement';
import './ApplicationManagementPage.css';

const ApplicationManagementPage = () => {
  const [activeTab, setActiveTab] = useState('application-form');

  const tabs = [
    {
      id: 'application-form',
      label: 'Application Form',
      icon: '📝',
      description: 'Comprehensive rental application system'
    },
    {
      id: 'application-dashboard',
      label: 'Application Management',
      icon: '📊',
      description: 'Review and manage applications'
    },
    {
      id: 'lease-management',
      label: 'Lease Management',
      icon: '📋',
      description: 'Active leases and renewals'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'application-form':
        return <ApplicationForm />;
      case 'application-dashboard':
        return <ApplicationDashboard />;
      case 'lease-management':
        return <LeaseManagement />;
      default:
        return <ApplicationForm />;
    }
  };

  return (
    <div className="application-management-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Application & Lease Management</h1>
          <p>Streamline your rental process from application to lease management</p>
          
          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-icon">📋</div>
              <div className="stat-details">
                <span className="stat-number">127</span>
                <span className="stat-label">Total Applications</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">✅</div>
              <div className="stat-details">
                <span className="stat-number">89</span>
                <span className="stat-label">Approved</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">🏠</div>
              <div className="stat-details">
                <span className="stat-number">45</span>
                <span className="stat-label">Active Leases</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">🔄</div>
              <div className="stat-details">
                <span className="stat-number">8</span>
                <span className="stat-label">Renewals Due</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="management-navigation">
        <div className="nav-container">
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <div className="tab-content">
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-description">{tab.description}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="nav-indicator">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="management-content">
        {renderContent()}
      </div>

      {/* Feature Highlights */}
      <div className="feature-highlights">
        <div className="highlights-container">
          <h2>Week 3: Application & Lease Management System</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Smart Application Form</h3>
              <p>Multi-step application process with document upload, validation, and automated scoring</p>
              <ul className="feature-list">
                <li>7-step guided application process</li>
                <li>Document upload with progress tracking</li>
                <li>Real-time form validation</li>
                <li>Automated application scoring</li>
                <li>Mobile-responsive design</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Application Dashboard</h3>
              <p>Comprehensive application management with status tracking and detailed applicant reviews</p>
              <ul className="feature-list">
                <li>Real-time application status updates</li>
                <li>Advanced filtering and search</li>
                <li>Detailed applicant profiles</li>
                <li>Document verification system</li>
                <li>Automated notifications</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Lease Management</h3>
              <p>Complete lease lifecycle management from signing to renewal with payment tracking</p>
              <ul className="feature-list">
                <li>Active lease monitoring</li>
                <li>Payment history tracking</li>
                <li>Renewal notifications</li>
                <li>Document management</li>
                <li>Maintenance request integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Process Flow */}
      <div className="process-flow">
        <div className="flow-container">
          <h3>Complete Application to Lease Workflow</h3>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="step-icon">1</div>
              <div className="step-content">
                <h4>Application Submission</h4>
                <p>Tenant completes comprehensive 7-step application with documents</p>
              </div>
            </div>
            
            <div className="flow-arrow">→</div>
            
            <div className="flow-step">
              <div className="step-icon">2</div>
              <div className="step-content">
                <h4>Application Review</h4>
                <p>Automated scoring and manual review by property managers</p>
              </div>
            </div>
            
            <div className="flow-arrow">→</div>
            
            <div className="flow-step">
              <div className="step-icon">3</div>
              <div className="step-content">
                <h4>Approval & Lease Creation</h4>
                <p>Generate lease agreement and move to lease management system</p>
              </div>
            </div>
            
            <div className="flow-arrow">→</div>
            
            <div className="flow-step">
              <div className="step-icon">4</div>
              <div className="step-content">
                <h4>Active Lease Management</h4>
                <p>Track payments, renewals, and maintenance throughout lease term</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Status */}
      <div className="implementation-status">
        <div className="status-container">
          <h3>Week 3 Implementation Progress</h3>
          <div className="status-grid">
            <div className="status-item completed">
              <div className="status-indicator">✅</div>
              <div className="status-content">
                <h4>Application Form System</h4>
                <p>Multi-step form with validation, document upload, and submission</p>
                <div className="status-features">
                  <span>Personal Info</span>
                  <span>Housing History</span>
                  <span>Employment</span>
                  <span>Financial Info</span>
                  <span>References</span>
                  <span>Documents</span>
                  <span>Review & Submit</span>
                </div>
              </div>
            </div>
            
            <div className="status-item completed">
              <div className="status-indicator">✅</div>
              <div className="status-content">
                <h4>Application Management Dashboard</h4>
                <p>Comprehensive application tracking and management interface</p>
                <div className="status-features">
                  <span>Status Tracking</span>
                  <span>Applicant Profiles</span>
                  <span>Document Review</span>
                  <span>Filtering & Search</span>
                  <span>Status Updates</span>
                </div>
              </div>
            </div>
            
            <div className="status-item completed">
              <div className="status-indicator">✅</div>
              <div className="status-content">
                <h4>Lease Management System</h4>
                <p>Complete lease lifecycle management with payment tracking</p>
                <div className="status-features">
                  <span>Active Leases</span>
                  <span>Payment History</span>
                  <span>Renewal Management</span>
                  <span>Document Storage</span>
                  <span>Status Monitoring</span>
                </div>
              </div>
            </div>
            
            <div className="status-item next">
              <div className="status-indicator">📋</div>
              <div className="status-content">
                <h4>Integration & Testing</h4>
                <p>Next: Connect systems with property listings and payment processing</p>
                <div className="status-features">
                  <span>API Integration</span>
                  <span>Payment Gateway</span>
                  <span>Email Notifications</span>
                  <span>Reporting System</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Streamline Your Rental Process</h2>
          <p>From application to lease management, our comprehensive system handles it all</p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={() => setActiveTab('application-form')}>
              Try Application Form
            </button>
            <button className="cta-btn secondary" onClick={() => setActiveTab('application-dashboard')}>
              View Dashboard
            </button>
            <button className="cta-btn secondary" onClick={() => setActiveTab('lease-management')}>
              Manage Leases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationManagementPage;