import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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