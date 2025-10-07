import React, { useState, useEffect } from 'react';
import './PaymentFinancialSystem.css';

const PaymentFinancialSystem = () => {
  const [activeTab, setActiveTab] = useState('payment-processing');
  const [paymentData, setPaymentData] = useState({});
  const [financialReports, setFinancialReports] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Mock data
  const mockData = {
    paymentProcessing: {
      totalProcessed: 145750.00,
      monthlyVolume: 87500.00,
      successRate: 98.7,
      averageTransactionTime: 2.3,
      paymentMethods: [
        { id: 'bank_transfer', name: 'Bank Transfer/ACH', usage: 65, fees: 0.75, icon: '🏦' },
        { id: 'credit_card', name: 'Credit/Debit Card', usage: 25, fees: 2.9, icon: '💳' },
        { id: 'digital_wallet', name: 'Digital Wallets', usage: 8, fees: 2.5, icon: '📱' },
        { id: 'check', name: 'Electronic Check', usage: 2, fees: 1.5, icon: '📄' }
      ],
      recentTransactions: [
        {
          id: 'txn_001',
          tenant: 'John & Sarah Miller',
          property: 'Sunset Apartments #12A',
          amount: 1850.00,
          type: 'Monthly Rent',
          method: 'Bank Transfer',
          status: 'completed',
          date: '2024-10-28T09:15:00',
          reference: 'TXN-20241028-001'
        },
        {
          id: 'txn_002',
          tenant: 'David Chen',
          property: 'Oak Street Condos #8B',
          amount: 1650.00,
          type: 'Monthly Rent',
          method: 'Credit Card',
          status: 'processing',
          date: '2024-10-28T14:22:00',
          reference: 'TXN-20241028-002'
        },
        {
          id: 'txn_003',
          tenant: 'Rodriguez Family',
          property: 'Pine Valley Houses #3',
          amount: 50.00,
          type: 'Late Fee',
          method: 'Digital Wallet',
          status: 'completed',
          date: '2024-10-27T16:45:00',
          reference: 'TXN-20241027-003'
        }
      ],
      recurringPayments: [
        { tenant: 'John & Sarah Miller', amount: 1850.00, nextDue: '2024-11-01', status: 'active' },
        { tenant: 'David Chen', amount: 1650.00, nextDue: '2024-11-01', status: 'active' },
        { tenant: 'Rodriguez Family', amount: 2200.00, nextDue: '2024-11-01', status: 'active' }
      ]
    },
    financialReports: {
      profitLoss: {
        revenue: {
          rentIncome: 87500,
          lateFeesIncome: 2300,
          parkingIncome: 5400,
          otherIncome: 1200,
          total: 96400
        },
        expenses: {
          mortgage: 28500,
          maintenance: 12500,
          utilities: 8900,
          insurance: 6200,
          propertyTax: 15800,
          management: 4800,
          advertising: 1500,
          legal: 2200,
          other: 3200,
          total: 83600
        },
        netIncome: 12800,
        margins: {
          grossMargin: 86.7,
          netMargin: 13.3,
          operatingMargin: 15.2
        }
      },
      cashFlow: {
        operatingCashFlow: 45200,
        investingCashFlow: -15000,
        financingCashFlow: -18500,
        netCashFlow: 11700,
        cashPosition: 125000
      },
      performance: {
        roi: 15.2,
        cap_rate: 7.8,
        cash_on_cash: 12.4,
        debt_service_coverage: 1.35,
        occupancy_rate: 94.2,
        revenue_per_unit: 1787
      }
    },
    budgetPlanning: {
      currentBudget: {
        totalBudget: 950000,
        spent: 625000,
        remaining: 325000,
        categories: [
          { name: 'Property Acquisition', budgeted: 500000, spent: 350000, remaining: 150000 },
          { name: 'Renovations', budgeted: 200000, spent: 145000, remaining: 55000 },
          { name: 'Marketing', budgeted: 50000, spent: 32000, remaining: 18000 },
          { name: 'Emergency Fund', budgeted: 100000, spent: 15000, remaining: 85000 },
          { name: 'Operations', budgeted: 100000, spent: 83000, remaining: 17000 }
        ]
      },
      forecasts: [
        { month: 'Nov 2024', projected: 98500, actual: null, variance: null },
        { month: 'Dec 2024', projected: 95200, actual: null, variance: null },
        { month: 'Jan 2025', projected: 102800, actual: null, variance: null }
      ]
    }
  };

  useEffect(() => {
    loadFinancialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setPaymentData(mockData.paymentProcessing);
      setFinancialReports(mockData.financialReports);
      setTransactions(mockData.paymentProcessing.recentTransactions);
      setPaymentMethods(mockData.paymentProcessing.paymentMethods);
    } catch (error) {
      console.error('Failed to load financial data:', error);
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

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'processing': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'pending': return '#6b7280';
      case 'active': return '#10b981';
      default: return '#6b7280';
    }
  };

  const renderPaymentProcessing = () => (
    <div className="payment-processing">
      <div className="payment-overview">
        <h3>💳 Payment Processing Overview</h3>
        <div className="payment-stats">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h4>Total Processed</h4>
              <div className="stat-value">{formatCurrency(paymentData.totalProcessed)}</div>
              <div className="stat-period">This Month</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h4>Success Rate</h4>
              <div className="stat-value">{formatPercentage(paymentData.successRate)}</div>
              <div className="stat-period">Last 30 Days</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h4>Avg Processing Time</h4>
              <div className="stat-value">{paymentData.averageTransactionTime}s</div>
              <div className="stat-period">Real-time</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h4>Monthly Volume</h4>
              <div className="stat-value">{formatCurrency(paymentData.monthlyVolume)}</div>
              <div className="stat-period">Current Month</div>
            </div>
          </div>
        </div>
      </div>

      <div className="payment-methods">
        <h4>Payment Methods & Fees</h4>
        <div className="methods-grid">
          {paymentMethods.map(method => (
            <div key={method.id} className="method-card">
              <div className="method-header">
                <span className="method-icon">{method.icon}</span>
                <h5>{method.name}</h5>
              </div>
              <div className="method-stats">
                <div className="usage-bar">
                  <div className="usage-label">Usage: {method.usage}%</div>
                  <div className="usage-progress">
                    <div 
                      className="usage-fill"
                      style={{ width: `${method.usage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="method-fee">Fee: {method.fees}%</div>
              </div>
              <div className="method-actions">
                <button className="configure-btn">Configure</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-transactions">
        <h4>Recent Transactions</h4>
        <div className="transactions-table">
          <div className="table-header">
            <span>Date</span>
            <span>Tenant</span>
            <span>Property</span>
            <span>Amount</span>
            <span>Type</span>
            <span>Method</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {transactions.map(transaction => (
            <div key={transaction.id} className="table-row">
              <span className="transaction-date">
                {formatDateTime(transaction.date)}
              </span>
              <span className="transaction-tenant">{transaction.tenant}</span>
              <span className="transaction-property">{transaction.property}</span>
              <span className="transaction-amount">{formatCurrency(transaction.amount)}</span>
              <span className="transaction-type">{transaction.type}</span>
              <span className="transaction-method">{transaction.method}</span>
              <span 
                className="transaction-status"
                style={{ color: getStatusColor(transaction.status) }}
              >
                {transaction.status}
              </span>
              <div className="transaction-actions">
                <button className="view-btn">View</button>
                <button className="receipt-btn">Receipt</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recurring-payments">
        <h4>Recurring Payments Setup</h4>
        <div className="recurring-list">
          {paymentData.recurringPayments?.map((payment, index) => (
            <div key={index} className="recurring-item">
              <div className="recurring-info">
                <strong>{payment.tenant}</strong>
                <span>{formatCurrency(payment.amount)}/month</span>
              </div>
              <div className="recurring-schedule">
                <span>Next Due: {payment.nextDue}</span>
                <span 
                  className="recurring-status"
                  style={{ color: getStatusColor(payment.status) }}
                >
                  {payment.status}
                </span>
              </div>
              <div className="recurring-actions">
                <button className="modify-btn">Modify</button>
                <button className="pause-btn">Pause</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancialReporting = () => (
    <div className="financial-reporting">
      <div className="profit-loss-section">
        <h3>📊 Profit & Loss Statement</h3>
        <div className="pl-statement">
          <div className="pl-section revenue-section">
            <h4>Revenue</h4>
            <div className="pl-items">
              {Object.entries(financialReports.profitLoss?.revenue || {}).map(([key, value]) => {
                if (key === 'total') return null;
                return (
                  <div key={key} className="pl-item">
                    <span className="pl-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <span className="pl-value">{formatCurrency(value)}</span>
                  </div>
                );
              })}
              <div className="pl-item total">
                <span className="pl-label">Total Revenue</span>
                <span className="pl-value">{formatCurrency(financialReports.profitLoss?.revenue.total)}</span>
              </div>
            </div>
          </div>

          <div className="pl-section expenses-section">
            <h4>Expenses</h4>
            <div className="pl-items">
              {Object.entries(financialReports.profitLoss?.expenses || {}).map(([key, value]) => {
                if (key === 'total') return null;
                return (
                  <div key={key} className="pl-item">
                    <span className="pl-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <span className="pl-value negative">{formatCurrency(value)}</span>
                  </div>
                );
              })}
              <div className="pl-item total">
                <span className="pl-label">Total Expenses</span>
                <span className="pl-value negative">{formatCurrency(financialReports.profitLoss?.expenses.total)}</span>
              </div>
            </div>
          </div>

          <div className="pl-section net-section">
            <div className="pl-item net-income">
              <span className="pl-label">Net Income</span>
              <span className="pl-value positive">{formatCurrency(financialReports.profitLoss?.netIncome)}</span>
            </div>
            <div className="margin-metrics">
              <div className="margin-item">
                <span>Gross Margin:</span>
                <span>{formatPercentage(financialReports.profitLoss?.margins.grossMargin)}</span>
              </div>
              <div className="margin-item">
                <span>Operating Margin:</span>
                <span>{formatPercentage(financialReports.profitLoss?.margins.operatingMargin)}</span>
              </div>
              <div className="margin-item">
                <span>Net Margin:</span>
                <span>{formatPercentage(financialReports.profitLoss?.margins.netMargin)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cash-flow-section">
        <h4>💸 Cash Flow Analysis</h4>
        <div className="cash-flow-grid">
          <div className="cash-flow-item operating">
            <h5>Operating Cash Flow</h5>
            <div className="cash-flow-value positive">{formatCurrency(financialReports.cashFlow?.operatingCashFlow)}</div>
          </div>
          <div className="cash-flow-item investing">
            <h5>Investing Cash Flow</h5>
            <div className="cash-flow-value negative">{formatCurrency(financialReports.cashFlow?.investingCashFlow)}</div>
          </div>
          <div className="cash-flow-item financing">
            <h5>Financing Cash Flow</h5>
            <div className="cash-flow-value negative">{formatCurrency(financialReports.cashFlow?.financingCashFlow)}</div>
          </div>
          <div className="cash-flow-item net">
            <h5>Net Cash Flow</h5>
            <div className="cash-flow-value positive">{formatCurrency(financialReports.cashFlow?.netCashFlow)}</div>
          </div>
        </div>
        <div className="cash-position">
          <h5>Current Cash Position</h5>
          <div className="cash-position-value">{formatCurrency(financialReports.cashFlow?.cashPosition)}</div>
        </div>
      </div>

      <div className="performance-metrics">
        <h4>📈 Key Performance Indicators</h4>
        <div className="kpi-grid">
          {Object.entries(financialReports.performance || {}).map(([key, value]) => (
            <div key={key} className="kpi-card">
              <h5>{key.replace(/_/g, ' ').toUpperCase()}</h5>
              <div className="kpi-value">
                {key.includes('rate') || key === 'roi' || key === 'cap_rate' || key === 'cash_on_cash' 
                  ? formatPercentage(value) 
                  : key === 'revenue_per_unit' 
                  ? formatCurrency(value)
                  : value.toFixed(2)
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBudgetPlanning = () => (
    <div className="budget-planning">
      <div className="budget-overview">
        <h3>📋 Budget Planning & Forecasting</h3>
        <div className="budget-summary">
          <div className="budget-card total">
            <h4>Total Budget</h4>
            <div className="budget-amount">{formatCurrency(mockData.budgetPlanning.currentBudget.totalBudget)}</div>
          </div>
          <div className="budget-card spent">
            <h4>Spent</h4>
            <div className="budget-amount spent">{formatCurrency(mockData.budgetPlanning.currentBudget.spent)}</div>
          </div>
          <div className="budget-card remaining">
            <h4>Remaining</h4>
            <div className="budget-amount remaining">{formatCurrency(mockData.budgetPlanning.currentBudget.remaining)}</div>
          </div>
        </div>
      </div>

      <div className="budget-categories">
        <h4>Budget Categories</h4>
        <div className="categories-list">
          {mockData.budgetPlanning.currentBudget.categories.map((category, index) => (
            <div key={index} className="category-item">
              <div className="category-header">
                <h5>{category.name}</h5>
                <div className="category-amounts">
                  <span>Budgeted: {formatCurrency(category.budgeted)}</span>
                  <span>Spent: {formatCurrency(category.spent)}</span>
                  <span>Remaining: {formatCurrency(category.remaining)}</span>
                </div>
              </div>
              <div className="category-progress">
                <div 
                  className="category-progress-bar"
                  style={{ width: `${(category.spent / category.budgeted) * 100}%` }}
                ></div>
              </div>
              <div className="category-percentage">
                {formatPercentage((category.spent / category.budgeted) * 100)} used
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="budget-forecasts">
        <h4>Revenue Forecasts</h4>
        <div className="forecasts-table">
          <div className="forecast-header">
            <span>Month</span>
            <span>Projected</span>
            <span>Actual</span>
            <span>Variance</span>
          </div>
          {mockData.budgetPlanning.forecasts.map((forecast, index) => (
            <div key={index} className="forecast-row">
              <span>{forecast.month}</span>
              <span>{formatCurrency(forecast.projected)}</span>
              <span>{forecast.actual ? formatCurrency(forecast.actual) : 'TBD'}</span>
              <span>{forecast.variance ? `${forecast.variance > 0 ? '+' : ''}${formatPercentage(forecast.variance)}` : '-'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="financial-tools">
        <h4>Financial Planning Tools</h4>
        <div className="tools-grid">
          <button className="tool-btn">📊 Budget Creator</button>
          <button className="tool-btn">📈 ROI Calculator</button>
          <button className="tool-btn">💰 Cash Flow Projector</button>
          <button className="tool-btn">📄 Tax Optimizer</button>
          <button className="tool-btn">🏦 Loan Calculator</button>
          <button className="tool-btn">📋 Expense Tracker</button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'payment-processing', label: 'Payment Processing', icon: '💳' },
    { id: 'financial-reporting', label: 'Financial Reports', icon: '📊' },
    { id: 'budget-planning', label: 'Budget & Planning', icon: '📋' }
  ];

  return (
    <div className="payment-financial-system">
      <div className="system-header">
        <div className="header-content">
          <h1>💳 Payment Processing & Financial Management</h1>
          <p>Complete financial operations and analytics for your real estate business</p>
        </div>
        
        <div className="header-actions">
          <button className="action-btn">💰 Process Payment</button>
          <button className="action-btn">📊 Generate Report</button>
          <button className="action-btn">📧 Send Invoice</button>
        </div>
      </div>

      <div className="system-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="system-content">
        {loading ? (
          <div className="system-loading">
            <div className="loading-spinner"></div>
            <p>Loading financial data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'payment-processing' && renderPaymentProcessing()}
            {activeTab === 'financial-reporting' && renderFinancialReporting()}
            {activeTab === 'budget-planning' && renderBudgetPlanning()}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentFinancialSystem;