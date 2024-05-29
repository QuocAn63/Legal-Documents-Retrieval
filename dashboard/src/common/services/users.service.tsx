import { AxiosInstance } from "axios";
import { IResponseData } from "../types";

export default class UserService {
  constructor(private readonly instance: AxiosInstance) {}

  async getList(
    pageIndex = 1,
    pageSize = 20,
    queries = {}
  ): Promise<IResponseData> {
    return this.instance.get("/users", {
      params: { ...queries, pageIndex, pageSize },
    });
  }

  async delete(IDs: string[]): Promise<IResponseData<string>> {
    return this.instance.delete("/users", {
      data: {
        IDs,
      },
    });
  }
}
