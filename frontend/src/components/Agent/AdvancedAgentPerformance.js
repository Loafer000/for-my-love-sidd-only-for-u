import React, { useState } from 'react';

const AdvancedAgentPerformance = () => {
  const [activeTab, setActiveTab] = useState('performance');

  const tabs = [
    { id: 'performance', label: 'Performance', icon: '' },
    { id: 'sales', label: 'Sales', icon: '' },
    { id: 'clients', label: 'Clients', icon: '' },
    { id: 'analytics', label: 'Analytics', icon: '' }
  ];

  const data = {
    performance: [
      { label: 'Active Agents', value: '24' },
      { label: 'Top Performer', value: 'Sarah Johnson' },
      { label: 'Avg. Rating', value: '4.8/5' },
      { label: 'Team Efficiency', value: '92%' }
    ],
    sales: [
      { label: 'Properties Sold', value: '47 this month' },
      { label: 'Total Value', value: '₹5.2 Cr' },
      { label: 'Commission Earned', value: '₹15.6 L' },
      { label: 'Conversion Rate', value: '23.5%' }
    ],
    clients: [
      { label: 'Active Clients', value: '156' },
      { label: 'New Leads', value: '34 this week' },
      { label: 'Client Satisfaction', value: '4.7/5' },
      { label: 'Referral Rate', value: '31%' }
    ],
    analytics: [
      { label: 'Response Time', value: '12 minutes' },
      { label: 'Deal Closure', value: '18.5 days' },
      { label: 'Follow-ups', value: '94% Complete' },
      { label: 'Revenue Growth', value: '+24.8%' }
    ]
  };

  const containerStyle = {
    padding: '2rem',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: 'system-ui'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
    fontWeight: '600'
  };

  const subtitleStyle = {
    color: '#64748b',
    margin: 0
  };

  const tabsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  };

  const getTabStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    border: `1px solid ${isActive ? '#dc2626' : '#e2e8f0'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    background: isActive ? '#dc2626' : 'white',
    color: isActive ? 'white' : '#374151'
  });

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  };

  const cardStyle = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    color: '#64748b',
    marginBottom: '0.5rem',
    fontWeight: '500'
  };

  const valueStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}> Agent Performance</h1>
        <p style={subtitleStyle}>Performance tracking and analytics</p>
      </div>

      <div style={tabsStyle}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={getTabStyle(activeTab === tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={contentStyle}>
        <div style={gridStyle}>
          {data[activeTab].map((metric, index) => (
            <div key={index} style={cardStyle}>
              <div style={labelStyle}>{metric.label}</div>
              <div style={valueStyle}>{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAgentPerformance;
