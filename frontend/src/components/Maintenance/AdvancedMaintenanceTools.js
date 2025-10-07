import React, { useState } from 'react';

const AdvancedMaintenanceTools = () => {
  const [activeTab, setActiveTab] = useState('workorders');

  const tabs = [
    { id: 'workorders', label: 'Work Orders', icon: '' },
    { id: 'iot', label: 'IoT Monitoring', icon: '' },
    { id: 'schedule', label: 'Scheduling', icon: '' },
    { id: 'vendors', label: 'Vendors', icon: '' }
  ];

  const data = {
    workorders: [
      { label: 'Open Orders', value: '23' },
      { label: 'Completed Today', value: '12' },
      { label: 'Emergency Calls', value: '2' },
      { label: 'Average Resolution', value: '2.4 days' }
    ],
    iot: [
      { label: 'Connected Devices', value: '156' },
      { label: 'Active Sensors', value: '89%' },
      { label: 'Alerts Today', value: '7' },
      { label: 'System Health', value: '96%' }
    ],
    schedule: [
      { label: 'Scheduled Tasks', value: '45' },
      { label: 'Preventive Maint.', value: '12' },
      { label: 'Inspections Due', value: '8' },
      { label: 'Team Utilization', value: '78%' }
    ],
    vendors: [
      { label: 'Active Vendors', value: '18' },
      { label: 'Average Rating', value: '4.6/5' },
      { label: 'Response Time', value: '1.2 hours' },
      { label: 'Cost Efficiency', value: '92%' }
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
    border: `1px solid ${isActive ? '#8b5cf6' : '#e2e8f0'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    background: isActive ? '#8b5cf6' : 'white',
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
        <h1 style={titleStyle}> Maintenance Tools</h1>
        <p style={subtitleStyle}>Work orders and IoT monitoring</p>
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

export default AdvancedMaintenanceTools;
