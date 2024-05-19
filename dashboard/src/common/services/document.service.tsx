import { IResponseData } from "../types";
import axios from "./axios";

export class DocumentService {
  constructor(private readonly token: string) {}

  async getList_documents(): Promise<IResponseData> {
    return axios.get(`/documents`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async get_documents(documentID: string): Promise<IResponseData> {
    return axios.get(`/documents/${documentID}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
