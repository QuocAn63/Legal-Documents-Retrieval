import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";

const useAxios = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.auth?.token);

  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
    },
    timeout: 20000,
  });

  instance.interceptors.request.use(
    async (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

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
