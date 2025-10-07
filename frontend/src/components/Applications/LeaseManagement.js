import React, { useState, useEffect } from 'react';
import './LeaseManagement.css';

const LeaseManagement = () => {
  const [leases, setLeases] = useState([]);
  const [selectedLease, setSelectedLease] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('startDate');
  const [isLoading, setIsLoading] = useState(true);
  const [showRenewalForm, setShowRenewalForm] = useState(false);

  // Sample lease data
  const sampleLeases = [
    {
      id: 'LEASE-001',
      tenantName: 'Sarah Johnson',
      tenantEmail: 'sarah.j@email.com',
      tenantPhone: '(555) 987-6543',
      propertyId: 'PROP-102',
      propertyAddress: '456 Oak Ave, Unit 5A',
      leaseType: 'residential',
      startDate: '2025-01-15',
      endDate: '2026-01-14',
      monthlyRent: 2800,
      securityDeposit: 2800,
      status: 'active',
      autoRenewal: true,
      paymentHistory: [
        { month: '2025-10', amount: 2800, status: 'paid', dueDate: '2025-10-01', paidDate: '2025-09-28' },
        { month: '2025-09', amount: 2800, status: 'paid', dueDate: '2025-09-01', paidDate: '2025-08-30' },
        { month: '2025-08', amount: 2800, status: 'paid', dueDate: '2025-08-01', paidDate: '2025-08-02' },
      ],
      documents: {
        leaseAgreement: { name: 'Lease_Agreement_001.pdf', uploadDate: '2025-01-10' },
        moveInChecklist: { name: 'MoveIn_Checklist_001.pdf', uploadDate: '2025-01-15' },
        insuranceProof: { name: 'Insurance_Proof_001.pdf', uploadDate: '2025-01-12' }
      },
      maintenanceRequests: 2,
      lastPayment: '2025-09-28',
      nextPaymentDue: '2025-11-01',
      notes: 'Excellent tenant, always pays on time. Recently requested permission for small pet.'
    },
    {
      id: 'LEASE-002',
      tenantName: 'John Smith',
      tenantEmail: 'john.smith@email.com',
      tenantPhone: '(555) 123-4567',
      propertyId: 'PROP-101',
      propertyAddress: '123 Main St, Apt 2B',
      leaseType: 'residential',
      startDate: '2024-11-01',
      endDate: '2025-10-31',
      monthlyRent: 2500,
      securityDeposit: 2500,
      status: 'expiring-soon',
      autoRenewal: false,
      paymentHistory: [
        { month: '2025-10', amount: 2500, status: 'paid', dueDate: '2025-10-01', paidDate: '2025-10-01' },
        { month: '2025-09', amount: 2500, status: 'paid', dueDate: '2025-09-01', paidDate: '2025-09-03' },
        { month: '2025-08', amount: 2500, status: 'late', dueDate: '2025-08-01', paidDate: '2025-08-08' },
      ],
      documents: {
        leaseAgreement: { name: 'Lease_Agreement_002.pdf', uploadDate: '2024-10-25' },
        moveInChecklist: { name: 'MoveIn_Checklist_002.pdf', uploadDate: '2024-11-01' }
      },
      maintenanceRequests: 1,
      lastPayment: '2025-10-01',
      nextPaymentDue: '2025-11-01',
      notes: 'Lease expires soon. Need to discuss renewal options.'
    },
    {
      id: 'LEASE-003',
      tenantName: 'Mike Wilson',
      tenantEmail: 'mike.wilson@email.com',
      tenantPhone: '(555) 456-7890',
      propertyId: 'PROP-103',
      propertyAddress: '789 Pine St, Apt 1C',
      leaseType: 'residential',
      startDate: '2025-06-01',
      endDate: '2026-05-31',
      monthlyRent: 2200,
      securityDeposit: 2200,
      status: 'active',
      autoRenewal: false,
      paymentHistory: [
        { month: '2025-10', amount: 2200, status: 'overdue', dueDate: '2025-10-01', paidDate: null },
        { month: '2025-09', amount: 2200, status: 'paid', dueDate: '2025-09-01', paidDate: '2025-09-05' },
        { month: '2025-08', amount: 2200, status: 'paid', dueDate: '2025-08-01', paidDate: '2025-08-01' },
      ],
      documents: {
        leaseAgreement: { name: 'Lease_Agreement_003.pdf', uploadDate: '2025-05-25' },
        moveInChecklist: { name: 'MoveIn_Checklist_003.pdf', uploadDate: '2025-06-01' },
        insuranceProof: { name: 'Insurance_Proof_003.pdf', uploadDate: '2025-05-28' }
      },
      maintenanceRequests: 0,
      lastPayment: '2025-09-05',
      nextPaymentDue: '2025-10-01',
      notes: 'Payment overdue. Sent reminder notice on Oct 3rd.'
    },
    {
      id: 'LEASE-004',
      tenantName: 'Emily Davis',
      tenantEmail: 'emily.davis@email.com',
      tenantPhone: '(555) 321-9876',
      propertyId: 'PROP-104',
      propertyAddress: '321 Elm St, Unit 3B',
      leaseType: 'residential',
      startDate: '2024-08-15',
      endDate: '2025-08-14',
      monthlyRent: 1900,
      securityDeposit: 1900,
      status: 'terminated',
      autoRenewal: false,
      paymentHistory: [
        { month: '2025-08', amount: 1900, status: 'paid', dueDate: '2025-08-01', paidDate: '2025-08-10' },
        { month: '2025-07', amount: 1900, status: 'paid', dueDate: '2025-07-01', paidDate: '2025-07-01' },
        { month: '2025-06', amount: 1900, status: 'paid', dueDate: '2025-06-01', paidDate: '2025-06-01' },
      ],
      documents: {
        leaseAgreement: { name: 'Lease_Agreement_004.pdf', uploadDate: '2024-08-10' },
        moveInChecklist: { name: 'MoveIn_Checklist_004.pdf', uploadDate: '2024-08-15' },
        moveOutChecklist: { name: 'MoveOut_Checklist_004.pdf', uploadDate: '2025-08-14' }
      },
      maintenanceRequests: 3,
      lastPayment: '2025-08-10',
      nextPaymentDue: null,
      notes: 'Lease completed successfully. Deposit returned in full.'
    },
    {
      id: 'LEASE-005',
      tenantName: 'David Brown',
      tenantEmail: 'david.brown@email.com',
      tenantPhone: '(555) 654-3210',
      propertyId: 'PROP-105',
      propertyAddress: '654 Cedar Ave, Apt 4A',
      leaseType: 'residential',
      startDate: '2025-11-01',
      endDate: '2027-10-31',
      monthlyRent: 3200,
      securityDeposit: 3200,
      status: 'pending',
      autoRenewal: true,
      paymentHistory: [],
      documents: {
        leaseAgreement: { name: 'Lease_Agreement_005.pdf', uploadDate: '2025-10-20' }
      },
      maintenanceRequests: 0,
      lastPayment: null,
      nextPaymentDue: '2025-11-01',
      notes: 'New lease starting November 1st. Move-in inspection scheduled.'
    }
  ];

  useEffect(() => {
    const loadLeases = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLeases(sampleLeases);
      setIsLoading(false);
    };

    loadLeases();
  }, []);

  const statusConfig = {
    'active': { label: 'Active', color: '#28a745', bg: '#e8f5e9' },
    'pending': { label: 'Pending', color: '#007bff', bg: '#e3f2fd' },
    'expiring-soon': { label: 'Expiring Soon', color: '#ffc107', bg: '#fff8e1' },
    'overdue': { label: 'Overdue Payment', color: '#dc3545', bg: '#ffebee' },
    'terminated': { label: 'Terminated', color: '#6c757d', bg: '#f5f5f5' },
    'renewed': { label: 'Renewed', color: '#17a2b8', bg: '#e0f7fa' }
  };

  const getLeaseStatus = (lease) => {
    const today = new Date();
    const endDate = new Date(lease.endDate);
    const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    // Check for overdue payments
    const hasOverduePayment = lease.paymentHistory.some(payment => payment.status === 'overdue');
    if (hasOverduePayment && lease.status === 'active') {
      return 'overdue';
    }

    // Check if expiring soon (within 60 days)
    if (lease.status === 'active' && daysUntilExpiry <= 60 && daysUntilExpiry > 0) {
      return 'expiring-soon';
    }

    return lease.status;
  };

  const getFilteredLeases = () => {
    let filtered = leases.map(lease => ({
      ...lease,
      displayStatus: getLeaseStatus(lease)
    }));

    if (filterStatus !== 'all') {
      filtered = filtered.filter(lease => lease.displayStatus === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(lease => 
        lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort leases
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'tenant':
          return a.tenantName.localeCompare(b.tenantName);
        case 'property':
          return a.propertyAddress.localeCompare(b.propertyAddress);
        case 'rent':
          return b.monthlyRent - a.monthlyRent;
        case 'endDate':
          return new Date(a.endDate) - new Date(b.endDate);
        case 'startDate':
        default:
          return new Date(b.startDate) - new Date(a.startDate);
      }
    });

    return filtered;
  };

  const updateLeaseStatus = (leaseId, newStatus, notes = '') => {
    setLeases(prev => prev.map(lease => 
      lease.id === leaseId 
        ? { 
            ...lease, 
            status: newStatus,
            notes: notes || lease.notes 
          }
        : lease
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDaysUntilExpiry = (endDate) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#28a745';
      case 'late': return '#ffc107';
      case 'overdue': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const LeaseCard = ({ lease }) => {
    const daysUntilExpiry = getDaysUntilExpiry(lease.endDate);
    const currentStatus = getLeaseStatus(lease);
    
    return (
      <div 
        className="lease-card"
        onClick={() => setSelectedLease(lease)}
      >
        <div className="card-header">
          <div className="tenant-info">
            <h3>{lease.tenantName}</h3>
            <p className="lease-id">#{lease.id}</p>
          </div>
          <div 
            className="status-badge"
            style={{ 
              color: statusConfig[currentStatus].color,
              backgroundColor: statusConfig[currentStatus].bg 
            }}
          >
            {statusConfig[currentStatus].label}
          </div>
        </div>
        
        <div className="card-content">
          <div className="property-info">
            <span className="icon">🏠</span>
            <span>{lease.propertyAddress}</span>
          </div>
          
          <div className="lease-metrics">
            <div className="metric">
              <span className="metric-label">Monthly Rent</span>
              <span className="metric-value">{formatCurrency(lease.monthlyRent)}</span>
            </div>
            
            <div className="metric">
              <span className="metric-label">
                {currentStatus === 'expiring-soon' ? 'Days Left' : 
                 currentStatus === 'terminated' ? 'Completed' : 'Duration'}
              </span>
              <span 
                className="metric-value"
                style={{ 
                  color: currentStatus === 'expiring-soon' && daysUntilExpiry <= 30 ? '#dc3545' : 'inherit'
                }}
              >
                {currentStatus === 'terminated' ? 'Ended' :
                 currentStatus === 'expiring-soon' ? `${daysUntilExpiry} days` :
                 `${Math.ceil((new Date(lease.endDate) - new Date(lease.startDate)) / (1000 * 60 * 60 * 24 * 30))} months`}
              </span>
            </div>
            
            <div className="metric">
              <span className="metric-label">Maintenance</span>
              <span className="metric-value">{lease.maintenanceRequests} requests</span>
            </div>
          </div>
          
          <div className="card-footer">
            <span className="lease-period">
              {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
            </span>
            {lease.nextPaymentDue && (
              <span className="next-payment">
                Next: {formatDate(lease.nextPaymentDue)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const LeaseDetails = ({ lease, onClose, onUpdateStatus }) => (
    <div className="lease-details-overlay" onClick={onClose}>
      <div className="lease-details" onClick={e => e.stopPropagation()}>
        <div className="details-header">
          <div>
            <h2>{lease.tenantName}</h2>
            <p>Lease #{lease.id}</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="details-content">
          <div className="details-tabs">
            <button className="tab-btn active">Overview</button>
            <button className="tab-btn">Payment History</button>
            <button className="tab-btn">Documents</button>
            <button className="tab-btn">Maintenance</button>
          </div>
          
          <div className="tab-content">
            <div className="details-grid">
              <div className="details-section">
                <h3>Lease Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Property</label>
                    <span>{lease.propertyAddress}</span>
                  </div>
                  <div className="info-item">
                    <label>Lease Type</label>
                    <span className="capitalize">{lease.leaseType}</span>
                  </div>
                  <div className="info-item">
                    <label>Start Date</label>
                    <span>{formatDate(lease.startDate)}</span>
                  </div>
                  <div className="info-item">
                    <label>End Date</label>
                    <span>{formatDate(lease.endDate)}</span>
                  </div>
                  <div className="info-item">
                    <label>Monthly Rent</label>
                    <span>{formatCurrency(lease.monthlyRent)}</span>
                  </div>
                  <div className="info-item">
                    <label>Security Deposit</label>
                    <span>{formatCurrency(lease.securityDeposit)}</span>
                  </div>
                  <div className="info-item">
                    <label>Auto Renewal</label>
                    <span>{lease.autoRenewal ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Tenant Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name</label>
                    <span>{lease.tenantName}</span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span>{lease.tenantEmail}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <span>{lease.tenantPhone}</span>
                  </div>
                  <div className="info-item">
                    <label>Last Payment</label>
                    <span>{lease.lastPayment ? formatDate(lease.lastPayment) : 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Next Payment Due</label>
                    <span>{lease.nextPaymentDue ? formatDate(lease.nextPaymentDue) : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Recent Payment History</h3>
                <div className="payment-history">
                  {lease.paymentHistory.slice(0, 3).map((payment, index) => (
                    <div key={index} className="payment-item">
                      <div className="payment-info">
                        <span className="payment-month">{payment.month}</span>
                        <span className="payment-amount">{formatCurrency(payment.amount)}</span>
                      </div>
                      <div 
                        className="payment-status"
                        style={{ color: getPaymentStatusColor(payment.status) }}
                      >
                        {payment.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="details-section">
                <h3>Documents</h3>
                <div className="documents-list">
                  {Object.entries(lease.documents).map(([docType, doc]) => (
                    <div key={docType} className="document-item">
                      <div className="doc-info">
                        <span className="doc-name">{doc.name}</span>
                        <span className="doc-date">Uploaded: {formatDate(doc.uploadDate)}</span>
                      </div>
                      <button className="download-btn">📄 Download</button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="details-section full-width">
                <h3>Notes</h3>
                <textarea
                  className="notes-textarea"
                  value={lease.notes}
                  onChange={(e) => {
                    setLeases(prev => prev.map(l => 
                      l.id === lease.id 
                        ? { ...l, notes: e.target.value }
                        : l
                    ));
                  }}
                  placeholder="Add notes about this lease..."
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="details-footer">
          <div className="lease-actions">
            {lease.status === 'expiring-soon' && (
              <button 
                className="action-btn renewal"
                onClick={() => setShowRenewalForm(true)}
              >
                🔄 Renew Lease
              </button>
            )}
            <button className="action-btn secondary">📧 Send Notice</button>
            <button className="action-btn secondary">🏠 Schedule Inspection</button>
            <button className="action-btn primary">💳 Record Payment</button>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredLeases = getFilteredLeases();
  const statusCounts = filteredLeases.reduce((counts, lease) => {
    counts[lease.displayStatus] = (counts[lease.displayStatus] || 0) + 1;
    return counts;
  }, {});

  if (isLoading) {
    return (
      <div className="lease-management loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading leases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lease-management">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Lease Management</h1>
          <p>Manage active leases, renewals, and tenant relationships</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-number">{leases.length}</div>
            <div className="stat-label">Total Leases</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{statusCounts['active'] || 0}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{statusCounts['expiring-soon'] || 0}</div>
            <div className="stat-label">Expiring Soon</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{statusCounts['overdue'] || 0}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search leases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-section">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="startDate">Sort by Start Date</option>
            <option value="endDate">Sort by End Date</option>
            <option value="tenant">Sort by Tenant</option>
            <option value="property">Sort by Property</option>
            <option value="rent">Sort by Rent</option>
          </select>
        </div>
      </div>
      
      <div className="leases-grid">
        {filteredLeases.length > 0 ? (
          filteredLeases.map(lease => (
            <LeaseCard key={lease.id} lease={lease} />
          ))
        ) : (
          <div className="no-leases">
            <div className="no-leases-icon">📋</div>
            <h3>No Leases Found</h3>
            <p>No leases match your current filters</p>
          </div>
        )}
      </div>
      
      {selectedLease && (
        <LeaseDetails
          lease={selectedLease}
          onClose={() => setSelectedLease(null)}
          onUpdateStatus={updateLeaseStatus}
        />
      )}
    </div>
  );
};

export default LeaseManagement;