import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    console.log('Axios request:', config.method.toUpperCase(), config.url, 'Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log('Axios response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Axios response error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Clearing token and redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
