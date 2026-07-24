import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (if present) to every outgoing request.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("voyage_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized 401 handling - if the token is invalid/expired, clear it
// and let the app redirect to login via AuthContext state.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("voyage_token");
      localStorage.removeItem("voyage_user");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
