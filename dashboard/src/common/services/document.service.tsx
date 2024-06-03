import { IAddDocument } from "../interfaces/document";
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

  async add_documents(data: IAddDocument): Promise<IResponseData> {
    return this.instance.post("/documents/", data);
  }

  async update_documents(data: IAddDocument): Promise<IResponseData> {
    return this.instance.patch("/documents/", data);
  }

  async delete_documents(data: IDeleteDocument): Promise<IResponseData> {
    return this.instance.delete("/documents", data);
  }

  async extract_documents(file: FormData): Promise<IResponseData> {
    return this.instance.post("/documents/extract", file, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}
