/**
 * Landlord API Service
 * Connects to backend for landlord management features
 */

const API_BASE_URL = 'http://localhost:5001/api';

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Create authenticated API headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const landlordAPI = {
  // Get portfolio overview
  getPortfolioOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/landlord/portfolio`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get tenant list
  getTenants: async () => {
    const response = await fetch(`${API_BASE_URL}/landlord/tenants`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get financial summary
  getFinancials: async (timeRange = '30d') => {
    const response = await fetch(`${API_BASE_URL}/landlord/financials?timeRange=${timeRange}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get compliance status
  getCompliance: async () => {
    const response = await fetch(`${API_BASE_URL}/landlord/compliance`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Add new property
  addProperty: async (propertyData) => {
    const response = await fetch(`${API_BASE_URL}/landlord/properties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Update property
  updateProperty: async (propertyId, propertyData) => {
    const response = await fetch(`${API_BASE_URL}/landlord/properties/${propertyId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Add tenant
  addTenant: async (tenantData) => {
    const response = await fetch(`${API_BASE_URL}/landlord/tenants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tenantData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};

export default landlordAPI;