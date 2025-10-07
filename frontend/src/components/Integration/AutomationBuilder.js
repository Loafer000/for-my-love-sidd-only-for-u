import React, { useState, useEffect } from 'react';
import './AutomationBuilder.css';

const AutomationBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [automation, setAutomation] = useState({
    name: '',
    description: '',
    trigger: null,
    conditions: [],
    actions: [],
    schedule: null,
    enabled: true
  });
  
  const [availableTriggers] = useState([
    {
      id: 'new_lead_created',
      name: 'New Lead Created',
      description: 'Triggers when a new lead is added to the system',
      category: 'leads',
      icon: '👤',
      fields: ['source', 'score', 'property_type']
    },
    {
      id: 'property_price_updated',
      name: 'Property Price Updated',
      description: 'Triggers when a property price is changed',
      category: 'properties',
      icon: '🏠',
      fields: ['property_id', 'old_price', 'new_price', 'change_percentage']
    },
    {
      id: 'maintenance_request_created',
      name: 'Maintenance Request Created',
      description: 'Triggers when a tenant submits a maintenance request',
      category: 'maintenance',
      icon: '🔧',
      fields: ['property_id', 'tenant_id', 'urgency', 'category']
    },
    {
      id: 'lease_expiration_approaching',
      name: 'Lease Expiration Approaching',
      description: 'Triggers when lease expiration is within specified timeframe',
      category: 'leases',
      icon: '📄',
      fields: ['property_id', 'tenant_id', 'days_remaining', 'lease_end_date']
    },
    {
      id: 'payment_received',
      name: 'Payment Received',
      description: 'Triggers when a rental payment is processed',
      category: 'payments',
      icon: '💰',
      fields: ['property_id', 'tenant_id', 'amount', 'payment_method']
    },
    {
      id: 'showing_scheduled',
      name: 'Property Showing Scheduled',
      description: 'Triggers when a property showing is booked',
      category: 'showings',
      icon: '📅',
      fields: ['property_id', 'agent_id', 'date_time', 'prospect_info']
    },
    {
      id: 'application_submitted',
      name: 'Rental Application Submitted',
      description: 'Triggers when a prospective tenant submits an application',
      category: 'applications',
      icon: '📋',
      fields: ['property_id', 'applicant_id', 'application_score', 'income']
    }
  ]);

  const [availableActions] = useState([
    {
      id: 'send_email',
      name: 'Send Email',
      description: 'Send an automated email',
      category: 'communication',
      icon: '📧',
      fields: [
        { name: 'template', type: 'select', options: ['welcome', 'followup', 'reminder', 'custom'] },
        { name: 'recipient', type: 'select', options: ['lead', 'tenant', 'agent', 'landlord'] },
        { name: 'subject', type: 'text' },
        { name: 'delay', type: 'number', unit: 'minutes' }
      ]
    },
    {
      id: 'send_sms',
      name: 'Send SMS',
      description: 'Send a text message notification',
      category: 'communication',
      icon: '📱',
      fields: [
        { name: 'template', type: 'select', options: ['alert', 'reminder', 'confirmation', 'custom'] },
        { name: 'recipient', type: 'select', options: ['lead', 'tenant', 'agent', 'landlord'] },
        { name: 'message', type: 'textarea' },
        { name: 'delay', type: 'number', unit: 'minutes' }
      ]
    },
    {
      id: 'create_task',
      name: 'Create Task',
      description: 'Create a task or reminder',
      category: 'productivity',
      icon: '✅',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'assignee', type: 'select', options: ['agent', 'landlord', 'maintenance_team'] },
        { name: 'priority', type: 'select', options: ['low', 'medium', 'high', 'urgent'] },
        { name: 'due_date', type: 'date' }
      ]
    },
    {
      id: 'update_property_status',
      name: 'Update Property Status',
      description: 'Change property availability or status',
      category: 'properties',
      icon: '🏠',
      fields: [
        { name: 'status', type: 'select', options: ['available', 'pending', 'rented', 'maintenance'] },
        { name: 'reason', type: 'text' },
        { name: 'notify_agents', type: 'checkbox' }
      ]
    },
    {
      id: 'create_crm_contact',
      name: 'Create CRM Contact',
      description: 'Add contact to CRM system',
      category: 'crm',
      icon: '👥',
      fields: [
        { name: 'contact_type', type: 'select', options: ['lead', 'client', 'vendor', 'tenant'] },
        { name: 'source', type: 'text' },
        { name: 'assign_to_agent', type: 'select', options: ['auto', 'specific'] }
      ]
    },
    {
      id: 'schedule_followup',
      name: 'Schedule Follow-up',
      description: 'Schedule a follow-up activity',
      category: 'scheduling',
      icon: '📅',
      fields: [
        { name: 'followup_type', type: 'select', options: ['call', 'email', 'meeting', 'site_visit'] },
        { name: 'delay', type: 'number', unit: 'days' },
        { name: 'assignee', type: 'select', options: ['agent', 'landlord'] }
      ]
    },
    {
      id: 'generate_report',
      name: 'Generate Report',
      description: 'Create and send automated reports',
      category: 'reporting',
      icon: '📊',
      fields: [
        { name: 'report_type', type: 'select', options: ['financial', 'occupancy', 'maintenance', 'marketing'] },
        { name: 'recipients', type: 'multi-select', options: ['landlord', 'property_manager', 'agent'] },
        { name: 'format', type: 'select', options: ['pdf', 'excel', 'email'] }
      ]
    },
    {
      id: 'post_to_social_media',
      name: 'Post to Social Media',
      description: 'Share content on social media platforms',
      category: 'marketing',
      icon: '📢',
      fields: [
        { name: 'platforms', type: 'multi-select', options: ['facebook', 'twitter', 'instagram', 'linkedin'] },
        { name: 'content_type', type: 'select', options: ['new_listing', 'price_update', 'open_house', 'custom'] },
        { name: 'message', type: 'textarea' }
      ]
    }
  ]);

  const [availableConditions] = useState([
    {
      id: 'property_price_range',
      name: 'Property Price Range',
      operator_options: ['greater_than', 'less_than', 'between', 'equals']
    },
    {
      id: 'lead_score',
      name: 'Lead Score',
      operator_options: ['greater_than', 'less_than', 'equals']
    },
    {
      id: 'time_of_day',
      name: 'Time of Day',
      operator_options: ['between', 'before', 'after']
    },
    {
      id: 'day_of_week',
      name: 'Day of Week',
      operator_options: ['equals', 'not_equals', 'in']
    },
    {
      id: 'property_type',
      name: 'Property Type',
      operator_options: ['equals', 'not_equals', 'in']
    }
  ]);

  const triggerCategories = [
    { id: 'all', label: 'All Triggers', icon: '🔗' },
    { id: 'leads', label: 'Leads', icon: '👤' },
    { id: 'properties', label: 'Properties', icon: '🏠' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'leases', label: 'Leases', icon: '📄' },
    { id: 'payments', label: 'Payments', icon: '💰' },
    { id: 'showings', label: 'Showings', icon: '📅' },
    { id: 'applications', label: 'Applications', icon: '📋' }
  ];

  const actionCategories = [
    { id: 'all', label: 'All Actions', icon: '⚡' },
    { id: 'communication', label: 'Communication', icon: '📧' },
    { id: 'productivity', label: 'Productivity', icon: '✅' },
    { id: 'properties', label: 'Properties', icon: '🏠' },
    { id: 'crm', label: 'CRM', icon: '👥' },
    { id: 'scheduling', label: 'Scheduling', icon: '📅' },
    { id: 'reporting', label: 'Reports', icon: '📊' },
    { id: 'marketing', label: 'Marketing', icon: '📢' }
  ];

  const [selectedTriggerCategory, setSelectedTriggerCategory] = useState('all');
  const [selectedActionCategory, setSelectedActionCategory] = useState('all');

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Name and describe your automation' },
    { number: 2, title: 'Trigger', description: 'Choose what starts the automation' },
    { number: 3, title: 'Conditions', description: 'Add conditions (optional)' },
    { number: 4, title: 'Actions', description: 'Define what happens' },
    { number: 5, title: 'Schedule', description: 'Set timing and frequency' },
    { number: 6, title: 'Review', description: 'Review and save automation' }
  ];

  const filteredTriggers = availableTriggers.filter(trigger => 
    selectedTriggerCategory === 'all' || trigger.category === selectedTriggerCategory
  );

  const filteredActions = availableActions.filter(action => 
    selectedActionCategory === 'all' || action.category === selectedActionCategory
  );

  const selectTrigger = (trigger) => {
    setAutomation(prev => ({ ...prev, trigger }));
  };

  const addCondition = () => {
    const newCondition = {
      id: Date.now(),
      field: '',
      operator: '',
      value: '',
      logic: 'AND'
    };
    setAutomation(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  };

  const updateCondition = (conditionId, field, value) => {
    setAutomation(prev => ({
      ...prev,
      conditions: prev.conditions.map(condition =>
        condition.id === conditionId ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const removeCondition = (conditionId) => {
    setAutomation(prev => ({
      ...prev,
      conditions: prev.conditions.filter(condition => condition.id !== conditionId)
    }));
  };

  const addAction = (actionTemplate) => {
    const newAction = {
      id: Date.now(),
      template: actionTemplate,
      config: {},
      order: automation.actions.length + 1
    };
    setAutomation(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const updateActionConfig = (actionId, field, value) => {
    setAutomation(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === actionId
          ? { ...action, config: { ...action.config, [field]: value } }
          : action
      )
    }));
  };

  const removeAction = (actionId) => {
    setAutomation(prev => ({
      ...prev,
      actions: prev.actions.filter(action => action.id !== actionId)
    }));
  };

  const moveAction = (actionId, direction) => {
    const actions = [...automation.actions];
    const index = actions.findIndex(action => action.id === actionId);
    
    if (direction === 'up' && index > 0) {
      [actions[index], actions[index - 1]] = [actions[index - 1], actions[index]];
    } else if (direction === 'down' && index < actions.length - 1) {
      [actions[index], actions[index + 1]] = [actions[index + 1], actions[index]];
    }

    actions.forEach((action, i) => {
      action.order = i + 1;
    });

    setAutomation(prev => ({ ...prev, actions }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveAutomation = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Saving automation:', automation);
      
      // Show success message
      alert('Automation saved successfully!');
      
      // Reset form
      setAutomation({
        name: '',
        description: '',
        trigger: null,
        conditions: [],
        actions: [],
        schedule: null,
        enabled: true
      });
      
      setCurrentStep(1);
    } catch (error) {
      console.error('Failed to save automation:', error);
      alert('Failed to save automation. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Automation Name</label>
              <input
                type="text"
                placeholder="e.g., Welcome New Leads"
                value={automation.name}
                onChange={(e) => setAutomation(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe what this automation does..."
                value={automation.description}
                onChange={(e) => setAutomation(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={automation.enabled}
                  onChange={(e) => setAutomation(prev => ({ ...prev, enabled: e.target.checked }))}
                />
                Enable automation immediately after saving
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Select Trigger</h3>
            <div className="category-filters">
              {triggerCategories.map(category => (
                <button
                  key={category.id}
                  className={`category-filter ${selectedTriggerCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedTriggerCategory(category.id)}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
            
            <div className="triggers-grid">
              {filteredTriggers.map(trigger => (
                <div
                  key={trigger.id}
                  className={`trigger-card ${automation.trigger?.id === trigger.id ? 'selected' : ''}`}
                  onClick={() => selectTrigger(trigger)}
                >
                  <div className="trigger-icon">{trigger.icon}</div>
                  <div className="trigger-info">
                    <h4>{trigger.name}</h4>
                    <p>{trigger.description}</p>
                  </div>
                  <div className="trigger-fields">
                    {trigger.fields.map(field => (
                      <span key={field} className="field-tag">{field}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Add Conditions (Optional)</h3>
            <p>Conditions help you refine when the automation should run.</p>
            
            {automation.conditions.length === 0 ? (
              <div className="empty-conditions">
                <p>No conditions added. The automation will run for all triggers.</p>
              </div>
            ) : (
              <div className="conditions-list">
                {automation.conditions.map((condition, index) => (
                  <div key={condition.id} className="condition-item">
                    {index > 0 && (
                      <div className="condition-logic">
                        <select
                          value={condition.logic}
                          onChange={(e) => updateCondition(condition.id, 'logic', e.target.value)}
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="condition-fields">
                      <select
                        value={condition.field}
                        onChange={(e) => updateCondition(condition.id, 'field', e.target.value)}
                      >
                        <option value="">Select field...</option>
                        {availableConditions.map(cond => (
                          <option key={cond.id} value={cond.id}>{cond.name}</option>
                        ))}
                      </select>
                      
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(condition.id, 'operator', e.target.value)}
                        disabled={!condition.field}
                      >
                        <option value="">Select operator...</option>
                        {condition.field && availableConditions
                          .find(c => c.id === condition.field)?.operator_options
                          .map(op => (
                            <option key={op} value={op}>{op.replace('_', ' ')}</option>
                          ))}
                      </select>
                      
                      <input
                        type="text"
                        placeholder="Value..."
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                      />
                      
                      <button
                        className="remove-condition-btn"
                        onClick={() => removeCondition(condition.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button className="add-condition-btn" onClick={addCondition}>
              + Add Condition
            </button>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>Define Actions</h3>
            <div className="actions-section">
              <div className="available-actions">
                <h4>Available Actions</h4>
                <div className="category-filters">
                  {actionCategories.map(category => (
                    <button
                      key={category.id}
                      className={`category-filter ${selectedActionCategory === category.id ? 'active' : ''}`}
                      onClick={() => setSelectedActionCategory(category.id)}
                    >
                      {category.icon} {category.label}
                    </button>
                  ))}
                </div>
                
                <div className="actions-grid">
                  {filteredActions.map(action => (
                    <div
                      key={action.id}
                      className="action-card"
                      onClick={() => addAction(action)}
                    >
                      <div className="action-icon">{action.icon}</div>
                      <div className="action-info">
                        <h5>{action.name}</h5>
                        <p>{action.description}</p>
                      </div>
                      <button className="add-action-btn">+ Add</button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="selected-actions">
                <h4>Selected Actions ({automation.actions.length})</h4>
                {automation.actions.length === 0 ? (
                  <div className="empty-actions">
                    <p>No actions selected. Choose actions from the left panel.</p>
                  </div>
                ) : (
                  <div className="actions-sequence">
                    {automation.actions.map((action, index) => (
                      <div key={action.id} className="action-sequence-item">
                        <div className="action-order">{index + 1}</div>
                        <div className="action-config">
                          <div className="action-header">
                            <span className="action-name">
                              {action.template.icon} {action.template.name}
                            </span>
                            <div className="action-controls">
                              <button
                                className="move-btn"
                                onClick={() => moveAction(action.id, 'up')}
                                disabled={index === 0}
                              >
                                ↑
                              </button>
                              <button
                                className="move-btn"
                                onClick={() => moveAction(action.id, 'down')}
                                disabled={index === automation.actions.length - 1}
                              >
                                ↓
                              </button>
                              <button
                                className="remove-btn"
                                onClick={() => removeAction(action.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          
                          <div className="action-fields">
                            {action.template.fields.map(field => (
                              <div key={field.name} className="field-group">
                                <label>{field.name.replace('_', ' ')}</label>
                                {field.type === 'select' ? (
                                  <select
                                    value={action.config[field.name] || ''}
                                    onChange={(e) => updateActionConfig(action.id, field.name, e.target.value)}
                                  >
                                    <option value="">Select...</option>
                                    {field.options.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                ) : field.type === 'textarea' ? (
                                  <textarea
                                    value={action.config[field.name] || ''}
                                    onChange={(e) => updateActionConfig(action.id, field.name, e.target.value)}
                                    rows={3}
                                  />
                                ) : field.type === 'checkbox' ? (
                                  <label className="checkbox-label">
                                    <input
                                      type="checkbox"
                                      checked={action.config[field.name] || false}
                                      onChange={(e) => updateActionConfig(action.id, field.name, e.target.checked)}
                                    />
                                    {field.name.replace('_', ' ')}
                                  </label>
                                ) : (
                                  <input
                                    type={field.type}
                                    value={action.config[field.name] || ''}
                                    onChange={(e) => updateActionConfig(action.id, field.name, e.target.value)}
                                  />
                                )}
                                {field.unit && <span className="field-unit">{field.unit}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3>Schedule & Timing</h3>
            <div className="schedule-options">
              <div className="form-group">
                <label>Execution Timing</label>
                <select
                  value={automation.schedule?.timing || 'immediate'}
                  onChange={(e) => setAutomation(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, timing: e.target.value }
                  }))}
                >
                  <option value="immediate">Execute Immediately</option>
                  <option value="delayed">Execute After Delay</option>
                  <option value="scheduled">Execute at Specific Time</option>
                </select>
              </div>
              
              {automation.schedule?.timing === 'delayed' && (
                <div className="form-group">
                  <label>Delay Duration</label>
                  <div className="delay-input">
                    <input
                      type="number"
                      min="1"
                      value={automation.schedule?.delay || 1}
                      onChange={(e) => setAutomation(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, delay: parseInt(e.target.value) }
                      }))}
                    />
                    <select
                      value={automation.schedule?.delayUnit || 'minutes'}
                      onChange={(e) => setAutomation(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, delayUnit: e.target.value }
                      }))}
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              )}
              
              {automation.schedule?.timing === 'scheduled' && (
                <div className="form-group">
                  <label>Execution Time</label>
                  <input
                    type="time"
                    value={automation.schedule?.time || '09:00'}
                    onChange={(e) => setAutomation(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, time: e.target.value }
                    }))}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Execution Days</label>
                <div className="days-selector">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <label key={day} className="day-checkbox">
                      <input
                        type="checkbox"
                        checked={automation.schedule?.days?.includes(day) || false}
                        onChange={(e) => {
                          const days = automation.schedule?.days || [];
                          const newDays = e.target.checked
                            ? [...days, day]
                            : days.filter(d => d !== day);
                          setAutomation(prev => ({
                            ...prev,
                            schedule: { ...prev.schedule, days: newDays }
                          }));
                        }}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={automation.schedule?.respectBusinessHours || false}
                    onChange={(e) => setAutomation(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, respectBusinessHours: e.target.checked }
                    }))}
                  />
                  Respect business hours (9 AM - 6 PM)
                </label>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-content">
            <h3>Review Automation</h3>
            <div className="automation-summary">
              <div className="summary-section">
                <h4>Basic Info</h4>
                <p><strong>Name:</strong> {automation.name}</p>
                <p><strong>Description:</strong> {automation.description}</p>
                <p><strong>Status:</strong> {automation.enabled ? 'Enabled' : 'Disabled'}</p>
              </div>
              
              <div className="summary-section">
                <h4>Trigger</h4>
                {automation.trigger ? (
                  <div className="trigger-summary">
                    <span className="trigger-icon">{automation.trigger.icon}</span>
                    <div>
                      <p><strong>{automation.trigger.name}</strong></p>
                      <p>{automation.trigger.description}</p>
                    </div>
                  </div>
                ) : (
                  <p>No trigger selected</p>
                )}
              </div>
              
              {automation.conditions.length > 0 && (
                <div className="summary-section">
                  <h4>Conditions</h4>
                  {automation.conditions.map((condition, index) => (
                    <div key={condition.id} className="condition-summary">
                      {index > 0 && <span className="logic-operator">{condition.logic}</span>}
                      <span>{condition.field} {condition.operator} {condition.value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="summary-section">
                <h4>Actions ({automation.actions.length})</h4>
                {automation.actions.map((action, index) => (
                  <div key={action.id} className="action-summary">
                    <span className="action-order">{index + 1}.</span>
                    <span className="action-icon">{action.template.icon}</span>
                    <span>{action.template.name}</span>
                  </div>
                ))}
              </div>
              
              {automation.schedule && (
                <div className="summary-section">
                  <h4>Schedule</h4>
                  <p><strong>Timing:</strong> {automation.schedule.timing}</p>
                  {automation.schedule.delay && (
                    <p><strong>Delay:</strong> {automation.schedule.delay} {automation.schedule.delayUnit}</p>
                  )}
                  {automation.schedule.time && (
                    <p><strong>Time:</strong> {automation.schedule.time}</p>
                  )}
                  {automation.schedule.days && automation.schedule.days.length > 0 && (
                    <p><strong>Days:</strong> {automation.schedule.days.join(', ')}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return automation.name.trim() !== '';
      case 2:
        return automation.trigger !== null;
      case 3:
        return true; // Conditions are optional
      case 4:
        return automation.actions.length > 0;
      case 5:
        return true; // Schedule has defaults
      case 6:
        return true; // Review step
      default:
        return false;
    }
  };

  return (
    <div className="automation-builder">
      <div className="builder-header">
        <h1>Create New Automation</h1>
        <div className="step-progress">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`step-indicator ${
                step.number === currentStep
                  ? 'current'
                  : step.number < currentStep
                  ? 'completed'
                  : ''
              }`}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="builder-content">
        {renderStepContent()}
      </div>

      <div className="builder-footer">
        <div className="footer-actions">
          <button
            className="prev-btn"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            ← Previous
          </button>
          
          <div className="step-counter">
            Step {currentStep} of {steps.length}
          </div>
          
          {currentStep === 6 ? (
            <button
              className="save-btn"
              onClick={saveAutomation}
              disabled={!isStepValid()}
            >
              Save Automation
            </button>
          ) : (
            <button
              className="next-btn"
              onClick={nextStep}
              disabled={!isStepValid()}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationBuilder;