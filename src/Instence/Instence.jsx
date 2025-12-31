// src/Instance.js
import axios from 'axios';

// const BaseUrl = 'http://localhost:8080/api'; 

const BaseUrl = 'https://api.myhomeqr.com/api';

// Create an instance of axios with default configurations
const Instance = axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers here, such as authorization
  },
});


Instance.interceptors.request.use((config) => {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  if (authUser?.token) {
    config.headers.Authorization = `Bearer ${authUser.token}`;
  }
  return config;
});

export { Instance, BaseUrl };

const authInstance = axios.create({
  // baseURL: "http://localhost:8080/api/auth",
  baseURL: "https://qrapi.plotnetwork.in/api/auth",
  headers: { "Content-Type": "application/json" },
});


export default authInstance;