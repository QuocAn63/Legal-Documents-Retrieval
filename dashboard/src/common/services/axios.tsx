import axios from "axios";
import { Navigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // write later
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // write later
    return response.data;
  },
  (error) => {
    if (error.message.status === 401) {
      Navigate({ to: "/login" });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
