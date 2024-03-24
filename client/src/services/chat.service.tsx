import { IQueryMetaData, IResponseData } from "../interfaces/request";
import { FakeConversationsAPI } from "./fakeAPIs/conversations.fakeservice";
import { IConversation } from "../interfaces/chat";

export class ChatService {
  static async getList_Conversations({
    pageIndex = 1,
    pageSize = 20,
    where = "",
  }: IQueryMetaData): Promise<IResponseData<IConversation[]>> {
    console.log(`${pageIndex}, ${pageSize}, ${where}`);

    return FakeConversationsAPI.getList_Conversations();
  }

  static async getList_Messages(
    conversationID: string
  ): Promise<IResponseData> {
    return FakeConversationsAPI.getList_Messages(conversationID);
  }

  static async save_Conversations(data: any): Promise<IResponseData<string>> {
    return FakeConversationsAPI.save_Conversations(data);
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
