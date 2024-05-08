import { IResponseData } from "../interfaces/request";
import {
  ISharedConversation1,
  ISharedConversation2,
} from "../interfaces/shared";
import axiosInstance from "./axios";
import FakeShareService from "./fakeAPIs/share.fakerservice";

export default class SharedService {
  token: string | null;
  constructor(token: string) {
    this.token = token;
  }

  getList_shared(): Promise<IResponseData<ISharedConversation1[]>> {
    return axiosInstance.get("/sharedConversations", {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  get_shared(sharedCode: string): Promise<IResponseData<ISharedConversation2>> {
    return axiosInstance.get(`/sharedConversations/${sharedCode}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async save_shared(conversationID: string): Promise<IResponseData> {
    return await axiosInstance.post(
      "/sharedConversations",
      {
        conversationID,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  regenerate_shared(sharedID: string): Promise<IResponseData<string>> {
    return FakeShareService.regenerate_shared(sharedID);
  }

  delete_shared(sharedID: string): Promise<IResponseData<string>> {
    return FakeShareService.delete_shared(sharedID);
  }
}
