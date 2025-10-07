import React, { useState } from 'react';

const AdvancedTenantLifecycle = () => {
  const [activeTab, setActiveTab] = useState('onboarding');

  const tabs = [
    { id: 'onboarding', label: 'Onboarding', icon: '' },
    { id: 'management', label: 'Management', icon: '' },
    { id: 'communication', label: 'Communication', icon: '' },
    { id: 'lifecycle', label: 'Lifecycle', icon: '' }
  ];

  const data = {
    onboarding: [
      { label: 'New Applications', value: '24' },
      { label: 'In Review', value: '8' },
      { label: 'Approved', value: '16' },
      { label: 'Move-ins This Month', value: '12' }
    ],
    management: [
      { label: 'Active Tenants', value: '156' },
      { label: 'Lease Renewals', value: '23' },
      { label: 'Payment Compliance', value: '94.5%' },
      { label: 'Satisfaction Score', value: '4.6/5' }
    ],
    communication: [
      { label: 'Messages Today', value: '47' },
      { label: 'Response Time', value: '1.2 hours' },
      { label: 'Resolved Issues', value: '89%' },
      { label: 'Notifications Sent', value: '156 this week' }
    ],
    lifecycle: [
      { label: 'Average Tenure', value: '2.3 years' },
      { label: 'Renewal Rate', value: '78%' },
      { label: 'Move-outs', value: '3 this month' },
      { label: 'Retention Score', value: '85%' }
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
    border: `1px solid ${isActive ? '#06b6d4' : '#e2e8f0'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    background: isActive ? '#06b6d4' : 'white',
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
        <h1 style={titleStyle}> Tenant Lifecycle</h1>
        <p style={subtitleStyle}>Complete tenant management and engagement</p>
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

export default AdvancedTenantLifecycle;
