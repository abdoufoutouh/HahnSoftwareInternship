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

  /**
   * Get all tasks for a project
   * @param {number} projectId - The ID of the project
   * @returns {Promise<Array>} Array of task objects
   */
  async getTasksByProject(projectId) {
    try {
      const response = await taskClient.get(`/api/tasks/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  /**
   * Toggle task completion status
   * @param {number} taskId - The ID of the task
   * @returns {Promise<Object>} Updated task object
   */
  async toggleTask(taskId) {
    try {
      console.log('Toggling task:', taskId);
      const url = `/api/tasks/${taskId}/toggle`;
      console.log('Request URL:', url);
      const response = await taskClient.patch(url);
      console.log('Toggle response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error toggling task:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: error.config
      });
      throw error;
    }
  },

  /**
   * Update a task
   * @param {number} taskId - The ID of the task
   * @param {{ title: string; description?: string; dueDate: string }} payload
   * @returns {Promise<Object>} Updated task object
   */
  async updateTask(taskId, payload) {
    try {
      const response = await taskClient.put(`/api/tasks/${taskId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  /**
   * Delete a task
   * @param {number} taskId - The ID of the task
   * @returns {Promise<void>}
   */
  async deleteTask(taskId) {
    try {
      await taskClient.delete(`/api/tasks/${taskId}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};

