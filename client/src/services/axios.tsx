import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // write later
    // const userToken = useSelector((state: RootState) => state.user.user?.token);

    // if (userToken) {
    //   config.headers.Authorization = `Bearer ${userToken}`;
    // }

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
