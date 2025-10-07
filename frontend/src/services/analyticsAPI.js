/**
 * Analytics API Service
 * Connects to backend for real analytics data
 */

const API_BASE_URL = 'http://localhost:5001/api';

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Create authenticated API headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const analyticsAPI = {
  // Get overview analytics
  getOverviewAnalytics: async (timeRange = '30d') => {
    const response = await fetch(`${API_BASE_URL}/analytics/overview?timeRange=${timeRange}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get revenue analytics
  getRevenueAnalytics: async (timeRange = '30d') => {
    const response = await fetch(`${API_BASE_URL}/analytics/revenue?timeRange=${timeRange}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get occupancy analytics
  getOccupancyAnalytics: async (timeRange = '30d') => {
    const response = await fetch(`${API_BASE_URL}/analytics/occupancy?timeRange=${timeRange}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get maintenance analytics
  getMaintenanceAnalytics: async (timeRange = '30d') => {
    const response = await fetch(`${API_BASE_URL}/analytics/maintenance?timeRange=${timeRange}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get lead analytics
  getLeadAnalytics: async (timeRange = '30d') => {
    const response = await fetch(`${API_BASE_URL}/analytics/leads?timeRange=${timeRange}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get property performance
  getPropertyPerformance: async (timeRange = '30d') => {
    const response = await fetch(`${API_BASE_URL}/analytics/property-performance?timeRange=${timeRange}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Export analytics report
  exportReport: async (format = 'pdf', timeRange = '30d', metrics = []) => {
    const response = await fetch(`${API_BASE_URL}/analytics/export`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        format,
        timeRange,
        metrics
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.blob(); // For file download
  }
};

export default analyticsAPI;