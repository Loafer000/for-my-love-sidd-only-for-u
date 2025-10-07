import React, { useState, useEffect } from 'react';
import './TenantManagement.css';

const TenantManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [applications, setApplications] = useState([]);
  const [leases, setLeases] = useState([]);

  useEffect(() => {
    loadTenantData();
  }, []);

  const loadTenantData = async () => {
    setLoading(true);
    try {
      // Simulate API call - Replace with real backend calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - Replace with real API data
      setTenants([
        {
          id: 1,
          name: 'John Anderson',
          email: 'john@example.com',
          phone: '+91 98765 43210',
          property: 'Sunset Apartments - Unit 3A',
          rentAmount: 2300,
          status: 'active',
          leaseStart: '2024-01-01',
          leaseEnd: '2024-12-31',
          paymentStatus: 'current',
          lastPayment: '2024-10-01'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '+91 87654 32109',
          property: 'Downtown Lofts - Unit 2B',
          rentAmount: 2800,
          status: 'active',
          leaseStart: '2023-06-15',
          leaseEnd: '2025-06-14',
          paymentStatus: 'late',
          lastPayment: '2024-09-15'
        }
      ]);

      setApplications([
        {
          id: 1,
          applicantName: 'Mike Wilson',
          email: 'mike@example.com',
          phone: '+91 76543 21098',
          property: 'Garden Villas - Unit 1C',
          applicationDate: '2024-09-28',
          status: 'pending',
          monthlyIncome: 85000,
          creditScore: 750
        }
      ]);

      setLeases([
        {
          id: 1,
          tenantName: 'John Anderson',
          property: 'Sunset Apartments - Unit 3A',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          rentAmount: 2300,
          securityDeposit: 6900,
          status: 'active'
        }
      ]);
    } catch (error) {
      console.error('Failed to load tenant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveApplication = (applicationId) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'approved' }
          : app
      )
    );
  };

  const handleRejectApplication = (applicationId) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'rejected' }
          : app
      )
    );
  };

  if (loading) {
    return (
      <div className="tenant-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading tenant management data...</p>
      </div>
    );
  }

  return (
    <div className="tenant-management">
      <div className="tenant-header">
        <div className="header-content">
          <h1>👥 Tenant Management System</h1>
          <p>Comprehensive tenant lifecycle management</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <h3>{tenants.length}</h3>
            <p>Active Tenants</p>
          </div>
          <div className="stat-card">
            <h3>{applications.length}</h3>
            <p>Pending Applications</p>
          </div>
          <div className="stat-card">
            <h3>{leases.length}</h3>
            <p>Active Leases</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tenant-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tenants' ? 'active' : ''}`}
          onClick={() => setActiveTab('tenants')}
        >
          👤 Current Tenants
        </button>
        <button 
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          📋 Applications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'leases' ? 'active' : ''}`}
          onClick={() => setActiveTab('leases')}
        >
          📄 Lease Management
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Tenant Management Overview</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>🏠 Occupancy Rate</h3>
                <div className="metric">94.2%</div>
                <p>2 vacant units available</p>
              </div>
              <div className="overview-card">
                <h3>💰 Collection Rate</h3>
                <div className="metric">96.8%</div>
                <p>Rent collection efficiency</p>
              </div>
              <div className="overview-card">
                <h3>📈 Retention Rate</h3>
                <div className="metric">87.3%</div>
                <p>Tenant renewal rate</p>
              </div>
              <div className="overview-card">
                <h3>⏱️ Avg Lease Length</h3>
                <div className="metric">14.2 months</div>
                <p>Average tenancy duration</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Tenants Tab */}
        {activeTab === 'tenants' && (
          <div className="tenants-section">
            <div className="section-header">
              <h2>Current Tenants</h2>
              <button className="btn-primary">+ Add New Tenant</button>
            </div>
            
            <div className="tenants-grid">
              {tenants.map(tenant => (
                <div key={tenant.id} className="tenant-card">
                  <div className="tenant-header">
                    <div>
                      <h3>{tenant.name}</h3>
                      <p className="tenant-property">{tenant.property}</p>
                    </div>
                    <span className={`status-badge ${tenant.paymentStatus}`}>
                      {tenant.paymentStatus === 'current' ? '✅ Current' : '⚠️ Late'}
                    </span>
                  </div>
                  
                  <div className="tenant-details">
                    <div className="detail-row">
                      <span>📧 Email:</span>
                      <span>{tenant.email}</span>
                    </div>
                    <div className="detail-row">
                      <span>📞 Phone:</span>
                      <span>{tenant.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span>💰 Rent:</span>
                      <span>₹{tenant.rentAmount.toLocaleString()}/month</span>
                    </div>
                    <div className="detail-row">
                      <span>📅 Lease:</span>
                      <span>{tenant.leaseStart} - {tenant.leaseEnd}</span>
                    </div>
                  </div>
                  
                  <div className="tenant-actions">
                    <button className="btn-secondary">Send Notice</button>
                    <button className="btn-secondary">View Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="applications-section">
            <div className="section-header">
              <h2>Tenant Applications</h2>
            </div>
            
            <div className="applications-grid">
              {applications.map(app => (
                <div key={app.id} className="application-card">
                  <div className="application-header">
                    <div>
                      <h3>{app.applicantName}</h3>
                      <p className="application-property">{app.property}</p>
                    </div>
                    <span className={`status-badge ${app.status}`}>
                      {app.status === 'pending' ? '⏳ Pending' : app.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                    </span>
                  </div>
                  
                  <div className="application-details">
                    <div className="detail-row">
                      <span>📧 Email:</span>
                      <span>{app.email}</span>
                    </div>
                    <div className="detail-row">
                      <span>📞 Phone:</span>
                      <span>{app.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span>💼 Income:</span>
                      <span>₹{app.monthlyIncome.toLocaleString()}/month</span>
                    </div>
                    <div className="detail-row">
                      <span>📊 Credit Score:</span>
                      <span>{app.creditScore}</span>
                    </div>
                  </div>
                  
                  {app.status === 'pending' && (
                    <div className="application-actions">
                      <button 
                        className="btn-success"
                        onClick={() => handleApproveApplication(app.id)}
                      >
                        ✅ Approve
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => handleRejectApplication(app.id)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lease Management Tab */}
        {activeTab === 'leases' && (
          <div className="leases-section">
            <div className="section-header">
              <h2>Lease Management</h2>
              <button className="btn-primary">+ Create New Lease</button>
            </div>
            
            <div className="leases-table">
              <table>
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Property</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Rent Amount</th>
                    <th>Security Deposit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leases.map(lease => (
                    <tr key={lease.id}>
                      <td>{lease.tenantName}</td>
                      <td>{lease.property}</td>
                      <td>{lease.startDate}</td>
                      <td>{lease.endDate}</td>
                      <td>₹{lease.rentAmount.toLocaleString()}</td>
                      <td>₹{lease.securityDeposit.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${lease.status}`}>
                          {lease.status === 'active' ? '✅ Active' : lease.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-secondary">Edit</button>
                        <button className="btn-secondary">Renew</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantManagement;