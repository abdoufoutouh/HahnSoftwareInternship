/**
 * Token Service
 * Manages JWT token storage and retrieval from localStorage
 */

const TOKEN_KEY = 'jwt_token';

export const tokenService = {
  /**
   * Get the stored JWT token
   * @returns {string|null} The JWT token or null if not found
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Store the JWT token in localStorage
   * @param {string} token - The JWT token to store
   */
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Remove the JWT token from localStorage
   */
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Check if a token exists
   * @returns {boolean} True if token exists, false otherwise
   */
  hasToken() {
    return !!this.getToken();
  }
};







