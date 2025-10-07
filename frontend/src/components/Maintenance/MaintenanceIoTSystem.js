import React, { useState, useEffect } from 'react';
import './MaintenanceIoTSystem.css';

const MaintenanceIoTSystem = () => {
  const [activeTab, setActiveTab] = useState('workflow-management');
  const [maintenanceData, setMaintenanceData] = useState({});
  const [iotDevices, setIoTDevices] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockData = {
    workflowManagement: {
      overview: {
        activeWorkOrders: 23,
        completedToday: 8,
        avgResponseTime: 2.4,
        customerSatisfaction: 4.7,
        totalVendors: 45,
        scheduledMaintenance: 12
      },
      workOrders: [
        {
          id: 'WO-001',
          title: 'HVAC System Maintenance',
          property: 'Sunset Apartments #12A',
          tenant: 'John & Sarah Miller',
          category: 'HVAC',
          priority: 'high',
          status: 'in-progress',
          assignedTo: 'TechPro Services',
          createdDate: '2024-10-26T09:00:00',
          scheduledDate: '2024-10-28T14:00:00',
          estimatedCost: 250.00,
          description: 'Annual HVAC system inspection and filter replacement',
          attachments: ['hvac_inspection_checklist.pdf', 'before_photo.jpg']
        },
        {
          id: 'WO-002',
          title: 'Plumbing Leak Repair',
          property: 'Oak Street Condos #8B',
          tenant: 'David Chen',
          category: 'Plumbing',
          priority: 'urgent',
          status: 'assigned',
          assignedTo: 'QuickFix Plumbing',
          createdDate: '2024-10-28T07:30:00',
          scheduledDate: '2024-10-28T10:00:00',
          estimatedCost: 150.00,
          description: 'Kitchen sink leak reported by tenant',
          attachments: ['leak_photo.jpg']
        },
        {
          id: 'WO-003',
          title: 'Electrical Outlet Installation',
          property: 'Pine Valley Houses #3',
          tenant: 'Rodriguez Family',
          category: 'Electrical',
          priority: 'medium',
          status: 'pending',
          assignedTo: 'Spark Electric Co.',
          createdDate: '2024-10-25T15:20:00',
          scheduledDate: '2024-10-30T11:00:00',
          estimatedCost: 120.00,
          description: 'Install additional outlet in home office',
          attachments: []
        }
      ],
      vendors: [
        {
          id: 'vendor_001',
          name: 'TechPro Services',
          specialties: ['HVAC', 'Heating', 'Cooling'],
          rating: 4.8,
          responseTime: 2.1,
          completedJobs: 156,
          availability: 'available',
          contact: '(555) 123-4567',
          hourlyRate: 85
        },
        {
          id: 'vendor_002',
          name: 'QuickFix Plumbing',
          specialties: ['Plumbing', 'Water Systems', 'Drainage'],
          rating: 4.6,
          responseTime: 1.8,
          completedJobs: 203,
          availability: 'busy',
          contact: '(555) 234-5678',
          hourlyRate: 95
        },
        {
          id: 'vendor_003',
          name: 'Spark Electric Co.',
          specialties: ['Electrical', 'Lighting', 'Wiring'],
          rating: 4.9,
          responseTime: 2.3,
          completedJobs: 128,
          availability: 'available',
          contact: '(555) 345-6789',
          hourlyRate: 110
        }
      ]
    },
    iotIntegration: {
      devices: [
        {
          id: 'device_001',
          name: 'Smart Thermostat - Unit 12A',
          type: 'thermostat',
          property: 'Sunset Apartments #12A',
          status: 'online',
          batteryLevel: 85,
          lastUpdate: '2024-10-28T15:30:00',
          currentTemp: 72,
          targetTemp: 70,
          humidity: 45,
          alerts: [],
          energySavings: 15.2
        },
        {
          id: 'device_002',
          name: 'Water Leak Sensor - Kitchen',
          type: 'leak_sensor',
          property: 'Oak Street Condos #8B',
          status: 'alert',
          batteryLevel: 72,
          lastUpdate: '2024-10-28T07:45:00',
          moistureLevel: 85,
          alerts: [
            {
              id: 'alert_001',
              type: 'water_detected',
              message: 'Water leak detected in kitchen area',
              timestamp: '2024-10-28T07:45:00',
              severity: 'high'
            }
          ]
        },
        {
          id: 'device_003',
          name: 'Smart Lock - Front Door',
          type: 'smart_lock',
          property: 'Pine Valley Houses #3',
          status: 'online',
          batteryLevel: 91,
          lastUpdate: '2024-10-28T16:00:00',
          lockStatus: 'locked',
          accessLog: [
            { user: 'Rodriguez Family', timestamp: '2024-10-28T08:15:00', action: 'unlock' },
            { user: 'Rodriguez Family', timestamp: '2024-10-28T08:45:00', action: 'lock' }
          ],
          alerts: []
        },
        {
          id: 'device_004',
          name: 'Smoke Detector - Living Room',
          type: 'smoke_detector',
          property: 'Sunset Apartments #12A',
          status: 'online',
          batteryLevel: 68,
          lastUpdate: '2024-10-28T15:45:00',
          smokeLevel: 0,
          alerts: [
            {
              id: 'alert_002',
              type: 'low_battery',
              message: 'Battery level below 70%',
              timestamp: '2024-10-28T12:00:00',
              severity: 'medium'
            }
          ]
        }
      ],
      automationRules: [
        {
          id: 'rule_001',
          name: 'Emergency Response Protocol',
          trigger: 'Water leak detected',
          actions: [
            'Send immediate alert to property manager',
            'Create urgent work order',
            'Notify tenant via SMS',
            'Contact emergency plumber'
          ],
          status: 'active'
        },
        {
          id: 'rule_002',
          name: 'Energy Optimization',
          trigger: 'Unit unoccupied for 2+ hours',
          actions: [
            'Adjust thermostat to eco mode',
            'Dim smart lights',
            'Log energy savings'
          ],
          status: 'active'
        },
        {
          id: 'rule_003',
          name: 'Preventive Maintenance Scheduler',
          trigger: 'Device usage threshold reached',
          actions: [
            'Schedule maintenance appointment',
            'Order replacement parts',
            'Notify vendor'
          ],
          status: 'active'
        }
      ]
    },
    predictiveMaintenance: {
      insights: [
        {
          device: 'HVAC Unit - Building A',
          prediction: 'Filter replacement needed in 7 days',
          confidence: 92,
          cost_impact: 45.00,
          action_required: 'Schedule filter replacement'
        },
        {
          device: 'Water Heater - Unit 5C',
          prediction: 'Potential failure in 30 days',
          confidence: 78,
          cost_impact: 1200.00,
          action_required: 'Inspect heating elements'
        },
        {
          device: 'Elevator System',
          prediction: 'Cable inspection due in 14 days',
          confidence: 95,
          cost_impact: 350.00,
          action_required: 'Schedule safety inspection'
        }
      ],
      analytics: {
        total_predictions: 156,
        accuracy_rate: 87.3,
        cost_savings: 15670.00,
        prevented_failures: 23
      }
    }
  };

  useEffect(() => {
    loadMaintenanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const loadMaintenanceData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setMaintenanceData(mockData.workflowManagement);
      setIoTDevices(mockData.iotIntegration.devices);
      setWorkOrders(mockData.workflowManagement.workOrders);
    } catch (error) {
      console.error('Failed to load maintenance data:', error);
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

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'offline': return '#6b7280';
      case 'alert': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'assigned': return '#8b5cf6';
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'thermostat': return '🌡️';
      case 'leak_sensor': return '💧';
      case 'smart_lock': return '🔒';
      case 'smoke_detector': return '🚨';
      case 'security_camera': return '📹';
      case 'motion_sensor': return '👁️';
      default: return '📱';
    }
  };

  const renderWorkflowManagement = () => (
    <div className="workflow-management">
      <div className="workflow-overview">
        <h3>🔧 Maintenance Workflow Overview</h3>
        <div className="overview-stats">
          <div className="overview-card">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <h4>Active Work Orders</h4>
              <div className="card-value">{maintenanceData.overview?.activeWorkOrders}</div>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <h4>Completed Today</h4>
              <div className="card-value">{maintenanceData.overview?.completedToday}</div>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="card-icon">⏱️</div>
            <div className="card-content">
              <h4>Avg Response Time</h4>
              <div className="card-value">{maintenanceData.overview?.avgResponseTime}h</div>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="card-icon">⭐</div>
            <div className="card-content">
              <h4>Customer Rating</h4>
              <div className="card-value">{maintenanceData.overview?.customerSatisfaction}/5</div>
            </div>
          </div>
        </div>
      </div>

      <div className="work-orders-section">
        <div className="section-header">
          <h4>📋 Active Work Orders</h4>
          <button className="create-wo-btn">+ Create Work Order</button>
        </div>
        
        <div className="work-orders-grid">
          {workOrders.map(order => (
            <div key={order.id} className="work-order-card">
              <div className="wo-header">
                <div className="wo-id">{order.id}</div>
                <div className="wo-priority">
                  {getPriorityIcon(order.priority)}
                  <span>{order.priority}</span>
                </div>
              </div>
              
              <h5 className="wo-title">{order.title}</h5>
              
              <div className="wo-details">
                <div className="wo-property">🏢 {order.property}</div>
                <div className="wo-tenant">👤 {order.tenant}</div>
                <div className="wo-category">🔧 {order.category}</div>
                <div className="wo-assigned">👷 {order.assignedTo}</div>
              </div>
              
              <div className="wo-status-bar">
                <span 
                  className="wo-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className="wo-cost">{formatCurrency(order.estimatedCost)}</span>
              </div>
              
              <div className="wo-dates">
                <div>Created: {formatDateTime(order.createdDate)}</div>
                <div>Scheduled: {formatDateTime(order.scheduledDate)}</div>
              </div>
              
              <div className="wo-description">
                {order.description}
              </div>
              
              {order.attachments.length > 0 && (
                <div className="wo-attachments">
                  <strong>Attachments:</strong>
                  {order.attachments.map((attachment, index) => (
                    <span key={index} className="attachment-tag">📎 {attachment}</span>
                  ))}
                </div>
              )}
              
              <div className="wo-actions">
                <button className="action-btn edit">✏️ Edit</button>
                <button className="action-btn update">📊 Update</button>
                <button className="action-btn complete">✅ Complete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="vendors-section">
        <h4>🏗️ Vendor Management</h4>
        <div className="vendors-grid">
          {maintenanceData.vendors?.map(vendor => (
            <div key={vendor.id} className="vendor-card">
              <div className="vendor-header">
                <h5>{vendor.name}</h5>
                <div 
                  className="vendor-availability"
                  style={{ color: getStatusColor(vendor.availability) }}
                >
                  ● {vendor.availability}
                </div>
              </div>
              
              <div className="vendor-specialties">
                {vendor.specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">{specialty}</span>
                ))}
              </div>
              
              <div className="vendor-stats">
                <div className="vendor-stat">
                  <span>Rating: ⭐ {vendor.rating}</span>
                </div>
                <div className="vendor-stat">
                  <span>Response: {vendor.responseTime}h avg</span>
                </div>
                <div className="vendor-stat">
                  <span>Jobs: {vendor.completedJobs} completed</span>
                </div>
                <div className="vendor-stat">
                  <span>Rate: {formatCurrency(vendor.hourlyRate)}/hr</span>
                </div>
              </div>
              
              <div className="vendor-contact">
                📞 {vendor.contact}
              </div>
              
              <div className="vendor-actions">
                <button className="assign-btn">Assign Job</button>
                <button className="contact-btn">Contact</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIoTIntegration = () => (
    <div className="iot-integration">
      <div className="iot-overview">
        <h3>📱 IoT Device Management</h3>
        <div className="iot-stats">
          <div className="stat-item">
            <span className="stat-label">Total Devices</span>
            <span className="stat-value">{iotDevices.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Online</span>
            <span className="stat-value">{iotDevices.filter(d => d.status === 'online').length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Alerts</span>
            <span className="stat-value">{iotDevices.reduce((acc, d) => acc + d.alerts.length, 0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Low Battery</span>
            <span className="stat-value">{iotDevices.filter(d => d.batteryLevel < 70).length}</span>
          </div>
        </div>
      </div>

      <div className="devices-grid">
        {iotDevices.map(device => (
          <div 
            key={device.id} 
            className={`device-card ${device.status} ${device.alerts.length > 0 ? 'has-alerts' : ''}`}
          >
            <div className="device-header">
              <div className="device-icon">{getDeviceIcon(device.type)}</div>
              <div className="device-info">
                <h5>{device.name}</h5>
                <div className="device-property">{device.property}</div>
              </div>
              <div 
                className="device-status"
                style={{ color: getStatusColor(device.status) }}
              >
                ● {device.status}
              </div>
            </div>

            <div className="device-metrics">
              <div className="metric-item">
                <span className="metric-label">Battery</span>
                <div className="battery-indicator">
                  <div 
                    className="battery-level"
                    style={{ 
                      width: `${device.batteryLevel}%`,
                      backgroundColor: device.batteryLevel > 70 ? '#10b981' : device.batteryLevel > 30 ? '#f59e0b' : '#ef4444'
                    }}
                  ></div>
                </div>
                <span className="metric-value">{device.batteryLevel}%</span>
              </div>

              {device.type === 'thermostat' && (
                <>
                  <div className="metric-item">
                    <span className="metric-label">Current</span>
                    <span className="metric-value">{device.currentTemp}°F</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Target</span>
                    <span className="metric-value">{device.targetTemp}°F</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Humidity</span>
                    <span className="metric-value">{device.humidity}%</span>
                  </div>
                </>
              )}

              {device.type === 'leak_sensor' && (
                <div className="metric-item">
                  <span className="metric-label">Moisture</span>
                  <span className="metric-value">{device.moistureLevel}%</span>
                </div>
              )}

              {device.type === 'smart_lock' && (
                <div className="metric-item">
                  <span className="metric-label">Status</span>
                  <span className="metric-value">{device.lockStatus}</span>
                </div>
              )}
            </div>

            {device.alerts.length > 0 && (
              <div className="device-alerts">
                {device.alerts.map(alert => (
                  <div key={alert.id} className="alert-item">
                    <span className="alert-icon">⚠️</span>
                    <span className="alert-message">{alert.message}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="device-last-update">
              Last update: {formatDateTime(device.lastUpdate)}
            </div>
          </div>
        ))}
      </div>

      <div className="automation-rules">
        <h4>🤖 Automation Rules</h4>
        <div className="rules-list">
          {mockData.iotIntegration.automationRules.map(rule => (
            <div key={rule.id} className="rule-card">
              <div className="rule-header">
                <h5>{rule.name}</h5>
                <div 
                  className="rule-status"
                  style={{ color: getStatusColor(rule.status) }}
                >
                  {rule.status}
                </div>
              </div>
              
              <div className="rule-trigger">
                <strong>Trigger:</strong> {rule.trigger}
              </div>
              
              <div className="rule-actions">
                <strong>Actions:</strong>
                <ul>
                  {rule.actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
              
              <div className="rule-controls">
                <button className="rule-btn edit">✏️ Edit</button>
                <button className="rule-btn test">🧪 Test</button>
                <button className="rule-btn toggle">⏸️ Pause</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPredictiveMaintenance = () => (
    <div className="predictive-maintenance">
      <div className="predictive-overview">
        <h3>🔮 Predictive Maintenance Analytics</h3>
        <div className="predictive-stats">
          <div className="pred-stat">
            <h4>Total Predictions</h4>
            <div className="pred-value">{mockData.predictiveMaintenance.analytics.total_predictions}</div>
          </div>
          <div className="pred-stat">
            <h4>Accuracy Rate</h4>
            <div className="pred-value">{mockData.predictiveMaintenance.analytics.accuracy_rate}%</div>
          </div>
          <div className="pred-stat">
            <h4>Cost Savings</h4>
            <div className="pred-value">{formatCurrency(mockData.predictiveMaintenance.analytics.cost_savings)}</div>
          </div>
          <div className="pred-stat">
            <h4>Failures Prevented</h4>
            <div className="pred-value">{mockData.predictiveMaintenance.analytics.prevented_failures}</div>
          </div>
        </div>
      </div>

      <div className="predictions-section">
        <h4>🔍 Current Predictions</h4>
        <div className="predictions-list">
          {mockData.predictiveMaintenance.insights.map((insight, index) => (
            <div key={index} className="prediction-card">
              <div className="prediction-header">
                <h5>{insight.device}</h5>
                <div className="confidence-badge">
                  {insight.confidence}% confidence
                </div>
              </div>
              
              <div className="prediction-content">
                <div className="prediction-text">
                  📊 <strong>Prediction:</strong> {insight.prediction}
                </div>
                
                <div className="prediction-impact">
                  💰 <strong>Cost Impact:</strong> {formatCurrency(insight.cost_impact)}
                </div>
                
                <div className="prediction-action">
                  🎯 <strong>Recommended Action:</strong> {insight.action_required}
                </div>
              </div>
              
              <div className="prediction-confidence">
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill"
                    style={{ width: `${insight.confidence}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="prediction-actions">
                <button className="pred-btn schedule">📅 Schedule</button>
                <button className="pred-btn details">📋 Details</button>
                <button className="pred-btn dismiss">❌ Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-insights">
        <h4>🤖 AI-Powered Insights</h4>
        <div className="insights-grid">
          <div className="insight-card energy">
            <h5>⚡ Energy Optimization</h5>
            <p>HVAC systems running 15% more efficiently with smart scheduling</p>
            <div className="insight-metric">+$234/month savings</div>
          </div>
          
          <div className="insight-card maintenance">
            <h5>🔧 Maintenance Patterns</h5>
            <p>Plumbing issues increase 40% during winter months</p>
            <div className="insight-metric">Plan ahead for Q1</div>
          </div>
          
          <div className="insight-card tenant">
            <h5>👥 Tenant Satisfaction</h5>
            <p>Response times under 2 hours correlate with 95% satisfaction</p>
            <div className="insight-metric">Current: 4.7/5 rating</div>
          </div>
          
          <div className="insight-card cost">
            <h5>💰 Cost Predictions</h5>
            <p>Expected maintenance costs: $3,200 next quarter</p>
            <div className="insight-metric">5% under budget</div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'workflow-management', label: 'Workflow Management', icon: '🔧' },
    { id: 'iot-integration', label: 'IoT Integration', icon: '📱' },
    { id: 'predictive-maintenance', label: 'Predictive Analytics', icon: '🔮' }
  ];

  return (
    <div className="maintenance-iot-system">
      <div className="system-header">
        <div className="header-content">
          <h1>🔧 Maintenance Workflow & IoT Integration</h1>
          <p>Advanced maintenance management with IoT monitoring and predictive analytics</p>
        </div>
        
        <div className="header-actions">
          <button className="action-btn">📋 New Work Order</button>
          <button className="action-btn">📱 Add Device</button>
          <button className="action-btn">🤖 Create Rule</button>
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
            <p>Loading maintenance data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'workflow-management' && renderWorkflowManagement()}
            {activeTab === 'iot-integration' && renderIoTIntegration()}
            {activeTab === 'predictive-maintenance' && renderPredictiveMaintenance()}
          </>
        )}
      </div>
    </div>
  );
};

export default MaintenanceIoTSystem;