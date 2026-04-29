import axios from "axios"

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // backend base URL
  withCredentials: true,                // include cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: request interceptor (e.g., attach token)
api.interceptors.request.use(
  (config) => {
    // Example: attach token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: response interceptor (e.g., handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export const setAuthToken = (token) => {
  api.interceptors.request.use(async (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};


export default api;
