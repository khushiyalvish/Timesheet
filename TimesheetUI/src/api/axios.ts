import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:7034/api', // your ASP.NET Core API base URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;