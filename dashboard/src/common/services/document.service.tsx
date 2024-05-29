import { IResponseData } from "../types";
import { AxiosInstance } from "axios";

export class DocumentService {
  constructor(private readonly instance: AxiosInstance) {}

  async getList_documents(): Promise<IResponseData> {
    return this.instance.get(`/documents`);
  }

  async get_documents(documentID: string): Promise<IResponseData> {
    return this.instance.get(`/documents/${documentID}`);
  }
}
