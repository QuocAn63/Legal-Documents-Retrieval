import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";

const useAxios = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.user?.token);

  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/api/`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    async (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        navigate("/login");
      }

      return Promise.reject(error.response?.data);
    }
  );

  return { instance };
};

export default useAxios;
