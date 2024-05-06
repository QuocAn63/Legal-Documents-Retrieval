export interface IMessage {
  id: string;

  conversationID: string;

  userID: string;

  content: string;

  createdAt: string;

  isBOT: boolean;
}
