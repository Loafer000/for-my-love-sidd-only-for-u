// API Error Handler
export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Enhanced API service with better error handling
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth headers
  getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  // Handle API responses
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new APIError(errorMessage, response.status, data);
    }

    return data;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.headers),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      // Network or other errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new APIError('Network error. Please check your connection.', 0);
      }
      
      throw new APIError(error.message || 'An unexpected error occurred', 0);
    }
  }

  // HTTP Methods
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    return this.request(url.pathname + url.search, { method: 'GET' });
  }

  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  // File upload method
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

// Create singleton instance
const apiService = new APIService();

// Auth API methods
export const authAPI = {
  async register(userData) {
    return apiService.post('/auth/register', userData);
  },

  async login(credentials) {
    const response = await apiService.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    return apiService.post('/auth/logout');
  },

  async forgotPassword(email) {
    return apiService.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, password) {
    return apiService.post('/auth/reset-password', { token, password });
  },

  async verifyEmail(token) {
    return apiService.post('/auth/verify-email', { token });
  },

  async sendOTP(phoneNumber) {
    return apiService.post('/auth/send-otp', { phoneNumber });
  },

  async verifyOTP(phoneNumber, otp) {
    const response = await apiService.post('/auth/verify-otp', { phoneNumber, otp });
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  async refreshToken() {
    return apiService.post('/auth/refresh');
  },

  async checkAuthStatus() {
    return apiService.get('/auth/me');
  }
};

// User API methods
export const userAPI = {
  async getProfile() {
    return apiService.get('/users/profile');
  },

  async updateProfile(userData) {
    return apiService.put('/users/profile', userData);
  },

  async uploadProfilePhoto(file) {
    return apiService.uploadFile('/users/profile/photo', file);
  },

  async changePassword(passwordData) {
    return apiService.put('/users/change-password', passwordData);
  },

  async updateNotificationSettings(settings) {
    return apiService.put('/users/notifications', settings);
  },

  async deactivateAccount() {
    return apiService.delete('/users/account');
  }
};

// Property API methods
export const propertyAPI = {
  async getProperties(filters = {}) {
    return apiService.get('/properties', filters);
  },

  async getProperty(id) {
    return apiService.get(`/properties/${id}`);
  },

  async createProperty(propertyData) {
    return apiService.post('/properties', propertyData);
  },

  async updateProperty(id, propertyData) {
    return apiService.put(`/properties/${id}`, propertyData);
  },

  async deleteProperty(id) {
    return apiService.delete(`/properties/${id}`);
  },

  async uploadPropertyPhotos(id, files) {
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));
    
    return apiService.request(`/properties/${id}/photos`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type
    });
  },

  async searchProperties(query, filters = {}) {
    return apiService.get('/properties/search', { q: query, ...filters });
  },

  async getFeaturedProperties() {
    return apiService.get('/properties/featured');
  },

  async getRecommendations(userId) {
    return apiService.get(`/properties/recommendations/${userId}`);
  }
};

// Booking API methods
export const bookingAPI = {
  async createBooking(bookingData) {
    return apiService.post('/bookings', bookingData);
  },

  async getBookings(filters = {}) {
    return apiService.get('/bookings', filters);
  },

  async getBooking(id) {
    return apiService.get(`/bookings/${id}`);
  },

  async updateBooking(id, bookingData) {
    return apiService.put(`/bookings/${id}`, bookingData);
  },

  async cancelBooking(id, reason) {
    return apiService.patch(`/bookings/${id}/cancel`, { reason });
  }
};

// Health check
export const healthAPI = {
  async checkHealth() {
    return apiService.get('/health');
  }
};

// Export the service instance for custom requests
export default apiService;