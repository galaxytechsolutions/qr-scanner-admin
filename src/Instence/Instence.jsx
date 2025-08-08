// src/Instance.js
import axios from 'axios';

const BaseUrl = 'https://api.cinemachance.in'; // Your base URL
// const BaseUrl = 'http://localhost:4000'; // Your base URL

// Create an instance of axios with default configurations
const Instance = axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers here, such as authorization
  },
});

export  {Instance, BaseUrl};
