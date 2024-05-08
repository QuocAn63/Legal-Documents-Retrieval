import { IConversation, IMessage } from "./chat";

export interface ISharedConversation {
  id: string;
  sharedCode: string;
  userID: string;
  conversationID: string;
  createdAt: string;
}

export interface ISharedConversation1 {
  id: string;
  sharedCode: string;
  userID: string;
  createdAt: string;
  conversation: IConversation;
}

export interface ISharedConversation2 {
  id: string;
  sharedCode: string;
  userID: string;
  createdAt: string;
  conversationID: string;
  conversation: IConversation;
  messages: IMessage[];
}
