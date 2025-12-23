/**
 * Project Service
 * Centralizes API calls for project-related operations
 */
import apiClient from './authApi';

export const projectService = {
  /**
   * Create a new project
   * @param {{ title: string, description?: string }} payload
   * @returns {Promise<Object>} Created project object
   */
  async createProject(payload) {
    const { title, description } = payload || {};
    const response = await apiClient.post('/api/projects/create', {
      title,
      description,
    });
    return response.data;
  },
};

export default projectService;
