import { IConversation, IConversation1 } from "./chat";

export interface ISharedConversation {
  sharedID: string;
  sharedCode: string;
  userID: string;
  conversationID: string;
  createdAt: string;
}

export interface ISharedConversation1 {
  sharedID: string;
  sharedCode: string;
  userID: string;
  createdAt: string;
  conversation: IConversation;
}

export interface ISharedConversation2 {
  sharedID: string;
  sharedCode: string;
  userID: string;
  createdAt: string;
  conversation: IConversation1;
}
