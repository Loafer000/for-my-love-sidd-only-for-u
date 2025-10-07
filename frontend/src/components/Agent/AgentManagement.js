import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AgentManagement.css';

const AgentManagement = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState([]);
  const [agentStats, setAgentStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalSales: 0,
    avgCommission: 0,
    topPerformer: '',
    totalLeads: 0
  });
  const [leads, setLeads] = useState([]);
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAgentData();
    }
  }, [isAuthenticated]);

  const fetchAgentData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls - replace with actual API endpoints
      setTimeout(() => {
        // Mock agent stats
        setAgentStats({
          totalAgents: 25,
          activeAgents: 23,
          totalSales: 1250000,
          avgCommission: 28500,
          topPerformer: 'Sarah Johnson',
          totalLeads: 347
        });

        // Mock agents data
        setAgents([
          {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah.j@connectspace.com',
            phone: '+1-555-0123',
            status: 'Active',
            totalSales: 2450000,
            commission: 73500,
            properties: 15,
            clients: 28,
            joinDate: '2022-03-15',
            lastActivity: '2024-01-25',
            rating: 4.9,
            specialization: 'Luxury Properties'
          },
          {
            id: 2,
            name: 'Michael Chen',
            email: 'michael.c@connectspace.com',
            phone: '+1-555-0124',
            status: 'Active',
            totalSales: 1890000,
            commission: 56700,
            properties: 12,
            clients: 22,
            joinDate: '2022-07-22',
            lastActivity: '2024-01-24',
            rating: 4.7,
            specialization: 'Commercial Real Estate'
          },
          {
            id: 3,
            name: 'Emily Rodriguez',
            email: 'emily.r@connectspace.com',
            phone: '+1-555-0125',
            status: 'Active',
            totalSales: 1650000,
            commission: 49500,
            properties: 10,
            clients: 19,
            joinDate: '2023-01-10',
            lastActivity: '2024-01-25',
            rating: 4.8,
            specialization: 'First-time Buyers'
          },
          {
            id: 4,
            name: 'David Park',
            email: 'david.p@connectspace.com',
            phone: '+1-555-0126',
            status: 'Inactive',
            totalSales: 920000,
            commission: 27600,
            properties: 6,
            clients: 11,
            joinDate: '2023-05-18',
            lastActivity: '2024-01-15',
            rating: 4.4,
            specialization: 'Investment Properties'
          },
          {
            id: 5,
            name: 'Lisa Thompson',
            email: 'lisa.t@connectspace.com',
            phone: '+1-555-0127',
            status: 'Active',
            totalSales: 2100000,
            commission: 63000,
            properties: 14,
            clients: 25,
            joinDate: '2021-11-30',
            lastActivity: '2024-01-25',
            rating: 4.9,
            specialization: 'Residential Sales'
          },
          {
            id: 6,
            name: 'James Wilson',
            email: 'james.w@connectspace.com',
            phone: '+1-555-0128',
            status: 'Active',
            totalSales: 1340000,
            commission: 40200,
            properties: 8,
            clients: 16,
            joinDate: '2022-12-05',
            lastActivity: '2024-01-24',
            rating: 4.6,
            specialization: 'Property Management'
          }
        ]);

        // Mock leads data
        setLeads([
          {
            id: 1,
            clientName: 'Robert Davis',
            email: 'robert.davis@email.com',
            phone: '+1-555-1001',
            assignedAgent: 'Sarah Johnson',
            status: 'Hot',
            budget: 750000,
            propertyType: 'Condo',
            location: 'Downtown',
            source: 'Website',
            createdDate: '2024-01-20',
            lastContact: '2024-01-25',
            notes: 'Looking for luxury condo with city view'
          },
          {
            id: 2,
            clientName: 'Jennifer Lee',
            email: 'jennifer.lee@email.com',
            phone: '+1-555-1002',
            assignedAgent: 'Michael Chen',
            status: 'Warm',
            budget: 450000,
            propertyType: 'Single Family',
            location: 'Suburbs',
            source: 'Referral',
            createdDate: '2024-01-18',
            lastContact: '2024-01-23',
            notes: 'First-time homebuyer, flexible timeline'
          },
          {
            id: 3,
            clientName: 'Mark Anderson',
            email: 'mark.anderson@email.com',
            phone: '+1-555-1003',
            assignedAgent: 'Emily Rodriguez',
            status: 'Cold',
            budget: 320000,
            propertyType: 'Townhouse',
            location: 'East Side',
            source: 'Social Media',
            createdDate: '2024-01-15',
            lastContact: '2024-01-20',
            notes: 'Needs to sell current home first'
          },
          {
            id: 4,
            clientName: 'Susan Miller',
            email: 'susan.miller@email.com',
            phone: '+1-555-1004',
            assignedAgent: 'Lisa Thompson',
            status: 'Hot',
            budget: 890000,
            propertyType: 'Single Family',
            location: 'North Hills',
            source: 'Walk-in',
            createdDate: '2024-01-22',
            lastContact: '2024-01-25',
            notes: 'Ready to purchase immediately'
          }
        ]);

        // Mock commissions data
        setCommissions([
          {
            id: 1,
            agent: 'Sarah Johnson',
            property: '123 Luxury Ave',
            salePrice: 850000,
            commissionRate: 3,
            commissionAmount: 25500,
            saleDate: '2024-01-20',
            status: 'Paid',
            clientName: 'John Smith'
          },
          {
            id: 2,
            agent: 'Michael Chen',
            property: '456 Business Plaza',
            salePrice: 1200000,
            commissionRate: 2.5,
            commissionAmount: 30000,
            saleDate: '2024-01-18',
            status: 'Pending',
            clientName: 'ABC Corp'
          },
          {
            id: 3,
            agent: 'Emily Rodriguez',
            property: '789 Starter Home St',
            salePrice: 425000,
            commissionRate: 3,
            commissionAmount: 12750,
            saleDate: '2024-01-15',
            status: 'Paid',
            clientName: 'Jane Doe'
          },
          {
            id: 4,
            agent: 'Lisa Thompson',
            property: '321 Family Circle',
            salePrice: 675000,
            commissionRate: 3,
            commissionAmount: 20250,
            saleDate: '2024-01-22',
            status: 'Processing',
            clientName: 'The Johnson Family'
          }
        ]);

        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching agent data:', error);
      setIsLoading(false);
    }
  };

  const handleAddAgent = () => {
    const newAgent = {
      id: agents.length + 1,
      name: `New Agent ${agents.length + 1}`,
      email: `agent${agents.length + 1}@connectspace.com`,
      phone: `+1-555-0${100 + agents.length + 1}`,
      status: 'Active',
      totalSales: 0,
      commission: 0,
      properties: 0,
      clients: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      rating: 5.0,
      specialization: 'General'
    };
    setAgents([...agents, newAgent]);
  };

  const handleAgentStatusToggle = (agentId) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'Active' ? 'Inactive' : 'Active' }
        : agent
    ));
  };

  const handleAssignLead = (leadId, agentName) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, assignedAgent: agentName }
        : lead
    ));
  };

  const handleLeadStatusUpdate = (leadId, newStatus) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus }
        : lead
    ));
  };

  if (isLoading) {
    return (
      <div className="agent-management">
        <div className="agent-management-loading">
          <div className="loading-spinner"></div>
          <h3>Loading Agent Management...</h3>
          <p>Fetching agent performance data and analytics</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div>
      <div className="section-header">
        <h2>Agent Performance Overview</h2>
        <button className="btn-primary" onClick={handleAddAgent}>
          Add New Agent
        </button>
      </div>
      <div className="overview-grid">
        <div className="overview-card">
          <h3>Total Agents</h3>
          <div className="metric">{agentStats.totalAgents}</div>
          <p>Registered agents in system</p>
        </div>
        <div className="overview-card">
          <h3>Active Agents</h3>
          <div className="metric">{agentStats.activeAgents}</div>
          <p>Currently active agents</p>
        </div>
        <div className="overview-card">
          <h3>Total Sales</h3>
          <div className="metric">${(agentStats.totalSales / 1000000).toFixed(1)}M</div>
          <p>Combined sales this year</p>
        </div>
        <div className="overview-card">
          <h3>Avg Commission</h3>
          <div className="metric">${agentStats.avgCommission.toLocaleString()}</div>
          <p>Average per agent</p>
        </div>
        <div className="overview-card">
          <h3>Top Performer</h3>
          <div className="metric" style={{fontSize: '1.5rem'}}>{agentStats.topPerformer}</div>
          <p>Highest sales this month</p>
        </div>
        <div className="overview-card">
          <h3>Total Leads</h3>
          <div className="metric">{agentStats.totalLeads}</div>
          <p>Active leads in pipeline</p>
        </div>
      </div>
    </div>
  );

  const renderAgentList = () => (
    <div>
      <div className="section-header">
        <h2>Agent Directory</h2>
        <button className="btn-primary" onClick={handleAddAgent}>
          Add New Agent
        </button>
      </div>
      <div className="agents-grid">
        {agents.map(agent => (
          <div key={agent.id} className="agent-card">
            <div className="agent-header">
              <div>
                <h3>{agent.name}</h3>
                <p className="agent-email">{agent.email}</p>
                <p className="agent-specialization">{agent.specialization}</p>
              </div>
              <span className={`status-badge ${agent.status.toLowerCase()}`}>
                {agent.status}
              </span>
            </div>
            
            <div className="agent-details">
              <div className="detail-row">
                <span>Phone:</span>
                <span>{agent.phone}</span>
              </div>
              <div className="detail-row">
                <span>Total Sales:</span>
                <span>${agent.totalSales.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Commission Earned:</span>
                <span>${agent.commission.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Properties:</span>
                <span>{agent.properties}</span>
              </div>
              <div className="detail-row">
                <span>Active Clients:</span>
                <span>{agent.clients}</span>
              </div>
              <div className="detail-row">
                <span>Rating:</span>
                <span>⭐ {agent.rating}</span>
              </div>
              <div className="detail-row">
                <span>Join Date:</span>
                <span>{agent.joinDate}</span>
              </div>
              <div className="detail-row">
                <span>Last Activity:</span>
                <span>{agent.lastActivity}</span>
              </div>
            </div>
            
            <div className="agent-actions">
              <button className="btn-secondary">Edit Profile</button>
              <button 
                className={agent.status === 'Active' ? "btn-danger" : "btn-success"}
                onClick={() => handleAgentStatusToggle(agent.id)}
              >
                {agent.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeadManagement = () => (
    <div>
      <div className="section-header">
        <h2>Lead Pipeline Management</h2>
        <button className="btn-primary">Add New Lead</button>
      </div>
      <div className="leads-grid">
        {leads.map(lead => (
          <div key={lead.id} className="lead-card">
            <div className="lead-header">
              <div>
                <h3>{lead.clientName}</h3>
                <p className="lead-contact">{lead.email} | {lead.phone}</p>
                <p className="lead-property">{lead.propertyType} in {lead.location}</p>
              </div>
              <span className={`status-badge ${lead.status.toLowerCase()}`}>
                {lead.status}
              </span>
            </div>
            
            <div className="lead-details">
              <div className="detail-row">
                <span>Assigned Agent:</span>
                <span>{lead.assignedAgent}</span>
              </div>
              <div className="detail-row">
                <span>Budget:</span>
                <span>${lead.budget.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Source:</span>
                <span>{lead.source}</span>
              </div>
              <div className="detail-row">
                <span>Created:</span>
                <span>{lead.createdDate}</span>
              </div>
              <div className="detail-row">
                <span>Last Contact:</span>
                <span>{lead.lastContact}</span>
              </div>
              <div className="detail-notes">
                <span>Notes:</span>
                <p>{lead.notes}</p>
              </div>
            </div>
            
            <div className="lead-actions">
              <select 
                onChange={(e) => handleLeadStatusUpdate(lead.id, e.target.value)}
                value={lead.status}
                className="status-select"
              >
                <option value="Cold">Cold</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
              </select>
              <select 
                onChange={(e) => handleAssignLead(lead.id, e.target.value)}
                value={lead.assignedAgent}
                className="agent-select"
              >
                {agents.filter(agent => agent.status === 'Active').map(agent => (
                  <option key={agent.id} value={agent.name}>{agent.name}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommissionTracking = () => (
    <div>
      <div className="section-header">
        <h2>Commission Tracking</h2>
        <button className="btn-primary">Generate Report</button>
      </div>
      <div className="commissions-table">
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Property</th>
              <th>Client</th>
              <th>Sale Price</th>
              <th>Rate</th>
              <th>Commission</th>
              <th>Sale Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map(commission => (
              <tr key={commission.id}>
                <td>{commission.agent}</td>
                <td>{commission.property}</td>
                <td>{commission.clientName}</td>
                <td>${commission.salePrice.toLocaleString()}</td>
                <td>{commission.commissionRate}%</td>
                <td>${commission.commissionAmount.toLocaleString()}</td>
                <td>{commission.saleDate}</td>
                <td>
                  <span className={`status-badge ${commission.status.toLowerCase()}`}>
                    {commission.status}
                  </span>
                </td>
                <td>
                  <button className="btn-secondary">Edit</button>
                  {commission.status === 'Pending' && (
                    <button className="btn-success">Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="agent-management">
      <div className="agent-header">
        <div className="header-content">
          <h1>Agent Management</h1>
          <p>Manage agent performance, leads, and commission tracking</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <h3>{agentStats.activeAgents}</h3>
            <p>Active Agents</p>
          </div>
          <div className="stat-card">
            <h3>{leads.length}</h3>
            <p>Open Leads</p>
          </div>
          <div className="stat-card">
            <h3>${(agentStats.totalSales / 1000000).toFixed(1)}M</h3>
            <p>Total Sales</p>
          </div>
        </div>
      </div>

      <div className="agent-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          Agent Directory
        </button>
        <button 
          className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          Lead Management
        </button>
        <button 
          className={`tab-btn ${activeTab === 'commissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('commissions')}
        >
          Commission Tracking
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'agents' && renderAgentList()}
        {activeTab === 'leads' && renderLeadManagement()}
        {activeTab === 'commissions' && renderCommissionTracking()}
      </div>
    </div>
  );
};

export default AgentManagement;