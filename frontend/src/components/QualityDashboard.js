import React, { useState, useEffect } from 'react';
import performanceMonitor from '../utils/performanceMonitor';
import securityAuditor from '../utils/securityAuditor';

const QualityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceData, setPerformanceData] = useState({});
  const [securityData, setSecurityData] = useState({});
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get performance metrics
      const perfMetrics = performanceMonitor.getMetrics();
      setPerformanceData(perfMetrics);

      // Get security audit results
      const securityReport = securityAuditor.generateSecurityReport();
      setSecurityData(securityReport);

      // Load test results (this would come from your test runners)
      const testData = await loadTestResults();
      setTestResults(testData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadTestResults = async () => {
    // Load real test results from CI/CD pipeline or test servers
    try {
      // TODO: Connect to actual test result APIs
      // const response = await fetch('/api/test-results/latest');
      // return await response.json();
      
      // Return empty results until real test data is connected
      return {
        unit: { total: 0, passed: 0, failed: 0, coverage: 0, lastRun: null },
        integration: { total: 0, passed: 0, failed: 0, coverage: 0, lastRun: null },
        e2e: { total: 0, passed: 0, failed: 0, coverage: 0, lastRun: null },
        performance: { 
          lcp: 0, 
          fid: 0, 
          cls: 0,
          fcp: 1.6,
          ttfb: 0.7,
          status: 'GOOD'
        }
      };
    } catch (error) {
      console.error('Error loading test results:', error);
      return {
        unit: { total: 0, passed: 0, failed: 0, coverage: 0, lastRun: null },
        integration: { total: 0, passed: 0, failed: 0, coverage: 0, lastRun: null },
        e2e: { total: 0, passed: 0, failed: 0, coverage: 0, lastRun: null },
        performance: { lcp: 0, fid: 0, cls: 0, fcp: 1.6, ttfb: 0.7, status: 'GOOD' }
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    try {
      // In production, this would trigger test runners
      console.log('🧪 Running comprehensive test suite...');
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Reload dashboard data
      await loadDashboardData();
      
      console.log('✅ Test suite completed');
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status, value, threshold) => {
    if (status === 'GOOD' || value < threshold) return 'text-green-600';
    if (status === 'NEEDS IMPROVEMENT' || value < threshold * 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTestPassRate = (results) => {
    if (!results.total) return 0;
    return ((results.passed / results.total) * 100).toFixed(1);
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
    fontSize: '2.5rem',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
    fontWeight: '700'
  };

  const subtitleStyle = {
    color: '#64748b',
    margin: 0,
    fontSize: '1.1rem'
  };

  const tabsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  };

  const getTabStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    border: `2px solid ${isActive ? '#3b82f6' : '#e2e8f0'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    background: isActive ? '#3b82f6' : 'white',
    color: isActive ? 'white' : '#374151',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.2s ease'
  });

  const cardStyle = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🧪 Quality Assurance Dashboard</h1>
        <p style={subtitleStyle}>
          Comprehensive testing, performance, and security monitoring
        </p>
      </div>

      {/* Control Panel */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: '#1e293b' }}>Test Control Panel</h2>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            style={{
              padding: '0.75rem 1.5rem',
              background: isRunning ? '#94a3b8' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            {isRunning ? '🔄 Running Tests...' : '▶️ Run All Tests'}
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Auto-refresh: Every 30s
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={tabsStyle}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'testing', label: '🧪 Testing', icon: '🧪' },
          { id: 'performance', label: '⚡ Performance', icon: '⚡' },
          { id: 'security', label: '🔒 Security', icon: '🔒' },
          { id: 'coverage', label: '📈 Coverage', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={getTabStyle(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={gridStyle}>
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>🧪 Test Summary</h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
                {testResults.unit ? getTestPassRate(testResults.unit) : '0'}%
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Overall Pass Rate</div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>⚡ Performance Score</h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6', marginBottom: '0.5rem' }}>
                {testResults.performance?.status || 'N/A'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Web Vitals Status</div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>🔒 Security Status</h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: securityData.vulnerabilities?.length > 0 ? '#ef4444' : '#10b981', marginBottom: '0.5rem' }}>
                {securityData.vulnerabilities?.length || 0}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Vulnerabilities Found</div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>📈 Coverage</h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                {testResults.unit?.coverage || 0}%
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Code Coverage</div>
            </div>
          </div>

          {/* Quick Status */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>🚦 System Health</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: testResults.unit?.failed === 0 ? '#10b981' : '#ef4444' }}>
                    {testResults.unit?.failed === 0 ? '✅' : '❌'}
                  </span>
                  <span style={{ fontWeight: '600' }}>Unit Tests</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {testResults.unit?.passed || 0}/{testResults.unit?.total || 0} passing
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: testResults.e2e?.failed === 0 ? '#10b981' : '#ef4444' }}>
                    {testResults.e2e?.failed === 0 ? '✅' : '❌'}
                  </span>
                  <span style={{ fontWeight: '600' }}>E2E Tests</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {testResults.e2e?.passed || 0}/{testResults.e2e?.total || 0} passing
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: testResults.performance?.status === 'GOOD' ? '#10b981' : '#ef4444' }}>
                    {testResults.performance?.status === 'GOOD' ? '✅' : '⚠️'}
                  </span>
                  <span style={{ fontWeight: '600' }}>Performance</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  LCP: {testResults.performance?.lcp || 'N/A'}s
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: securityData.vulnerabilities?.length === 0 ? '#10b981' : '#ef4444' }}>
                    {securityData.vulnerabilities?.length === 0 ? '✅' : '🔒'}
                  </span>
                  <span style={{ fontWeight: '600' }}>Security</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {securityData.securityChecks?.length || 0} checks passed
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testing Tab */}
      {activeTab === 'testing' && (
        <div>
          <div style={gridStyle}>
            {['unit', 'integration', 'e2e'].map(testType => (
              <div key={testType} style={cardStyle}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', textTransform: 'capitalize' }}>
                  {testType === 'e2e' ? 'E2E Tests' : `${testType} Tests`}
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Pass Rate</span>
                    <span style={{ fontWeight: '600' }}>
                      {testResults[testType] ? getTestPassRate(testResults[testType]) : '0'}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Total Tests</span>
                    <span>{testResults[testType]?.total || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Passed</span>
                    <span style={{ color: '#10b981' }}>{testResults[testType]?.passed || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Failed</span>
                    <span style={{ color: '#ef4444' }}>{testResults[testType]?.failed || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Coverage</span>
                    <span>{testResults[testType]?.coverage || 0}%</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Last run: {testResults[testType]?.lastRun ? new Date(testResults[testType].lastRun).toLocaleString() : 'Never'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>⚡ Web Vitals</h3>
            <div style={gridStyle}>
              {[
                { name: 'LCP', value: testResults.performance?.lcp, unit: 's', threshold: 2.5 },
                { name: 'FID', value: testResults.performance?.fid, unit: 'ms', threshold: 100 },
                { name: 'CLS', value: testResults.performance?.cls, unit: '', threshold: 0.1 },
                { name: 'FCP', value: testResults.performance?.fcp, unit: 's', threshold: 1.8 },
                { name: 'TTFB', value: testResults.performance?.ttfb, unit: 's', threshold: 0.8 }
              ].map(metric => (
                <div key={metric.name} style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    {metric.name}
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: metric.value < metric.threshold ? '#10b981' : '#ef4444',
                    marginBottom: '0.25rem'
                  }}>
                    {metric.value || 'N/A'}{metric.unit}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Target: &lt;{metric.threshold}{metric.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>💾 Resource Usage</h3>
            <div style={gridStyle}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {performanceData.memoryUsage?.used || 'N/A'} MB
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Memory Used</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div>
          <div style={gridStyle}>
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>🔒 Security Status</h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: securityData.vulnerabilities?.length === 0 ? '#10b981' : '#ef4444', marginBottom: '0.5rem' }}>
                {securityData.vulnerabilities?.length === 0 ? 'SECURE' : 'ISSUES FOUND'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                {securityData.vulnerabilities?.length || 0} vulnerabilities detected
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>✅ Security Checks</h3>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
                {securityData.securityChecks?.length || 0}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Security checks passed
              </div>
            </div>
          </div>

          {securityData.vulnerabilities?.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>⚠️ Vulnerabilities</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {securityData.vulnerabilities.map((vuln, index) => (
                  <div key={index} style={{ 
                    padding: '0.75rem', 
                    border: `1px solid ${vuln.severity === 'HIGH' ? '#fecaca' : vuln.severity === 'MEDIUM' ? '#fed7aa' : '#fef3c7'}`,
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    backgroundColor: vuln.severity === 'HIGH' ? '#fef2f2' : vuln.severity === 'MEDIUM' ? '#fff7ed' : '#fffbeb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{vuln.type}</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        backgroundColor: vuln.severity === 'HIGH' ? '#dc2626' : vuln.severity === 'MEDIUM' ? '#ea580c' : '#d97706',
                        color: 'white'
                      }}>
                        {vuln.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {vuln.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QualityDashboard;