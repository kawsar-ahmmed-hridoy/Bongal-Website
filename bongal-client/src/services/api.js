import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
      const requestUrl = error.config?.url || '';
      const requestMethod = error.config?.method || '';

      // Don't redirect to login for guest checkout (order creation)
      const isGuestCheckout = requestUrl.includes('/orders') && requestMethod === 'post';

      // Don't redirect for public endpoints (products, etc.)
      const isPublicEndpoint = requestUrl.includes('/products') ||
        requestUrl.includes('/categories');

      if (!isGuestCheckout && !isPublicEndpoint) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
