import api from './api';

// Advanced Features API Service
export const advancedFeaturesAPI = {
  
  // ============ ANALYTICS API ============
  analytics: {
    // Get dashboard overview analytics
    getDashboard: async (timeRange = '30d') => {
      try {
        const response = await api.get(`/analytics/dashboard?timeRange=${timeRange}`);
        return response.data;
      } catch (error) {
        console.error('Analytics dashboard error:', error);
        throw error;
      }
    },

    // Get revenue analytics
    getRevenue: async (timeRange = '30d') => {
      try {
        const response = await api.get(`/analytics/revenue?timeRange=${timeRange}`);
        return response.data;
      } catch (error) {
        console.error('Revenue analytics error:', error);
        throw error;
      }
    },

    // Get occupancy analytics
    getOccupancy: async (timeRange = '30d') => {
      try {
        const response = await api.get(`/analytics/occupancy?timeRange=${timeRange}`);
        return response.data;
      } catch (error) {
        console.error('Occupancy analytics error:', error);
        throw error;
      }
    },

    // Get performance analytics
    getPerformance: async (timeRange = '30d') => {
      try {
        const response = await api.get(`/analytics/performance?timeRange=${timeRange}`);
        return response.data;
      } catch (error) {
        console.error('Performance analytics error:', error);
        throw error;
      }
    }
  },

  // ============ LANDLORD TOOLS API ============
  landlord: {
    // Get landlord dashboard
    getDashboard: async () => {
      try {
        const response = await api.get('/landlord/dashboard');
        return response.data;
      } catch (error) {
        console.error('Landlord dashboard error:', error);
        throw error;
      }
    },

    // Get portfolio data
    getPortfolio: async () => {
      try {
        const response = await api.get('/landlord/portfolio');
        return response.data;
      } catch (error) {
        console.error('Portfolio data error:', error);
        throw error;
      }
    },

    // Get tenant management data
    getTenants: async () => {
      try {
        const response = await api.get('/landlord/tenants');
        return response.data;
      } catch (error) {
        console.error('Tenant management error:', error);
        throw error;
      }
    },

    // Get documents data
    getDocuments: async () => {
      try {
        const response = await api.get('/landlord/documents');
        return response.data;
      } catch (error) {
        console.error('Documents data error:', error);
        throw error;
      }
    },

    // Get compliance data
    getCompliance: async () => {
      try {
        const response = await api.get('/landlord/compliance');
        return response.data;
      } catch (error) {
        console.error('Compliance data error:', error);
        throw error;
      }
    }
  },

  // ============ FINANCIAL TOOLS API ============
  financial: {
    // Get financial dashboard
    getDashboard: async () => {
      try {
        const response = await api.get('/financial/dashboard');
        return response.data;
      } catch (error) {
        console.error('Financial dashboard error:', error);
        throw error;
      }
    },

    // Get payment data
    getPayments: async () => {
      try {
        const response = await api.get('/payments/dashboard');
        return response.data;
      } catch (error) {
        console.error('Payments data error:', error);
        throw error;
      }
    },

    // Create payment order
    createPaymentOrder: async (orderData) => {
      try {
        const response = await api.post('/payments/create-order', orderData);
        return response.data;
      } catch (error) {
        console.error('Create payment order error:', error);
        throw error;
      }
    },

    // Verify payment
    verifyPayment: async (paymentData) => {
      try {
        const response = await api.post('/payments/verify', paymentData);
        return response.data;
      } catch (error) {
        console.error('Verify payment error:', error);
        throw error;
      }
    },

    // Get financial reports
    getReports: async (reportType = 'monthly') => {
      try {
        const response = await api.get(`/financial/reports?type=${reportType}`);
        return response.data;
      } catch (error) {
        console.error('Financial reports error:', error);
        throw error;
      }
    }
  },

  // ============ MAINTENANCE TOOLS API ============
  maintenance: {
    // Get maintenance dashboard
    getDashboard: async () => {
      try {
        const response = await api.get('/maintenance/dashboard');
        return response.data;
      } catch (error) {
        console.error('Maintenance dashboard error:', error);
        throw error;
      }
    },

    // Get work orders
    getWorkOrders: async (status = 'all') => {
      try {
        const response = await api.get(`/maintenance/work-orders?status=${status}`);
        return response.data;
      } catch (error) {
        console.error('Work orders error:', error);
        throw error;
      }
    },

    // Create work order
    createWorkOrder: async (workOrderData) => {
      try {
        const response = await api.post('/maintenance/work-orders', workOrderData);
        return response.data;
      } catch (error) {
        console.error('Create work order error:', error);
        throw error;
      }
    },

    // Get IoT data
    getIoTData: async () => {
      try {
        const response = await api.get('/maintenance/iot-data');
        return response.data;
      } catch (error) {
        console.error('IoT data error:', error);
        throw error;
      }
    }
  },

  // ============ AI FEATURES API ============
  ai: {
    // Get AI dashboard
    getDashboard: async () => {
      try {
        const response = await api.get('/ai/dashboard');
        return response.data;
      } catch (error) {
        console.error('AI dashboard error:', error);
        throw error;
      }
    },

    // Get automation data
    getAutomation: async () => {
      try {
        const response = await api.get('/ai/automation');
        return response.data;
      } catch (error) {
        console.error('AI automation error:', error);
        throw error;
      }
    },

    // Get AI insights
    getInsights: async () => {
      try {
        const response = await api.get('/ai/insights');
        return response.data;
      } catch (error) {
        console.error('AI insights error:', error);
        throw error;
      }
    },

    // Get AI predictions
    getPredictions: async () => {
      try {
        const response = await api.get('/ai/predictions');
        return response.data;
      } catch (error) {
        console.error('AI predictions error:', error);
        throw error;
      }
    },

    // Get AI recommendations
    getRecommendations: async () => {
      try {
        const response = await api.get('/ai/recommendations');
        return response.data;
      } catch (error) {
        console.error('AI recommendations error:', error);
        throw error;
      }
    }
  },

  // ============ TENANT LIFECYCLE API ============
  tenant: {
    // Get tenant dashboard
    getDashboard: async () => {
      try {
        const response = await api.get('/tenant/dashboard');
        return response.data;
      } catch (error) {
        console.error('Tenant dashboard error:', error);
        throw error;
      }
    },

    // Get onboarding data
    getOnboarding: async () => {
      try {
        const response = await api.get('/tenant/onboarding');
        return response.data;
      } catch (error) {
        console.error('Tenant onboarding error:', error);
        throw error;
      }
    },

    // Get tenant management data
    getManagement: async () => {
      try {
        const response = await api.get('/tenant/management');
        return response.data;
      } catch (error) {
        console.error('Tenant management error:', error);
        throw error;
      }
    },

    // Get communication data
    getCommunication: async () => {
      try {
        const response = await api.get('/tenant/communication');
        return response.data;
      } catch (error) {
        console.error('Tenant communication error:', error);
        throw error;
      }
    }
  },

  // ============ AGENT PERFORMANCE API ============
  agent: {
    // Get agent dashboard
    getDashboard: async () => {
      try {
        const response = await api.get('/agent/dashboard');
        return response.data;
      } catch (error) {
        console.error('Agent dashboard error:', error);
        throw error;
      }
    },

    // Get performance data
    getPerformance: async () => {
      try {
        const response = await api.get('/agent/performance');
        return response.data;
      } catch (error) {
        console.error('Agent performance error:', error);
        throw error;
      }
    },

    // Get sales data
    getSales: async () => {
      try {
        const response = await api.get('/agent/sales');
        return response.data;
      } catch (error) {
        console.error('Agent sales error:', error);
        throw error;
      }
    },

    // Get client data
    getClients: async () => {
      try {
        const response = await api.get('/agent/clients');
        return response.data;
      } catch (error) {
        console.error('Agent clients error:', error);
        throw error;
      }
    }
  }
};

export default advancedFeaturesAPI;