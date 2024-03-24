export interface IConversation {
  conversationID: string;
  title: string;
  createdAt: string;
  isArchived: number;
}

export interface IMessage {
  messageID: string;
  content: string;
  conversationID: string;
  userID: string;
  createdAt: string;
  updatedAt: string;
  isBOT: number;
}

export interface IConversationWithMessages extends IConversation {
  messages: IMessage[];
}
