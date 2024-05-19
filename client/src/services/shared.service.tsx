import { IResponseData } from "../interfaces/request";
import { ISharedConversation2 } from "../interfaces/shared";
import { AxiosInstance } from "axios";
import FakeShareService from "./fakeAPIs/share.fakerservice";

export default class SharedService {
  constructor(private readonly instance: AxiosInstance) {}

  getList_shared(): Promise<IResponseData<ISharedConversation2[]>> {
    return this.instance.get("/sharedConversations", {});
  }

  get_shared(sharedCode: string): Promise<IResponseData<ISharedConversation2>> {
    return this.instance.get(`/sharedConversations/${sharedCode}`, {});
  }

  async save_shared(conversationID: string): Promise<IResponseData> {
    return await this.instance.post("/sharedConversations", {
      conversationID,
    });
  }

  regenerate_shared(sharedID: string): Promise<IResponseData<string>> {
    return FakeShareService.regenerate_shared(sharedID);
  }

  delete_shared(IDs: string[]): Promise<IResponseData<string>> {
    return this.instance.delete("/sharedConversations", {
      data: {
        IDs,
      },
    });
  }
}
