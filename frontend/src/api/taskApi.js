import axios from 'axios';
import { tokenService } from '../services/tokenService';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance for task-related APIs
const taskClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
taskClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const taskApi = {
  /**
   * Create a new task for a project
   * @param {number} projectId - The ID of the project
   * @param {{ title: string; description?: string; dueDate: string }} payload
   * @returns {Promise<Object>} Created task object
   */
  async createTask(projectId, payload) {
    try {
      const response = await taskClient.post(`/api/tasks/project/${projectId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
};

