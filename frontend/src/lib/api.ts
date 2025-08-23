import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export const getCsrfCookie = () => api.get('/sanctum/csrf-cookie');

export default api;
