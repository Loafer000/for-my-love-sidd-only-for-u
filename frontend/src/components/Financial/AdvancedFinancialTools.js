import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdvancedFinancialTools = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [financialData, setFinancialData] = useState({
    payments: [],
    reports: [],
    invoices: [],
    taxes: []
  });
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'payments', label: 'Payments', icon: '' },
    { id: 'reports', label: 'Reports', icon: '' },
    { id: 'invoices', label: 'Invoices', icon: '' },
    { id: 'taxes', label: 'Taxes', icon: '' }
  ];

  // Fetch financial data from API
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from backend financial endpoint
        const response = await api.get('/financial/dashboard');
        
        if (response.data && response.data.success) {
          const apiData = response.data.data;
          
          // Transform API data to component format
          setFinancialData({
            payments: [
              { label: 'Total Collected', value: `₹${apiData.totalCollected?.toLocaleString() || '0'}` },
              { label: 'Pending Payments', value: `₹${apiData.pendingPayments?.toLocaleString() || '0'}` },
              { label: 'Online Payments', value: `${apiData.onlinePaymentsPercentage || 0}%` },
              { label: 'Payment Success', value: `${apiData.paymentSuccessRate || 0}%` }
            ],
            reports: [
              { label: 'Monthly Revenue', value: `₹${apiData.monthlyRevenue?.toLocaleString() || '0'}` },
              { label: 'Expense Ratio', value: `${apiData.expenseRatio || 0}%` },
              { label: 'Profit Margin', value: `${apiData.profitMargin || 0}%` },
              { label: 'Growth Rate', value: `+${apiData.growthRate || 0}%` }
            ],
            invoices: [
              { label: 'Generated', value: apiData.invoicesGenerated || '0' },
              { label: 'Paid', value: apiData.invoicesPaid || '0' },
              { label: 'Overdue', value: apiData.overdueInvoices || '0' },
              { label: 'Collection Rate', value: `${apiData.collectionRate || 0}%` }
            ],
            taxes: [
              { label: 'Tax Liability', value: `₹${apiData.taxLiability?.toLocaleString() || '0'}` },
              { label: 'Deductions', value: `₹${apiData.deductions?.toLocaleString() || '0'}` },
              { label: 'Net Payable', value: `₹${apiData.netPayable?.toLocaleString() || '0'}` },
              { label: 'Filing Status', value: apiData.filingStatus || 'Pending' }
            ]
          });
        }
      } catch (err) {
        console.error('Error fetching financial data:', err);
        
        // Fallback to demo data
        setFinancialData({
          payments: [
            { label: 'Total Collected', value: '₹2,45,800' },
            { label: 'Pending Payments', value: '₹18,500' },
            { label: 'Online Payments', value: '89%' },
            { label: 'Payment Success', value: '98.2%' }
          ],
          reports: [
            { label: 'Monthly Revenue', value: '₹2,45,800' },
            { label: 'Expense Ratio', value: '22%' },
            { label: 'Profit Margin', value: '78%' },
            { label: 'Growth Rate', value: '+12.5%' }
          ],
          invoices: [
            { label: 'Generated', value: '156' },
            { label: 'Paid', value: '142' },
            { label: 'Overdue', value: '8' },
            { label: 'Collection Rate', value: '91%' }
          ],
          taxes: [
            { label: 'Tax Liability', value: '₹45,200' },
            { label: 'Deductions', value: '₹12,800' },
            { label: 'Net Payable', value: '₹32,400' },
            { label: 'Filing Status', value: 'On Track' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

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
    border: `1px solid ${isActive ? '#f59e0b' : '#e2e8f0'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    background: isActive ? '#f59e0b' : 'white',
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
        <h1 style={titleStyle}> Financial Tools</h1>
        <p style={subtitleStyle}>Payments, reports and financial management</p>
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ color: '#64748b' }}>Loading financial data...</div>
          </div>
        ) : (
          <div style={gridStyle}>
            {financialData[activeTab].map((metric, index) => (
              <div key={index} style={cardStyle}>
                <div style={labelStyle}>{metric.label}</div>
                <div style={valueStyle}>{metric.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFinancialTools;
