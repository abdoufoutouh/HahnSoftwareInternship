/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { tokenService } from '../services/tokenService';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false); // boolean: authenticated or not
  const [loading, setLoading] = useState(true);

  // Restore auth state from localStorage on app reload
  useEffect(() => {
    const token = tokenService.getToken();
    if (token) {
      setUser(true);
    }
    setLoading(false);
  }, []);

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<void>}
   * @throws {Error} If login fails
   */
  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      tokenService.setToken(response.token);
      setUser(true);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Sign up new user
   * @param {string} firstName - User first name
   * @param {string} lastName - User last name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<void>}
   * @throws {Error} If signup fails
   */
  const signup = async (firstName, lastName, email, password) => {
    try {
      await authApi.signup(firstName, lastName, email, password);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    tokenService.removeToken();
    setUser(false);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

