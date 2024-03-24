import { faker } from "@faker-js/faker";
import { IResponseData } from "../../interfaces/request";

const reasonsData = [
  {
    reasonID: faker.string.uuid(),
    description: faker.lorem.words({ min: 1, max: 5 }),
  },
  {
    reasonID: faker.string.uuid(),
    description: faker.lorem.words({ min: 1, max: 5 }),
  },
  {
    reasonID: faker.string.uuid(),
    description: faker.lorem.words({ min: 1, max: 5 }),
  },
  {
    reasonID: faker.string.uuid(),
    description: faker.lorem.words({ min: 1, max: 5 }),
  },
];

export default class FakeReportAPI {
  public static getListReasons(): Promise<IResponseData> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ status: 200, data: reasonsData });
      }, 2000);
    });
  }

  public static saveReport(data: any): Promise<IResponseData> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log({ message: "Report saved", data });
        resolve({ status: 200 });
      }, 2000);
    });
  }

  public static updateReport(reportID: string): Promise<IResponseData> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ status: 200 });
      }, 2000);
    });
  }
}
