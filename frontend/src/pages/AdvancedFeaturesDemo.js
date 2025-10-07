// Advanced Features - Authentication Protected
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PaymentFinancialSystem from '../components/Financial/PaymentFinancialSystem';
import MaintenanceIoTSystem from '../components/Maintenance/MaintenanceIoTSystem';
import AIPoweredSystem from '../components/AI/AIPoweredSystem';
import TenantManagement from '../components/Tenant/TenantManagement';
import AgentManagement from '../components/Agent/AgentManagement';
import './AdvancedFeaturesDemo.css';

const AdvancedFeaturesDemo = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/?login=true" replace />;
  }

  return (
    <div className="advanced-features-demo">
      {/* Simple Header */}
      <header className="demo-header">
        <div className="container">
          <h1>Advanced Features</h1>
          <p>Professional property management tools</p>
        </div>
      </header>

      {/* Clean Navigation Grid */}
      <nav className="features-nav">
        <div className="container">
          <div className="features-grid">
            <Link to="analytics" className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Performance insights</p>
            </Link>
            
            <Link to="landlord" className="feature-card">
              <div className="feature-icon">🏠</div>
              <h3>Landlord Tools</h3>
              <p>Property management</p>
            </Link>
            
            <Link to="financial" className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Financial</h3>
              <p>Payments & reports</p>
            </Link>
            
            <Link to="maintenance" className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Maintenance</h3>
              <p>Work orders & IoT</p>
            </Link>
            
            <Link to="ai" className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Features</h3>
              <p>Smart automation</p>
            </Link>
            
            <Link to="tenants" className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Tenants</h3>
              <p>Tenant lifecycle</p>
            </Link>
            
            <Link to="agents" className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Agents</h3>
              <p>Performance tracking</p>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route index element={<AuthenticatedWelcome user={user} />} />
          <Route path="analytics" element={
            <div className="min-h-screen bg-gray-50 p-6">
              <div className="max-w-7xl mx-auto text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Advanced Analytics</h1>
                <p className="text-gray-600">Comprehensive analytics dashboard will be available here.</p>
              </div>
            </div>
          } />
          <Route path="landlord" element={
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-7xl mx-auto text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Advanced Landlord Tools</h1>
                <p className="text-gray-600">Advanced landlord management tools will be available here.</p>
              </div>
            </div>
          } />
          <Route path="financial" element={<PaymentFinancialSystem />} />
          <Route path="maintenance" element={<MaintenanceIoTSystem />} />
          <Route path="ai" element={<AIPoweredSystem />} />
          <Route path="tenants" element={<TenantManagement />} />
          <Route path="agents" element={<AgentManagement />} />
        </Routes>
      </main>
    </div>
  );
};

const AuthenticatedWelcome = ({ user }) => {
  return (
    <div className="welcome-page">
      <div className="container">
        <div className="welcome-content">
          <h1>Welcome, {user?.name || 'User'}!</h1>
          <p className="welcome-subtitle">Choose a feature to get started</p>
          
          <div className="status-badge">
            <span className="status-dot"></span>
            All systems online
          </div>
          
          <div className="quick-stats">
            <div className="stat-item">
              <div className="stat-number">7</div>
              <div className="stat-label">Available Features</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeaturesDemo;