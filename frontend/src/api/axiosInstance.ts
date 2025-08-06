import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // proxy is set up in vite.config.ts
  timeout: 10000,
  // You can add headers or interceptors here
});

export default axiosInstance;