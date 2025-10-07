import React, { useState, useEffect } from 'react';
import './TenantTools.css';

const TenantTools = ({ tenantId }) => {
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState({});

  // Mock tenant tools data
  const mockToolsData = {
    rentTracker: {
      currentMonth: {
        amount: 2250,
        dueDate: new Date('2024-11-01'),
        status: 'pending',
        daysLeft: 3
      },
      paymentHistory: [
        {
          month: 'October 2024',
          amount: 2250,
          paidDate: new Date('2024-10-01'),
          status: 'paid',
          method: 'Bank Transfer',
          confirmation: 'TXN-2024-10-001'
        },
        {
          month: 'September 2024',
          amount: 2250,
          paidDate: new Date('2024-09-01'),
          status: 'paid',
          method: 'Bank Transfer',
          confirmation: 'TXN-2024-09-001'
        },
        {
          month: 'August 2024',
          amount: 2250,
          paidDate: new Date('2024-08-01'),
          status: 'paid',
          method: 'Bank Transfer',
          confirmation: 'TXN-2024-08-001'
        }
      ],
      upcomingPayments: [
        {
          month: 'November 2024',
          amount: 2250,
          dueDate: new Date('2024-11-01'),
          status: 'pending'
        },
        {
          month: 'December 2024',
          amount: 2250,
          dueDate: new Date('2024-12-01'),
          status: 'scheduled'
        }
      ],
      autoPaySettings: {
        enabled: true,
        bankAccount: '**** 1234',
        amount: 2250,
        dayOfMonth: 1
      }
    },
    maintenanceManager: {
      activeRequests: [
        {
          id: 'MAINT-2024-001',
          title: 'Kitchen Faucet Leak',
          category: 'Plumbing',
          priority: 'Medium',
          status: 'In Progress',
          submittedDate: new Date('2024-10-02'),
          description: 'Small leak under kitchen sink faucet, water dripping constantly',
          images: ['faucet1.jpg', 'faucet2.jpg'],
          assignedTo: 'Mike Johnson - Plumber',
          estimatedCompletion: new Date('2024-10-04'),
          updates: [
            {
              date: new Date('2024-10-03'),
              message: 'Parts ordered, will begin repair tomorrow',
              author: 'Mike Johnson'
            },
            {
              date: new Date('2024-10-02'),
              message: 'Request received and assigned to maintenance team',
              author: 'System'
            }
          ]
        }
      ],
      completedRequests: [
        {
          id: 'MAINT-2024-002',
          title: 'Air Conditioner Service',
          category: 'HVAC',
          priority: 'Low',
          status: 'Completed',
          submittedDate: new Date('2024-09-15'),
          completedDate: new Date('2024-09-16'),
          rating: 5,
          feedback: 'Quick and professional service'
        }
      ],
      categories: [
        { name: 'Plumbing', icon: '🔧', color: '#3b82f6' },
        { name: 'Electrical', icon: '⚡', color: '#f59e0b' },
        { name: 'HVAC', icon: '❄️', color: '#06b6d4' },
        { name: 'Appliances', icon: '📱', color: '#8b5cf6' },
        { name: 'General', icon: '🏠', color: '#10b981' },
        { name: 'Emergency', icon: '🚨', color: '#ef4444' }
      ]
    },
    leaseCenter: {
      currentLease: {
        startDate: new Date('2023-07-01'),
        endDate: new Date('2025-06-30'),
        monthlyRent: 2250,
        securityDeposit: 2250,
        leaseType: 'Standard Residential',
        renewalOption: true,
        noticePeriod: 60,
        daysRemaining: 270
      },
      renewalStatus: {
        eligible: true,
        renewalWindow: new Date('2025-04-01'),
        daysUntilWindow: 150,
        currentOffers: []
      },
      documents: [
        {
          name: 'Original Lease Agreement',
          type: 'PDF',
          size: '2.3 MB',
          uploadDate: new Date('2023-06-15'),
          status: 'Active'
        },
        {
          name: 'Pet Addendum',
          type: 'PDF',
          size: '0.8 MB',
          uploadDate: new Date('2023-06-15'),
          status: 'Active'
        },
        {
          name: 'Parking Agreement',
          type: 'PDF',
          size: '0.5 MB',
          uploadDate: new Date('2023-06-15'),
          status: 'Active'
        }
      ]
    },
    communicationHub: {
      landlordContact: {
        name: 'Sarah Williams',
        title: 'Property Manager',
        email: 'sarah.williams@oceanviewcondos.com',
        phone: '(555) 123-4567',
        office: 'Ocean View Management Office',
        hours: 'Mon-Fri 9AM-6PM, Sat 10AM-4PM',
        emergencyContact: '(555) 911-HELP'
      },
      recentMessages: [
        {
          id: 'msg_001',
          from: 'Property Manager',
          subject: 'Pool Maintenance Schedule Update',
          date: new Date('2024-10-01'),
          preview: 'The pool maintenance schedule has been updated...',
          status: 'unread',
          type: 'announcement'
        },
        {
          id: 'msg_002',
          from: 'You',
          subject: 'Kitchen Faucet Issue',
          date: new Date('2024-10-02'),
          preview: 'Following up on the maintenance request...',
          status: 'read',
          type: 'maintenance'
        }
      ],
      quickActions: [
        { label: 'Report Emergency', icon: '🚨', type: 'emergency' },
        { label: 'General Inquiry', icon: '💬', type: 'general' },
        { label: 'Maintenance Request', icon: '🔧', type: 'maintenance' },
        { label: 'Lease Question', icon: '📋', type: 'lease' },
        { label: 'Payment Issue', icon: '💳', type: 'payment' },
        { label: 'Noise Complaint', icon: '🔇', type: 'noise' }
      ]
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'rent', label: 'Rent Tracker', icon: '💳' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'lease', label: 'Lease Center', icon: '📋' },
    { id: 'communication', label: 'Communication', icon: '💬' }
  ];

  useEffect(() => {
    loadToolsData();
  }, []);

  const loadToolsData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTools(mockToolsData);
    } catch (error) {
      console.error('Failed to load tools data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getDaysUntil = (date) => {
    const now = new Date();
    const target = new Date(date);
    const diffTime = target - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status) => {
    const colors = {
      'paid': '#10b981',
      'pending': '#f59e0b',
      'overdue': '#ef4444',
      'in progress': '#3b82f6',
      'completed': '#10b981',
      'active': '#06b6d4'
    };
    return colors[status.toLowerCase()] || '#6b7280';
  };

  const renderOverview = () => (
    <div className="overview-content">
      <div className="overview-header">
        <h2>Tenant Tools Overview</h2>
        <p>Manage your rental experience with powerful tools</p>
      </div>
      
      <div className="tool-cards">
        <div className="tool-card rent-card">
          <div className="tool-icon">💳</div>
          <h3>Rent Tracker</h3>
          <p>Track payments, set up auto-pay, and manage your rental payments</p>
          <div className="tool-stats">
            <div className="stat">
              <span className="stat-value">{formatCurrency(tools.rentTracker?.currentMonth?.amount || 0)}</span>
              <span className="stat-label">Current Rent</span>
            </div>
            <div className="stat">
              <span className="stat-value">{tools.rentTracker?.currentMonth?.daysLeft || 0}</span>
              <span className="stat-label">Days Until Due</span>
            </div>
          </div>
          <button 
            className="tool-action"
            onClick={() => setActiveView('rent')}
          >
            Open Rent Tracker →
          </button>
        </div>
        
        <div className="tool-card maintenance-card">
          <div className="tool-icon">🔧</div>
          <h3>Maintenance Manager</h3>
          <p>Submit requests, track progress, and communicate with maintenance staff</p>
          <div className="tool-stats">
            <div className="stat">
              <span className="stat-value">{tools.maintenanceManager?.activeRequests?.length || 0}</span>
              <span className="stat-label">Active Requests</span>
            </div>
            <div className="stat">
              <span className="stat-value">{tools.maintenanceManager?.completedRequests?.length || 0}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <button 
            className="tool-action"
            onClick={() => setActiveView('maintenance')}
          >
            Open Maintenance →
          </button>
        </div>
        
        <div className="tool-card lease-card">
          <div className="tool-icon">📋</div>
          <h3>Lease Center</h3>
          <p>View lease details, manage renewals, and access important documents</p>
          <div className="tool-stats">
            <div className="stat">
              <span className="stat-value">{tools.leaseCenter?.currentLease?.daysRemaining || 0}</span>
              <span className="stat-label">Days Remaining</span>
            </div>
            <div className="stat">
              <span className="stat-value">{tools.leaseCenter?.documents?.length || 0}</span>
              <span className="stat-label">Documents</span>
            </div>
          </div>
          <button 
            className="tool-action"
            onClick={() => setActiveView('lease')}
          >
            Open Lease Center →
          </button>
        </div>
        
        <div className="tool-card communication-card">
          <div className="tool-icon">💬</div>
          <h3>Communication Hub</h3>
          <p>Connect with your landlord, property manager, and maintenance team</p>
          <div className="tool-stats">
            <div className="stat">
              <span className="stat-value">{tools.communicationHub?.recentMessages?.filter(m => m.status === 'unread').length || 0}</span>
              <span className="stat-label">Unread Messages</span>
            </div>
            <div className="stat">
              <span className="stat-value">{tools.communicationHub?.quickActions?.length || 0}</span>
              <span className="stat-label">Quick Actions</span>
            </div>
          </div>
          <button 
            className="tool-action"
            onClick={() => setActiveView('communication')}
          >
            Open Communication →
          </button>
        </div>
      </div>
    </div>
  );

  const renderRentTracker = () => (
    <div className="rent-tracker-content">
      <div className="section-header">
        <h2>Rent Tracker</h2>
        <button className="primary-btn">💳 Make Payment</button>
      </div>
      
      <div className="rent-overview">
        <div className="current-rent-card">
          <div className="rent-amount">
            {formatCurrency(tools.rentTracker?.currentMonth?.amount || 0)}
          </div>
          <div className="rent-details">
            <div className="rent-status">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(tools.rentTracker?.currentMonth?.status || 'pending') }}
              >
                {tools.rentTracker?.currentMonth?.status || 'Pending'}
              </span>
            </div>
            <div className="rent-due">
              Due: {formatDate(tools.rentTracker?.currentMonth?.dueDate || new Date())}
            </div>
            <div className="days-left">
              {tools.rentTracker?.currentMonth?.daysLeft || 0} days remaining
            </div>
          </div>
        </div>
        
        <div className="autopay-card">
          <h3>Auto-Pay Settings</h3>
          <div className="autopay-status">
            <span className={`autopay-indicator ${tools.rentTracker?.autoPaySettings?.enabled ? 'enabled' : 'disabled'}`}>
              {tools.rentTracker?.autoPaySettings?.enabled ? '✓ Enabled' : '✗ Disabled'}
            </span>
          </div>
          {tools.rentTracker?.autoPaySettings?.enabled && (
            <div className="autopay-details">
              <div>Account: {tools.rentTracker?.autoPaySettings?.bankAccount}</div>
              <div>Amount: {formatCurrency(tools.rentTracker?.autoPaySettings?.amount)}</div>
              <div>Day: {tools.rentTracker?.autoPaySettings?.dayOfMonth} of each month</div>
            </div>
          )}
          <button className="setup-btn">
            {tools.rentTracker?.autoPaySettings?.enabled ? 'Modify' : 'Set Up'} Auto-Pay
          </button>
        </div>
      </div>
      
      <div className="payment-sections">
        <div className="payment-history">
          <h3>Payment History</h3>
          <div className="history-list">
            {(tools.rentTracker?.paymentHistory || []).map((payment, index) => (
              <div key={index} className="payment-record">
                <div className="payment-info">
                  <div className="payment-month">{payment.month}</div>
                  <div className="payment-method">{payment.method}</div>
                  <div className="payment-confirmation">#{payment.confirmation}</div>
                </div>
                <div className="payment-amount">
                  {formatCurrency(payment.amount)}
                </div>
                <div className="payment-date">
                  {formatDate(payment.paidDate)}
                </div>
                <div 
                  className="payment-status"
                  style={{ color: getStatusColor(payment.status) }}
                >
                  ✓ {payment.status}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="upcoming-payments">
          <h3>Upcoming Payments</h3>
          <div className="upcoming-list">
            {(tools.rentTracker?.upcomingPayments || []).map((payment, index) => (
              <div key={index} className="upcoming-payment">
                <div className="upcoming-info">
                  <div className="upcoming-month">{payment.month}</div>
                  <div className="upcoming-due">Due: {formatDate(payment.dueDate)}</div>
                </div>
                <div className="upcoming-amount">
                  {formatCurrency(payment.amount)}
                </div>
                <div 
                  className="upcoming-status"
                  style={{ color: getStatusColor(payment.status) }}
                >
                  {payment.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="maintenance-content">
      <div className="section-header">
        <h2>Maintenance Manager</h2>
        <button className="primary-btn">+ New Request</button>
      </div>
      
      <div className="maintenance-categories">
        <h3>Request Categories</h3>
        <div className="category-grid">
          {(tools.maintenanceManager?.categories || []).map((category, index) => (
            <div 
              key={index} 
              className="category-card"
              style={{ borderLeftColor: category.color }}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="maintenance-sections">
        <div className="active-requests">
          <h3>Active Requests</h3>
          {(tools.maintenanceManager?.activeRequests || []).map((request, index) => (
            <div key={index} className="request-card">
              <div className="request-header">
                <div className="request-info">
                  <div className="request-title">{request.title}</div>
                  <div className="request-id">#{request.id}</div>
                </div>
                <div className="request-priority" style={{ color: getStatusColor(request.priority) }}>
                  {request.priority} Priority
                </div>
              </div>
              
              <div className="request-details">
                <div className="request-category">
                  <span className="category-badge">{request.category}</span>
                </div>
                <div className="request-status" style={{ color: getStatusColor(request.status) }}>
                  {request.status}
                </div>
                <div className="request-dates">
                  <div>Submitted: {formatDate(request.submittedDate)}</div>
                  <div>Est. Completion: {formatDate(request.estimatedCompletion)}</div>
                </div>
              </div>
              
              <div className="request-description">
                {request.description}
              </div>
              
              {request.assignedTo && (
                <div className="request-assigned">
                  Assigned to: <strong>{request.assignedTo}</strong>
                </div>
              )}
              
              <div className="request-updates">
                <h4>Recent Updates</h4>
                {(request.updates || []).slice(0, 2).map((update, updateIndex) => (
                  <div key={updateIndex} className="update-item">
                    <div className="update-date">{formatDate(update.date)}</div>
                    <div className="update-message">{update.message}</div>
                    <div className="update-author">- {update.author}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="completed-requests">
          <h3>Recently Completed</h3>
          {(tools.maintenanceManager?.completedRequests || []).map((request, index) => (
            <div key={index} className="completed-card">
              <div className="completed-header">
                <div className="completed-title">{request.title}</div>
                <div className="completed-rating">
                  {'⭐'.repeat(request.rating || 0)} ({request.rating}/5)
                </div>
              </div>
              <div className="completed-dates">
                <div>Submitted: {formatDate(request.submittedDate)}</div>
                <div>Completed: {formatDate(request.completedDate)}</div>
              </div>
              {request.feedback && (
                <div className="completed-feedback">
                  "{request.feedback}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLeaseCenter = () => (
    <div className="lease-content">
      <div className="section-header">
        <h2>Lease Center</h2>
        <button className="primary-btn">📋 View Full Lease</button>
      </div>
      
      <div className="lease-overview">
        <div className="current-lease-card">
          <h3>Current Lease Details</h3>
          <div className="lease-info">
            <div className="lease-row">
              <span className="lease-label">Lease Term:</span>
              <span className="lease-value">
                {formatDate(tools.leaseCenter?.currentLease?.startDate)} - 
                {formatDate(tools.leaseCenter?.currentLease?.endDate)}
              </span>
            </div>
            <div className="lease-row">
              <span className="lease-label">Monthly Rent:</span>
              <span className="lease-value">{formatCurrency(tools.leaseCenter?.currentLease?.monthlyRent)}</span>
            </div>
            <div className="lease-row">
              <span className="lease-label">Security Deposit:</span>
              <span className="lease-value">{formatCurrency(tools.leaseCenter?.currentLease?.securityDeposit)}</span>
            </div>
            <div className="lease-row">
              <span className="lease-label">Lease Type:</span>
              <span className="lease-value">{tools.leaseCenter?.currentLease?.leaseType}</span>
            </div>
            <div className="lease-row">
              <span className="lease-label">Notice Period:</span>
              <span className="lease-value">{tools.leaseCenter?.currentLease?.noticePeriod} days</span>
            </div>
          </div>
        </div>
        
        <div className="lease-status-card">
          <h3>Lease Status</h3>
          <div className="status-info">
            <div className="days-remaining">
              <span className="days-number">{tools.leaseCenter?.currentLease?.daysRemaining}</span>
              <span className="days-label">Days Remaining</span>
            </div>
            <div className="renewal-info">
              {tools.leaseCenter?.renewalStatus?.eligible ? (
                <div className="renewal-eligible">
                  <div className="renewal-status">✓ Eligible for Renewal</div>
                  <div className="renewal-window">
                    Renewal window opens: {formatDate(tools.leaseCenter?.renewalStatus?.renewalWindow)}
                  </div>
                  <div className="renewal-countdown">
                    ({tools.leaseCenter?.renewalStatus?.daysUntilWindow} days)
                  </div>
                </div>
              ) : (
                <div className="renewal-not-eligible">
                  <div className="renewal-status">⚠️ Not Yet Eligible</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="lease-documents">
        <h3>Lease Documents</h3>
        <div className="documents-grid">
          {(tools.leaseCenter?.documents || []).map((document, index) => (
            <div key={index} className="document-card">
              <div className="document-icon">📄</div>
              <div className="document-info">
                <div className="document-name">{document.name}</div>
                <div className="document-details">
                  {document.type} • {document.size}
                </div>
                <div className="document-date">
                  Uploaded: {formatDate(document.uploadDate)}
                </div>
                <div 
                  className="document-status"
                  style={{ color: getStatusColor(document.status) }}
                >
                  {document.status}
                </div>
              </div>
              <div className="document-actions">
                <button className="download-btn">📥 Download</button>
                <button className="view-btn">👁️ View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="lease-actions">
        <h3>Lease Actions</h3>
        <div className="actions-grid">
          <button className="action-card">
            <div className="action-icon">🔄</div>
            <div className="action-label">Lease Renewal</div>
            <div className="action-description">Start renewal process</div>
          </button>
          <button className="action-card">
            <div className="action-icon">📝</div>
            <div className="action-label">Amendment Request</div>
            <div className="action-description">Request lease changes</div>
          </button>
          <button className="action-card">
            <div className="action-icon">🚪</div>
            <div className="action-label">Move-Out Notice</div>
            <div className="action-description">Submit notice to vacate</div>
          </button>
          <button className="action-card">
            <div className="action-icon">❓</div>
            <div className="action-label">Lease Questions</div>
            <div className="action-description">Get lease clarification</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="communication-content">
      <div className="section-header">
        <h2>Communication Hub</h2>
        <button className="primary-btn">✉️ New Message</button>
      </div>
      
      <div className="contact-info">
        <div className="contact-card">
          <h3>Property Management Contact</h3>
          <div className="contact-details">
            <div className="contact-person">
              <div className="contact-name">{tools.communicationHub?.landlordContact?.name}</div>
              <div className="contact-title">{tools.communicationHub?.landlordContact?.title}</div>
            </div>
            <div className="contact-methods">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span className="contact-value">{tools.communicationHub?.landlordContact?.email}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span className="contact-value">{tools.communicationHub?.landlordContact?.phone}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🏢</span>
                <span className="contact-value">{tools.communicationHub?.landlordContact?.office}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕒</span>
                <span className="contact-value">{tools.communicationHub?.landlordContact?.hours}</span>
              </div>
            </div>
            <div className="emergency-contact">
              <span className="emergency-label">🚨 Emergency:</span>
              <span className="emergency-number">{tools.communicationHub?.landlordContact?.emergencyContact}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          {(tools.communicationHub?.quickActions || []).map((action, index) => (
            <button key={index} className="quick-action-card">
              <div className="quick-action-icon">{action.icon}</div>
              <div className="quick-action-label">{action.label}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="recent-messages">
        <h3>Recent Messages</h3>
        <div className="messages-list">
          {(tools.communicationHub?.recentMessages || []).map((message, index) => (
            <div key={index} className={`message-item ${message.status === 'unread' ? 'unread' : ''}`}>
              <div className="message-header">
                <div className="message-from">{message.from}</div>
                <div className="message-date">{formatDate(message.date)}</div>
                {message.status === 'unread' && <div className="unread-indicator">●</div>}
              </div>
              <div className="message-subject">{message.subject}</div>
              <div className="message-preview">{message.preview}</div>
              <div className="message-type">
                <span className={`type-badge ${message.type}`}>
                  {message.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'rent':
        return renderRentTracker();
      case 'maintenance':
        return renderMaintenance();
      case 'lease':
        return renderLeaseCenter();
      case 'communication':
        return renderCommunication();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="tenant-tools">
      {/* Header */}
      <div className="tools-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Tenant Tools</h1>
            <p>Advanced tools for managing your rental experience</p>
          </div>
          
          <div className="header-actions">
            <button className="refresh-btn" onClick={loadToolsData}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="tools-navigation">
        <div className="nav-container">
          {navigationItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="tools-content">
        {loading ? (
          <div className="tools-loading">
            <div className="loading-spinner"></div>
            <p>Loading tenant tools...</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default TenantTools;