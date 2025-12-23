import axios from 'axios';
import { tokenService } from '../services/tokenService';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance
const projectClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
projectClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const projectApi = {
  /**
   * Get all projects for the authenticated user
   * @returns {Promise<Array>} Array of project objects
   */
  async getMyProjects() {
    try {
      const response = await projectClient.get('/api/projects');
      // Ensure we return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  /**
   * Create a new project
   * @param {{ title: string; description?: string }} payload
   * @returns {Promise<Object>} Created project object
   */
  async createProject(payload) {
    try {
      const response = await projectClient.post('/api/projects/create', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  /**
   * Delete a project by ID
   * @param {number} projectId - The ID of the project to delete
   * @returns {Promise<void>}
   */
  async deleteProject(projectId) {
    try {
      await projectClient.delete(`/api/projects/${projectId}`);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  /**
   * Get project progress by ID
   * @param {number} projectId - The ID of the project
   * @returns {Promise<{projectId: number, totalTasks: number, completedTasks: number, progressPercentage: number}>}
   */
  async getProjectProgress(projectId) {
    try {
      const response = await projectClient.get(`/api/projects/${projectId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project progress:', error);
      throw error;
    }
  },
};
