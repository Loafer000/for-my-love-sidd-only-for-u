import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Homepage from './pages/Homepage';
import SearchResults from './pages/SearchResults';
import PropertyDetails from './pages/PropertyDetails';
import Dashboard from './pages/Dashboard';
import TenantDashboard from './pages/TenantDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import AgentDashboardPage from './pages/AgentDashboardPage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';
import IntegrationTest from './components/Testing/IntegrationTest';
import AdvancedFeaturesDemo from './pages/AdvancedFeaturesDemo';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PropertyProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tenant-dashboard" element={<TenantDashboard />} />
                <Route path="/owner-dashboard" element={<OwnerDashboard />} />
                <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
                <Route path="/agent-dashboard" element={<AgentDashboardPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/test" element={<IntegrationTest />} />
                <Route path="/advanced-features/*" element={<AdvancedFeaturesDemo />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </PropertyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;