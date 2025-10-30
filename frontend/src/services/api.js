import axios from 'axios';

// AFTER
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const compilerAPI = {
  compile: (sourceCode) => api.post('/compiler/compile', { sourceCode }),
};

export const snippetsAPI = {
  getAll: () => api.get('/snippets'),
  getById: (id) => api.get(`/snippets/${id}`),
  create: (snippet) => api.post('/snippets', snippet),
};

export default api;