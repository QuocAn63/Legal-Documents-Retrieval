import { IResponseData } from "../types";
import axiosInstance from "./axios";

export default class UserService {
  static async getList(pageIndex = 1, pageSize = 20): Promise<IResponseData> {
    return axiosInstance.get(`/users`, { params: { pageIndex, pageSize } });
  }

  static async get(userID: string): Promise<IResponseData> {
    return axiosInstance.get(`/users/${userID}`);
  }
}
