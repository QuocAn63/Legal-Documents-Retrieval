import axios from "../services/axios";
import { ResponseDataType } from "../types";

export default class ReportService {
  static async getList(
    pageIndex = 1,
    pageSize = 20,
    queries = {}
  ): Promise<ResponseDataType> {
    return axios.get("/reports", {
      params: { ...queries, pageIndex, pageSize },
    });
  }

  static async getList_messages(reportID: string): Promise<ResponseDataType> {
    return axios.get(`/reports/${reportID}`);
  }

  static async getList_reasons(
    pageIndex = 1,
    pageSize = 20,
    queries = {}
  ): Promise<ResponseDataType> {
    return axios.get("/reports/reasons", {});
  }

  static async delete(IDs: string[]): Promise<string> {
    return axios.delete("/reports", {
      data: {
        IDs: JSON.stringify(IDs),
      },
    });
  }
}
