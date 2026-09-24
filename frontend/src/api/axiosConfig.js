// src/api/axiosConfig.js
import axios from 'axios';

// Create a new axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend's API prefix
  withCredentials: true  // This is the most important part!
});

export default apiClient;