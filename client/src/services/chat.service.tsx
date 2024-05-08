import { IQueryMetaData, IResponseData } from "../interfaces/request";
import { FakeConversationsAPI } from "./fakeAPIs/conversations.fakeservice";
import { IConversation } from "../interfaces/chat";
import axiosInstance from "./axios";

export class ChatService {
  constructor(private readonly token: string) {}

  async getList_Conversations({
    pageIndex = 1,
    pageSize = 20,
  }: IQueryMetaData): Promise<IResponseData<IConversation[]>> {
    return axiosInstance.get("/conversations", {
      params: { pageIndex, pageSize },
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async getList_Messages(
    conversationID: string,
    { pageIndex = 1, pageSize = 6 }
  ): Promise<IResponseData> {
    return axiosInstance.get(`/conversations/${conversationID}/messages`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: {
        pageIndex,
        pageSize,
      },
    });
  }

  // Get Reply Message API
  async getReply_Messages(conversationID: string): Promise<IResponseData> {
    return FakeConversationsAPI.getReply_Messages(conversationID);
  }

  async save_Conversations(data: any): Promise<IResponseData<string>> {
    return FakeConversationsAPI.save_Conversations(data);
  }

  // Thêm save message
  async save_Messages(data: any): Promise<IResponseData<string>> {
    return FakeConversationsAPI.save_Messages(data);
  }

  async update_Conversations(data: any): Promise<IResponseData<string>> {
    return FakeConversationsAPI.update_Conversations(data);
  }

  async delete_Conversations(
    conversationID: string[]
  ): Promise<IResponseData<string>> {
    return axiosInstance.delete("/conversations", {
      data: {
        IDs: conversationID,
      },
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async getList_archived_Conversations(): Promise<
    IResponseData<IConversation[]>
  > {
    return FakeConversationsAPI.getList_archived_Conversations();
  }

  async archive_Conversations(
    conversationID: string
  ): Promise<IResponseData<string>> {
    return FakeConversationsAPI.archive_Conversations(conversationID);
  }

  async unarchive_Conversations(
    conversationID: string
  ): Promise<IResponseData<string>> {
    return FakeConversationsAPI.archive_Conversations(conversationID);
  }

  async invoke(input: string, conversationID?: string): Promise<IResponseData> {
    return await axiosInstance.post(
      "/bot/invoke",
      {
        conversationID,
        input,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }
}
