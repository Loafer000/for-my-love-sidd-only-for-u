// Test API Health Check from Frontend
import { checkHealth } from '../services/api';

export const testAPIConnection = async () => {
  try {
    console.log('🔄 Testing API connection...');
    const response = await checkHealth();
    console.log('✅ API Connection Success:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ API Connection Failed:', error);
    return { success: false, error: error.message };
  }
};

// You can run this test in the browser console:
// import('./tests/testAPI.js').then(module => module.testAPIConnection());