import React, { useState } from 'react';

const AdvancedAIFeatures = () => {
  const [activeTab, setActiveTab] = useState('automation');

  const tabs = [
    { id: 'automation', label: 'Automation', icon: '' },
    { id: 'insights', label: 'AI Insights', icon: '' },
    { id: 'predictions', label: 'Predictions', icon: '' },
    { id: 'recommendations', label: 'Recommendations', icon: '' }
  ];

  const data = {
    automation: [
      { label: 'Active Workflows', value: '28' },
      { label: 'Tasks Automated', value: '156/day' },
      { label: 'Time Saved', value: '4.2 hrs/day' },
      { label: 'Efficiency Gain', value: '+35%' }
    ],
    insights: [
      { label: 'Data Points', value: '2.4M' },
      { label: 'Patterns Found', value: '47' },
      { label: 'Accuracy Rate', value: '94.8%' },
      { label: 'Insights Generated', value: '12 today' }
    ],
    predictions: [
      { label: 'Market Trends', value: '89% Confidence' },
      { label: 'Occupancy Forecast', value: '97.2% Next Month' },
      { label: 'Maintenance Alerts', value: '5 Predicted' },
      { label: 'Revenue Projection', value: '₹2.8L Next Month' }
    ],
    recommendations: [
      { label: 'Active Suggestions', value: '15' },
      { label: 'Implemented', value: '73%' },
      { label: 'ROI Improvement', value: '+18.5%' },
      { label: 'Cost Savings', value: '₹45,000/month' }
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
    border: `1px solid ${isActive ? '#6366f1' : '#e2e8f0'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    background: isActive ? '#6366f1' : 'white',
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
        <h1 style={titleStyle}> AI Features</h1>
        <p style={subtitleStyle}>Smart automation and intelligent insights</p>
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

export default AdvancedAIFeatures;
