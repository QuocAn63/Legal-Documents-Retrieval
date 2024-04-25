import axiosLib from "axios";
import { Navigate } from "react-router-dom";

const axios = axiosLib.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
  },
  timeout: 20000,
});

axios.interceptors.request.use(
  (config) => {
    if (
      config.method === "get" &&
      config.params &&
      Object.keys(config.params).length > 0
    ) {
      let filterdParams = {};

      Object.keys(config.params).forEach((key) => {
        const value = config.params[key];
        if (value !== "") {
          filterdParams = { ...filterdParams, [key]: value };
        }
      });

      config.params = filterdParams;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
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

export default axios;
