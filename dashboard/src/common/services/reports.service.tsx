import { AxiosInstance } from "axios";
import { IResponseData } from "../types";

export default class ReportService {
  constructor(private readonly instance: AxiosInstance) {}

  async getList(
    pageIndex = 1,
    pageSize = 20,
    queries = {}
  ): Promise<IResponseData> {
    return this.instance.get("/reports", {
      params: { ...queries, pageIndex, pageSize },
    });
  }

  async getList_messages(reportID: string): Promise<IResponseData> {
    return this.instance.get(`/reports/${reportID}`);
  }

  async getList_reasons(
    pageIndex = 1,
    pageSize = 20,
    queries = {}
  ): Promise<IResponseData> {
    return this.instance.get("/reports/reasons", {
      params: {
        pageIndex,
        pageSize,
        ...queries,
      },
    });
  }

  async delete(IDs: string[]): Promise<string> {
    return this.instance.delete("/reports", {
      data: {
        IDs: JSON.stringify(IDs),
      },
    });
  }

  async update(reportID: string, status: string): Promise<string> {
    return this.instance.patch("/reports", {
      reportID,
      status: status.toString(),
    });
  }
}
