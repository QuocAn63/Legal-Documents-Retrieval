import axios from "../services/axios";
import { ResponseDataType } from "../types";

export default class UserService {
  static async getList(
    pageIndex = 1,
    pageSize = 20,
    queries = {}
  ): Promise<ResponseDataType> {
    return axios.get("/users", { params: { ...queries, pageIndex, pageSize } });
  }

  static async delete(IDs: string[]): Promise<string> {
    return axios.delete("/users", {
      data: {
        IDs,
      },
    });
  }
}
