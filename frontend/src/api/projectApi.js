import axios from 'axios';
import { tokenService } from '../services/tokenService';

const API_BASE_URL = 'http://localhost:8080';

// Axios instance for project-related APIs
const projectClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token
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
   * Create a new project
   * @param {{ title: string; description?: string }} payload
   */
  async createProject(payload) {
    const res = await projectClient.post('/api/projects/create', payload);
    return res.data;
  },
};
