import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TenantDashboard from './TenantDashboard';
import OwnerDashboard from './OwnerDashboard';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Don't render anything while checking authentication
  if (!isAuthenticated) {
    return null;
  }

  // Route to appropriate dashboard based on user type
  if (user?.userType === 'agent') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Agent Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}! Your agent tools will be available here.</p>
          </div>
        </div>
      </div>
    );
  } else if (user?.userType === 'landlord' || user?.userType === 'owner') {
    return <OwnerDashboard />;
  } else {
    return <TenantDashboard />;
  }
};

export default Dashboard;