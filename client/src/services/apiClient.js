import axios from 'axios';

const DEBUG_API = import.meta.env.DEV || import.meta.env.VITE_DEBUG_API === 'true';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.response.use(
  (response) => {
    if (DEBUG_API) {
      const method = (response.config?.method || 'GET').toUpperCase();
      const fullUrl = `${response.config?.baseURL || ''}${response.config?.url || ''}`;
      console.info('[API][RESPONSE]', method, fullUrl, response.status);
    }
    return response;
  },
  (error) => {
    if (DEBUG_API) {
      const method = (error.config?.method || 'GET').toUpperCase();
      const fullUrl = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
      const status = error.response?.status || 'NO_STATUS';
      const responseData = error.response?.data || null;
      console.error('[API][ERROR]', method, fullUrl, status, responseData);
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Request failed. Please try again.';
    return Promise.reject(new Error(message));
  }
);

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (DEBUG_API) {
    const method = (config.method || 'GET').toUpperCase();
    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    console.info('[API][REQUEST]', method, fullUrl);
  }

  return config;
});

export default apiClient;
