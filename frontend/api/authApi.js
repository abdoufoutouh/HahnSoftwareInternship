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
   * @returns {Promise<{token: string}>} JWT token
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
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
    const response = await apiClient.post('/auth/signup', {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  },
};

// Export the configured axios instance for other API calls
export default apiClient;

