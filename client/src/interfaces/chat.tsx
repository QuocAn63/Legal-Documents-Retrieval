export interface IConversation {
  id: string;
  title: string;
  createdAt: string;
  isArchived: number;
}

export interface IMessage {
  id: string;
  content: string;
  conversationID: string;
  userID: string;
  createdAt: string;
  updatedAt: string;
  isBOT: number;
}

export interface IConversation1 extends IConversation {
  messages: IMessage[];
}
