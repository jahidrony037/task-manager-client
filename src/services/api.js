import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth api
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

// Team api
export const teamAPI = {
  getAll: () => api.get('/teams'),
  getOne: (id) => api.get(`/teams/singleTeam/${id}`),
  create: (data) => api.post('/teams/createTeam', data),
  update: (id, data) => api.put(`/teams/updateTeam/${id}`, data),
  delete: (id) => api.delete(`/teams/deleteTeam/${id}`),
  addMember: (id, data) => api.post(`/teams/${id}/members`, data),
  updateMember: (teamId, memberId, data) => api.put(`/teams/${teamId}/members/${memberId}`, data),
  deleteMember: (teamId, memberId) => api.delete(`/teams/${teamId}/members/${memberId}`)
};

// Project api
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects/createProject', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`)
};

// Task api
export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks/createTask', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  autoAssign: (id) => api.post(`/tasks/auto-assign/${id}`)
};

// Dashboard api
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  reassignTasks: () => api.post('/dashboard/reassign-tasks'),
  getActivityLogs: () => api.get('/dashboard/activity-logs')
};

export default api;