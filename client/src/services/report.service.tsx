import FakeReportAPI from "./fakeAPIs/report.fakeservice";

export class ReportService {
  static async getListReasons() {
    return FakeReportAPI.getListReasons();
  }

  static async saveReport(data: any) {
    return FakeReportAPI.saveReport(data);
  }

  static async updateReport() {
    return FakeReportAPI.updateReport("");
  }
}
