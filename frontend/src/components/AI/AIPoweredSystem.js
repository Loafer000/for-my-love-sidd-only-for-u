import React, { useState, useEffect } from 'react';
import './AIPoweredSystem.css';

const AIPoweredSystem = () => {
  const [activeTab, setActiveTab] = useState('ai-insights');
  const [aiData, setAiData] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Mock data
  const mockData = {
    aiInsights: {
      overview: {
        totalInsights: 47,
        actionableItems: 23,
        automationsRunning: 15,
        accuracyRate: 94.2,
        costSavings: 23650,
        timesSaved: 156
      },
      intelligentRecommendations: [
        {
          id: 'rec_001',
          title: 'Optimize Rent Pricing for Unit 12A',
          category: 'Pricing Strategy',
          confidence: 92,
          impact: 'High',
          description: 'Market analysis suggests increasing rent by 8% would still maintain 95% occupancy rate',
          potentialValue: 148,
          timeframe: '30 days',
          actions: ['Review market comparables', 'Schedule tenant meeting', 'Update lease terms'],
          aiReasoning: 'Based on 3-month market trend analysis and local competition pricing'
        },
        {
          id: 'rec_002',
          title: 'Predictive Maintenance Alert - HVAC System',
          category: 'Maintenance',
          confidence: 87,
          impact: 'Medium',
          description: 'AI model predicts potential HVAC failure in Building B within 45 days',
          potentialValue: 2400,
          timeframe: '45 days',
          actions: ['Schedule inspection', 'Order replacement parts', 'Contact HVAC contractor'],
          aiReasoning: 'Pattern recognition from sensor data indicates declining efficiency metrics'
        },
        {
          id: 'rec_003',
          title: 'Tenant Retention Strategy',
          category: 'Tenant Management',
          confidence: 89,
          impact: 'High',
          description: 'Identify tenants at risk of non-renewal and implement retention strategies',
          potentialValue: 3200,
          timeframe: '60 days',
          actions: ['Send satisfaction survey', 'Offer lease incentives', 'Schedule property upgrades'],
          aiReasoning: 'Behavioral analysis suggests 3 tenants show early signs of lease non-renewal'
        }
      ],
      smartAnalytics: {
        marketTrends: {
          rentGrowth: 5.2,
          occupancyRate: 94.8,
          marketPosition: 'Above Average',
          competitiveAdvantage: 12.3,
          demandForecast: 'Increasing'
        },
        tenantInsights: {
          satisfactionScore: 4.6,
          retentionRate: 91.2,
          averageStay: 18.4,
          renewalPrediction: 87.5,
          riskTenants: 3
        },
        financialProjections: {
          nextQuarterRevenue: 287500,
          expectedExpenses: 198200,
          projectedProfit: 89300,
          roiProjection: 16.8,
          cashFlowTrend: 'Positive'
        }
      }
    },
    intelligentAutomation: {
      activeAutomations: [
        {
          id: 'auto_001',
          name: 'Smart Rent Collection',
          category: 'Financial',
          status: 'active',
          trigger: 'Rent due date approaching',
          frequency: 'Monthly',
          success_rate: 96.5,
          actions_automated: 1247,
          time_saved: '45 hours/month',
          description: 'Automatically sends rent reminders, processes payments, and handles late fees',
          conditions: ['3 days before due date', 'Tenant has auto-pay enabled', 'Payment method valid'],
          recent_activity: [
            { action: 'Sent payment reminder to John Miller', timestamp: '2024-10-28T09:00:00' },
            { action: 'Processed payment for Unit 8B', timestamp: '2024-10-28T10:15:00' },
            { action: 'Applied late fee to Unit 15C', timestamp: '2024-10-27T16:30:00' }
          ]
        },
        {
          id: 'auto_002',
          name: 'Maintenance Request Triage',
          category: 'Maintenance',
          status: 'active',
          trigger: 'New maintenance request submitted',
          frequency: 'Real-time',
          success_rate: 89.2,
          actions_automated: 856,
          time_saved: '32 hours/month',
          description: 'Automatically categorizes, prioritizes, and assigns maintenance requests to appropriate vendors',
          conditions: ['Request type identified', 'Vendor availability confirmed', 'Emergency protocols'],
          recent_activity: [
            { action: 'Assigned plumbing issue to QuickFix', timestamp: '2024-10-28T07:45:00' },
            { action: 'Escalated emergency repair', timestamp: '2024-10-27T22:15:00' },
            { action: 'Scheduled routine inspection', timestamp: '2024-10-27T14:20:00' }
          ]
        },
        {
          id: 'auto_003',
          name: 'Tenant Screening & Application Processing',
          category: 'Leasing',
          status: 'active',
          trigger: 'New rental application received',
          frequency: 'Real-time',
          success_rate: 93.8,
          actions_automated: 234,
          time_saved: '28 hours/month',
          description: 'Automatically screens applications, runs background checks, and generates lease documents',
          conditions: ['Application complete', 'Credit score above threshold', 'References verified'],
          recent_activity: [
            { action: 'Approved application for Unit 7A', timestamp: '2024-10-28T11:30:00' },
            { action: 'Requested additional documentation', timestamp: '2024-10-27T15:45:00' },
            { action: 'Generated lease for approved tenant', timestamp: '2024-10-26T13:20:00' }
          ]
        }
      ],
      aiWorkflows: [
        {
          id: 'workflow_001',
          name: 'Market-Adaptive Pricing',
          description: 'Automatically adjusts rental prices based on market conditions and demand',
          status: 'learning',
          confidence: 78,
          parameters: ['Market data', 'Seasonal trends', 'Competition analysis', 'Occupancy rates'],
          last_action: 'Recommended 3% increase for premium units'
        },
        {
          id: 'workflow_002',
          name: 'Predictive Tenant Matching',
          description: 'Uses ML to match tenants with properties based on preferences and behavior',
          status: 'active',
          confidence: 85,
          parameters: ['Tenant preferences', 'Property features', 'Location data', 'Historical matches'],
          last_action: 'Matched 3 potential tenants to Unit 12B'
        }
      ]
    },
    virtualAssistant: {
      name: 'PropertyBot',
      capabilities: [
        'Answer tenant questions',
        'Schedule maintenance appointments',
        'Process rent payments',
        'Generate reports',
        'Market analysis',
        'Legal compliance checks'
      ],
      stats: {
        conversations_handled: 1456,
        resolution_rate: 87.3,
        average_response_time: 1.2,
        satisfaction_rating: 4.4
      },
      recent_conversations: [
        {
          user: 'Tenant',
          message: 'When is my lease renewal due?',
          response: 'Your lease for Unit 12A expires on March 31st, 2025. I can help you start the renewal process now if you\'d like.',
          timestamp: '2024-10-28T14:30:00'
        },
        {
          user: 'Property Manager',
          message: 'Generate occupancy report for Q3',
          response: 'I\'ve generated your Q3 occupancy report. The average occupancy rate was 94.2% with peak months in July and August.',
          timestamp: '2024-10-28T13:15:00'
        }
      ]
    },
    machineLearning: {
      models: [
        {
          name: 'Tenant Satisfaction Predictor',
          accuracy: 91.5,
          status: 'production',
          last_trained: '2024-10-25',
          predictions_made: 2847,
          description: 'Predicts tenant satisfaction scores based on maintenance response times, property conditions, and service quality'
        },
        {
          name: 'Property Value Estimator',
          accuracy: 87.2,
          status: 'production',
          last_trained: '2024-10-22',
          predictions_made: 1923,
          description: 'Estimates property values using local market data, property features, and economic indicators'
        },
        {
          name: 'Optimal Rent Pricing Model',
          accuracy: 89.8,
          status: 'production',
          last_trained: '2024-10-20',
          predictions_made: 756,
          description: 'Recommends optimal rent prices to maximize revenue while maintaining high occupancy rates'
        },
        {
          name: 'Maintenance Cost Predictor',
          accuracy: 83.4,
          status: 'training',
          last_trained: '2024-10-28',
          predictions_made: 445,
          description: 'Predicts future maintenance costs based on property age, usage patterns, and historical data'
        }
      ],
      insights: [
        {
          title: 'Seasonal Maintenance Patterns Identified',
          description: 'ML model identified that HVAC issues increase 40% during summer months. Recommend proactive maintenance scheduling.',
          confidence: 94.2,
          action: 'Update maintenance calendar with seasonal priorities'
        },
        {
          title: 'Tenant Preference Clustering',
          description: 'Analysis revealed 3 distinct tenant personas with different amenity preferences and price sensitivities.',
          confidence: 88.7,
          action: 'Customize marketing strategies for each tenant segment'
        }
      ]
    }
  };

  useEffect(() => {
    loadAIData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAIData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAiData(mockData.aiInsights);
      setPredictions(mockData.aiInsights.intelligentRecommendations);
      setAutomations(mockData.intelligentAutomation.activeAutomations);
      
      // Initialize chat with welcome message
      setChatMessages([
        {
          id: 1,
          sender: 'PropertyBot',
          message: 'Hello! I\'m your AI-powered property management assistant. I can help you with analytics, recommendations, maintenance scheduling, and much more. What would you like to know?',
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to load AI data:', error);
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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return '#10b981';
    if (confidence >= 80) return '#f59e0b';
    if (confidence >= 70) return '#ef4444';
    return '#6b7280';
  };

  const getImpactColor = (impact) => {
    switch (impact.toLowerCase()) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'User',
      message: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Based on your current portfolio, I recommend focusing on the properties with the highest ROI potential.',
        'I\'ve analyzed your maintenance data and found some cost-saving opportunities. Would you like me to create a detailed report?',
        'Your occupancy rate is excellent at 94.8%. I can help you identify strategies to maintain this performance.',
        'I notice some patterns in your tenant satisfaction scores. Let me generate some actionable insights for you.',
        'Market analysis shows rent growth opportunities in your area. I can help you optimize pricing strategies.'
      ];

      const botMessage = {
        id: Date.now() + 1,
        sender: 'PropertyBot',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const renderAIInsights = () => (
    <div className="ai-insights">
      <div className="insights-overview">
        <h3>🧠 AI Insights & Recommendations</h3>
        <div className="overview-metrics">
          <div className="metric-card">
            <div className="metric-icon">💡</div>
            <div className="metric-content">
              <h4>Total Insights</h4>
              <div className="metric-value">{aiData.overview?.totalInsights}</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🎯</div>
            <div className="metric-content">
              <h4>Actionable Items</h4>
              <div className="metric-value">{aiData.overview?.actionableItems}</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🤖</div>
            <div className="metric-content">
              <h4>Active Automations</h4>
              <div className="metric-value">{aiData.overview?.automationsRunning}</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h4>Accuracy Rate</h4>
              <div className="metric-value">{formatPercentage(aiData.overview?.accuracyRate)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="intelligent-recommendations">
        <h4>🎯 Intelligent Recommendations</h4>
        <div className="recommendations-list">
          {predictions.map(rec => (
            <div key={rec.id} className="recommendation-card">
              <div className="rec-header">
                <div className="rec-title-section">
                  <h5>{rec.title}</h5>
                  <div className="rec-category">{rec.category}</div>
                </div>
                <div className="rec-metrics">
                  <div 
                    className="confidence-badge"
                    style={{ backgroundColor: getConfidenceColor(rec.confidence) }}
                  >
                    {rec.confidence}% confident
                  </div>
                  <div 
                    className="impact-badge"
                    style={{ backgroundColor: getImpactColor(rec.impact) }}
                  >
                    {rec.impact} Impact
                  </div>
                </div>
              </div>

              <div className="rec-description">
                {rec.description}
              </div>

              <div className="rec-value-time">
                <div className="rec-value">
                  💰 Potential Value: {formatCurrency(rec.potentialValue)}/month
                </div>
                <div className="rec-timeframe">
                  ⏰ Timeframe: {rec.timeframe}
                </div>
              </div>

              <div className="rec-actions-section">
                <h6>Recommended Actions:</h6>
                <ul className="actions-list">
                  {rec.actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>

              <div className="ai-reasoning">
                <strong>AI Reasoning:</strong> {rec.aiReasoning}
              </div>

              <div className="rec-controls">
                <button className="rec-btn implement">✅ Implement</button>
                <button className="rec-btn review">👀 Review</button>
                <button className="rec-btn dismiss">❌ Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="smart-analytics">
        <h4>📈 Smart Analytics Dashboard</h4>
        <div className="analytics-grid">
          <div className="analytics-section market">
            <h5>🏘️ Market Trends</h5>
            <div className="analytics-metrics">
              <div className="analytics-item">
                <span>Rent Growth:</span>
                <span className="positive">{formatPercentage(aiData.smartAnalytics?.marketTrends.rentGrowth)}</span>
              </div>
              <div className="analytics-item">
                <span>Occupancy Rate:</span>
                <span className="positive">{formatPercentage(aiData.smartAnalytics?.marketTrends.occupancyRate)}</span>
              </div>
              <div className="analytics-item">
                <span>Market Position:</span>
                <span>{aiData.smartAnalytics?.marketTrends.marketPosition}</span>
              </div>
              <div className="analytics-item">
                <span>Competitive Edge:</span>
                <span className="positive">+{formatPercentage(aiData.smartAnalytics?.marketTrends.competitiveAdvantage)}</span>
              </div>
            </div>
          </div>

          <div className="analytics-section tenant">
            <h5>👥 Tenant Insights</h5>
            <div className="analytics-metrics">
              <div className="analytics-item">
                <span>Satisfaction Score:</span>
                <span className="positive">{aiData.smartAnalytics?.tenantInsights.satisfactionScore}/5</span>
              </div>
              <div className="analytics-item">
                <span>Retention Rate:</span>
                <span className="positive">{formatPercentage(aiData.smartAnalytics?.tenantInsights.retentionRate)}</span>
              </div>
              <div className="analytics-item">
                <span>Average Stay:</span>
                <span>{aiData.smartAnalytics?.tenantInsights.averageStay} months</span>
              </div>
              <div className="analytics-item">
                <span>Renewal Prediction:</span>
                <span className="positive">{formatPercentage(aiData.smartAnalytics?.tenantInsights.renewalPrediction)}</span>
              </div>
            </div>
          </div>

          <div className="analytics-section financial">
            <h5>💰 Financial Projections</h5>
            <div className="analytics-metrics">
              <div className="analytics-item">
                <span>Q4 Revenue:</span>
                <span className="positive">{formatCurrency(aiData.smartAnalytics?.financialProjections.nextQuarterRevenue)}</span>
              </div>
              <div className="analytics-item">
                <span>Expected Expenses:</span>
                <span>{formatCurrency(aiData.smartAnalytics?.financialProjections.expectedExpenses)}</span>
              </div>
              <div className="analytics-item">
                <span>Projected Profit:</span>
                <span className="positive">{formatCurrency(aiData.smartAnalytics?.financialProjections.projectedProfit)}</span>
              </div>
              <div className="analytics-item">
                <span>ROI Projection:</span>
                <span className="positive">{formatPercentage(aiData.smartAnalytics?.financialProjections.roiProjection)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntelligentAutomation = () => (
    <div className="intelligent-automation">
      <div className="automation-overview">
        <h3>🤖 Intelligent Automation Hub</h3>
        <div className="automation-stats">
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <div className="stat-info">
              <span className="stat-label">Active Automations</span>
              <span className="stat-value">{automations.length}</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⏱️</span>
            <div className="stat-info">
              <span className="stat-label">Time Saved</span>
              <span className="stat-value">105h/month</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💰</span>
            <div className="stat-info">
              <span className="stat-label">Cost Savings</span>
              <span className="stat-value">{formatCurrency(aiData.overview?.costSavings)}</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <div className="stat-info">
              <span className="stat-label">Success Rate</span>
              <span className="stat-value">93.2%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="active-automations">
        <h4>⚡ Active Automation Workflows</h4>
        <div className="automations-grid">
          {automations.map(automation => (
            <div key={automation.id} className="automation-card">
              <div className="automation-header">
                <h5>{automation.name}</h5>
                <div className="automation-status active">
                  ● {automation.status}
                </div>
              </div>

              <div className="automation-category">
                📋 Category: {automation.category}
              </div>

              <div className="automation-description">
                {automation.description}
              </div>

              <div className="automation-metrics">
                <div className="metric-row">
                  <div className="metric-item">
                    <span>Success Rate:</span>
                    <span className="positive">{formatPercentage(automation.success_rate)}</span>
                  </div>
                  <div className="metric-item">
                    <span>Actions Automated:</span>
                    <span>{automation.actions_automated}</span>
                  </div>
                </div>
                <div className="metric-row">
                  <div className="metric-item">
                    <span>Time Saved:</span>
                    <span className="positive">{automation.time_saved}</span>
                  </div>
                  <div className="metric-item">
                    <span>Frequency:</span>
                    <span>{automation.frequency}</span>
                  </div>
                </div>
              </div>

              <div className="automation-conditions">
                <h6>Trigger Conditions:</h6>
                <ul>
                  {automation.conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>

              <div className="recent-activity">
                <h6>Recent Activity:</h6>
                <div className="activity-list">
                  {automation.recent_activity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <span className="activity-action">{activity.action}</span>
                      <span className="activity-time">{formatDateTime(activity.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="automation-controls">
                <button className="control-btn edit">✏️ Edit</button>
                <button className="control-btn pause">⏸️ Pause</button>
                <button className="control-btn stats">📊 Stats</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-workflows">
        <h4>🧠 AI Learning Workflows</h4>
        <div className="workflows-grid">
          {mockData.intelligentAutomation.aiWorkflows.map(workflow => (
            <div key={workflow.id} className="workflow-card">
              <div className="workflow-header">
                <h5>{workflow.name}</h5>
                <div className={`workflow-status ${workflow.status}`}>
                  {workflow.status}
                </div>
              </div>

              <div className="workflow-description">
                {workflow.description}
              </div>

              <div className="workflow-confidence">
                <span>AI Confidence:</span>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill"
                    style={{ 
                      width: `${workflow.confidence}%`,
                      backgroundColor: getConfidenceColor(workflow.confidence)
                    }}
                  ></div>
                </div>
                <span>{workflow.confidence}%</span>
              </div>

              <div className="workflow-parameters">
                <h6>Learning Parameters:</h6>
                <div className="parameters-list">
                  {workflow.parameters.map((param, index) => (
                    <span key={index} className="parameter-tag">{param}</span>
                  ))}
                </div>
              </div>

              <div className="last-action">
                <strong>Last Action:</strong> {workflow.last_action}
              </div>

              <div className="workflow-actions">
                <button className="workflow-btn train">🎓 Train</button>
                <button className="workflow-btn deploy">🚀 Deploy</button>
                <button className="workflow-btn monitor">👀 Monitor</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVirtualAssistant = () => (
    <div className="virtual-assistant">
      <div className="assistant-overview">
        <h3>🤖 PropertyBot - AI Virtual Assistant</h3>
        <div className="assistant-stats">
          <div className="assistant-metric">
            <h4>Conversations Handled</h4>
            <div className="metric-value">{mockData.virtualAssistant.stats.conversations_handled}</div>
          </div>
          <div className="assistant-metric">
            <h4>Resolution Rate</h4>
            <div className="metric-value">{formatPercentage(mockData.virtualAssistant.stats.resolution_rate)}</div>
          </div>
          <div className="assistant-metric">
            <h4>Response Time</h4>
            <div className="metric-value">{mockData.virtualAssistant.stats.average_response_time}s</div>
          </div>
          <div className="assistant-metric">
            <h4>Satisfaction</h4>
            <div className="metric-value">{mockData.virtualAssistant.stats.satisfaction_rating}/5</div>
          </div>
        </div>
      </div>

      <div className="assistant-main">
        <div className="capabilities-panel">
          <h4>🎯 Capabilities</h4>
          <div className="capabilities-list">
            {mockData.virtualAssistant.capabilities.map((capability, index) => (
              <div key={index} className="capability-item">
                <span className="capability-icon">✅</span>
                <span>{capability}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-interface">
          <div className="chat-header">
            <div className="bot-avatar">🤖</div>
            <div className="bot-info">
              <h4>PropertyBot</h4>
              <span className="bot-status">Online - Ready to help</span>
            </div>
          </div>

          <div className="chat-messages">
            {chatMessages.map(message => (
              <div key={message.id} className={`message ${message.sender.toLowerCase()}`}>
                <div className="message-avatar">
                  {message.sender === 'PropertyBot' ? '🤖' : '👤'}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.message}</div>
                  <div className="message-time">{formatDateTime(message.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask PropertyBot anything..."
              className="chat-input"
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <button className="send-btn" onClick={sendChatMessage}>
              📤 Send
            </button>
          </div>
        </div>
      </div>

      <div className="recent-conversations">
        <h4>💬 Recent Conversations</h4>
        <div className="conversations-list">
          {mockData.virtualAssistant.recent_conversations.map((conv, index) => (
            <div key={index} className="conversation-item">
              <div className="conv-header">
                <span className="conv-user">{conv.user}</span>
                <span className="conv-time">{formatDateTime(conv.timestamp)}</span>
              </div>
              <div className="conv-message">
                <strong>Q:</strong> {conv.message}
              </div>
              <div className="conv-response">
                <strong>A:</strong> {conv.response}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMachineLearning = () => (
    <div className="machine-learning">
      <div className="ml-overview">
        <h3>🧠 Machine Learning Models</h3>
        <div className="ml-summary">
          <div className="ml-stat">
            <span className="ml-icon">🤖</span>
            <div className="ml-info">
              <span className="ml-label">Active Models</span>
              <span className="ml-value">{mockData.machineLearning.models.filter(m => m.status === 'production').length}</span>
            </div>
          </div>
          <div className="ml-stat">
            <span className="ml-icon">🎯</span>
            <div className="ml-info">
              <span className="ml-label">Avg Accuracy</span>
              <span className="ml-value">
                {(mockData.machineLearning.models.reduce((acc, m) => acc + m.accuracy, 0) / mockData.machineLearning.models.length).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="ml-stat">
            <span className="ml-icon">🔮</span>
            <div className="ml-info">
              <span className="ml-label">Predictions Made</span>
              <span className="ml-value">
                {mockData.machineLearning.models.reduce((acc, m) => acc + m.predictions_made, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ml-models">
        <h4>🔬 Model Performance</h4>
        <div className="models-grid">
          {mockData.machineLearning.models.map((model, index) => (
            <div key={index} className="model-card">
              <div className="model-header">
                <h5>{model.name}</h5>
                <div className={`model-status ${model.status}`}>
                  {model.status}
                </div>
              </div>

              <div className="model-accuracy">
                <span>Accuracy:</span>
                <div className="accuracy-bar">
                  <div 
                    className="accuracy-fill"
                    style={{ 
                      width: `${model.accuracy}%`,
                      backgroundColor: getConfidenceColor(model.accuracy)
                    }}
                  ></div>
                </div>
                <span>{model.accuracy}%</span>
              </div>

              <div className="model-stats">
                <div className="model-stat">
                  <span>Last Trained:</span>
                  <span>{model.last_trained}</span>
                </div>
                <div className="model-stat">
                  <span>Predictions:</span>
                  <span>{model.predictions_made.toLocaleString()}</span>
                </div>
              </div>

              <div className="model-description">
                {model.description}
              </div>

              <div className="model-actions">
                <button className="model-btn retrain">🔄 Retrain</button>
                <button className="model-btn analyze">📊 Analyze</button>
                <button className="model-btn export">📤 Export</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ml-insights">
        <h4>🔍 ML-Generated Insights</h4>
        <div className="insights-list">
          {mockData.machineLearning.insights.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-header">
                <h5>{insight.title}</h5>
                <div 
                  className="insight-confidence"
                  style={{ backgroundColor: getConfidenceColor(insight.confidence) }}
                >
                  {insight.confidence}% confidence
                </div>
              </div>
              <div className="insight-description">
                {insight.description}
              </div>
              <div className="insight-action">
                <strong>Recommended Action:</strong> {insight.action}
              </div>
              <div className="insight-controls">
                <button className="insight-btn implement">✅ Implement</button>
                <button className="insight-btn details">📋 Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'ai-insights', label: 'AI Insights', icon: '🧠' },
    { id: 'intelligent-automation', label: 'Intelligent Automation', icon: '🤖' },
    { id: 'virtual-assistant', label: 'Virtual Assistant', icon: '💬' },
    { id: 'machine-learning', label: 'Machine Learning', icon: '🔬' }
  ];

  return (
    <div className="ai-powered-system">
      <div className="system-header">
        <div className="header-content">
          <h1>🤖 AI-Powered Features & Automation</h1>
          <p>Advanced artificial intelligence and machine learning for intelligent property management</p>
        </div>
        
        <div className="header-actions">
          <button className="action-btn">🧠 Train Model</button>
          <button className="action-btn">⚡ Create Automation</button>
          <button className="action-btn">💬 Chat with PropertyBot</button>
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
            <p>Initializing AI systems...</p>
          </div>
        ) : (
          <>
            {activeTab === 'ai-insights' && renderAIInsights()}
            {activeTab === 'intelligent-automation' && renderIntelligentAutomation()}
            {activeTab === 'virtual-assistant' && renderVirtualAssistant()}
            {activeTab === 'machine-learning' && renderMachineLearning()}
          </>
        )}
      </div>
    </div>
  );
};

export default AIPoweredSystem;