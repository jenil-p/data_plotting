import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => {
    // console.log('API Success:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status);
    if (error.response?.status === 401) {
      // console.log('Clearing invalid token');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;
