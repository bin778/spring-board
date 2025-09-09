import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

apiClient.interceptors.request.use(
  config => {
    if (['POST', 'PUT', 'DELETE'].includes(config.method?.toUpperCase() || '')) {
      const csrfToken = Cookies.get('XSRF-TOKEN');
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default apiClient;
