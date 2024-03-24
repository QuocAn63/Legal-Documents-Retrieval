import { faker } from "@faker-js/faker";
import { IResponseData } from "../../interfaces/request";
import {
  IMessage,
  IConversation,
  IConversationWithMessages,
} from "../../interfaces/chat";

const conversationsData: IConversation[] = [
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    isArchived: 0,
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    isArchived: 0,
    createdAt: faker.date.past().toISOString(),
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    isArchived: 0,
    createdAt: faker.date.past().toISOString(),
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    isArchived: 0,
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    isArchived: 0,
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    isArchived: 0,
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    isArchived: 0,
  },
];

const archivedConversationsData: IConversation[] = [
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    isArchived: 1,
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    isArchived: 1,
    createdAt: faker.date.past().toISOString(),
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    isArchived: 1,
    createdAt: faker.date.past().toISOString(),
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    isArchived: 1,
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    isArchived: 1,
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    isArchived: 1,
  },
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.past().toISOString(),
    isArchived: 1,
  },
];

export const messageData: IMessage = {
  messageID: faker.string.uuid(),
  conversationID: faker.string.uuid(),
  userID: faker.string.uuid(),
  content: faker.lorem.paragraphs(2),
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  isBOT: faker.number.int({ min: 0, max: 1 }),
};

export const conversationData: IConversationWithMessages[] = [
  {
    conversationID: faker.string.uuid(),
    title: faker.lorem.paragraph(),
    createdAt: faker.date.recent().toISOString(),
    messages: [messageData, messageData, messageData, messageData, messageData],
    isArchived: 0,
  },
];

export class FakeConversationsAPI {
  static getList_Conversations(): Promise<IResponseData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Get list of conversations`);
        resolve({ status: 200, data: conversationsData });
      }, 2000);
    });
  }

  static getList_Messages(conversationID: string): Promise<IResponseData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Get message from [conversationID]: ${conversationID}`);
        resolve({ status: 200, data: conversationData[0].messages });
      }, 2000);
    });
  }

  static save_Conversations(data: any): Promise<IResponseData<string>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Save: ${data}`);
        resolve({ status: 200, data: "1" });
      }, 2000);
    });
  }

  static update_Conversations(data: any): Promise<IResponseData<string>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Update: ${data}`);
        resolve({ status: 200, data: "1" });
      }, 2000);
    });
  }

  static delete_Conversations(
    conversationID: string
  ): Promise<IResponseData<string>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Delete: ${conversationID}`);
        resolve({ status: 200, data: "1" });
      }, 2000);
    });
  }

  static getList_archived_Conversations(): Promise<
    IResponseData<IConversation[]>
  > {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Get list of archived conversations`);
        resolve({ status: 200, data: archivedConversationsData });
      }, 2000);
    });
  }

  static archive_Conversations(
    conversationID: string
  ): Promise<IResponseData<string>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Archive: ${conversationID}`);
        resolve({ status: 200, data: "1" });
      }, 2000);
    });
  }

  static unarchive_Conversations(
    conversationID: string
  ): Promise<IResponseData<string>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Unarchive: ${conversationID}`);
        resolve({ status: 200, data: "1" });
      }, 2000);
    });
  }
}
