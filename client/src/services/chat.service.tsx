import { IQueryMetaData, IResponseData } from "../interfaces/request";
import { FakeConversationsAPI } from "./fakeAPIs/conversations.fakeservice";
import { IConversation } from "../interfaces/chat";
import axiosInstance from "./axios";

export class ChatService {
  static async getList_Conversations(
    { pageIndex = 1, pageSize = 20 }: IQueryMetaData,
    token: string
  ): Promise<IResponseData<IConversation[]>> {
    return axiosInstance.get("/conversations", {
      params: { pageIndex, pageSize },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static async getList_Messages(
    conversationID: string
  ): Promise<IResponseData> {
    return FakeConversationsAPI.getList_Messages(conversationID);
  }

  // Get Reply Message API
  static async getReply_Messages(
    conversationID: string
  ): Promise<IResponseData> {
    return FakeConversationsAPI.getReply_Messages(conversationID);
  }

  static async save_Conversations(data: any): Promise<IResponseData<string>> {
    return FakeConversationsAPI.save_Conversations(data);
  }

  // Thêm save message
  static async save_Messages(data: any): Promise<IResponseData<string>> {
    return FakeConversationsAPI.save_Messages(data);
  }

  static async update_Conversations(data: any): Promise<IResponseData<string>> {
    return FakeConversationsAPI.update_Conversations(data);
  }

  static async delete_Conversations(
    conversationID: string
  ): Promise<IResponseData<string>> {
    return FakeConversationsAPI.delete_Conversations(conversationID);
  }

  static async getList_archived_Conversations(
    userToken: string
  ): Promise<IResponseData<IConversation[]>> {
    return FakeConversationsAPI.getList_archived_Conversations();
  }

  static async archive_Conversations(
    conversationID: string
  ): Promise<IResponseData<string>> {
    return FakeConversationsAPI.archive_Conversations(conversationID);
  }

  static async unarchive_Conversations(
    conversationID: string
  ): Promise<IResponseData<string>> {
    return FakeConversationsAPI.archive_Conversations(conversationID);
  }
}
