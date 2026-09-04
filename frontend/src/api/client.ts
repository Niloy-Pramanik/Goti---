import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT interceptor: attach token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('prokoi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('prokoi_token');
      localStorage.removeItem('prokoi_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
