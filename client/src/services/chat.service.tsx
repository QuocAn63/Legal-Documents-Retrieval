import { IQueryMetaData, IResponseData } from "../interfaces/request";
import { IConversation } from "../interfaces/chat";
import { AxiosInstance } from "axios";

export class ChatService {
  constructor(private readonly instance: AxiosInstance) {}

  async getList_Conversations({
    pageIndex = 1,
    pageSize = 20,
  }: IQueryMetaData): Promise<IResponseData<IConversation[]>> {
    return this.instance.get("/conversations", {
      params: { pageIndex, pageSize },
    });
  }

  async getList_Messages(
    conversationID: string,
    { pageIndex = 1, pageSize = 6 }
  ): Promise<IResponseData> {
    return this.instance.get(`/conversations/${conversationID}/messages`, {
      params: {
        pageIndex,
        pageSize,
      },
    });
  }

  // // Get Reply Message API
  // async getReply_Messages(conversationID: string): Promise<IResponseData> {
  //   return FakeConversationsAPI.getReply_Messages(conversationID);
  // }

  // async save_Conversations(data: any): Promise<IResponseData<string>> {
  //   return FakeConversationsAPI.save_Conversations(data);
  // }

  // // Thêm save message
  // async save_Messages(data: any): Promise<IResponseData<string>> {
  //   return FakeConversationsAPI.save_Messages(data);
  // }

  // async update_Conversations(data: any): Promise<IResponseData<string>> {
  //   return FakeConversationsAPI.update_Conversations(data);
  // }

  async delete_Conversations(
    conversationID: string[]
  ): Promise<IResponseData<string>> {
    return this.instance.delete("/conversations", {
      data: {
        IDs: conversationID,
      },
    });
  }

  async deleteAll_Conversations(): Promise<IResponseData<string>> {
    return this.instance.delete("/conversations/all");
  }

  async getList_archived_Conversations(): Promise<
    IResponseData<IConversation[]>
  > {
    return this.instance.get("/conversations/archived", {});
  }

  async archive_Conversations(id: string): Promise<IResponseData<string>> {
    return this.instance.patch("/conversations", {
      conversationID: id,
      isArchived: true,
    });
  }

  async unarchive_Conversations(id: string): Promise<IResponseData<string>> {
    return this.instance.patch("/conversations", {
      conversationID: id,
      isArchived: false,
    });
  }

  async invoke(input: string, conversationID?: string): Promise<IResponseData> {
    return await this.instance.post("/bot/invoke", {
      conversationID,
      input,
    });
  }
}
