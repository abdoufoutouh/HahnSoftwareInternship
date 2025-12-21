/**
 * Authentication API
 * Handles all authentication-related API calls
 */
import axios from 'axios';
import { tokenService } from '../services/tokenService';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to protected requests
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenService.removeToken();
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API functions
 */
export const authApi = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{token: string, type: string}>} JWT token
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // Re-throw with better error handling
      if (error.response) {
        // Server responded with error status
        throw error;
      } else if (error.request) {
        // Request was made but no response received
        const networkError = new Error('Network error: Unable to connect to server. Please check if the backend is running.');
        networkError.response = { status: 0, data: { message: 'Network error' } };
        throw networkError;
      } else {
        // Something else happened
        throw error;
      }
    }
  },

  /**
   * Sign up new user
   * @param {string} firstName - User first name
   * @param {string} lastName - User last name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<void>}
   */
  async signup(firstName, lastName, email, password) {
    try {
      const response = await apiClient.post('/auth/signup', {
        firstName,
        lastName,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // Re-throw with better error handling
      if (error.response) {
        // Server responded with error status
        throw error;
      } else if (error.request) {
        // Request was made but no response received
        const networkError = new Error('Network error: Unable to connect to server. Please check if the backend is running.');
        networkError.response = { status: 0, data: { message: 'Network error' } };
        throw networkError;
      } else {
        // Something else happened
        throw error;
      }
    }
  },
};

// Export the configured axios instance for other API calls
export default apiClient;

