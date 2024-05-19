import { AxiosInstance } from "axios";
import { IResponseData } from "../interfaces/request";

export class ReportService {
  constructor(private readonly instance: AxiosInstance) {}

  async getListReasons() {
    return this.instance.get("/reports/reasons");
  }

  async saveReport(data: any): Promise<IResponseData> {
    return this.instance.post("/reports", data, {});
  }
}
