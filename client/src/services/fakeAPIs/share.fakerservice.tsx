import { faker } from "@faker-js/faker";
import {
  ISharedConversation1,
  ISharedConversation2,
} from "../../interfaces/shared";
import { IResponseData } from "../../interfaces/request";
import { conversationData } from "./conversations.fakeservice";

const fakeSharedConversationItem: ISharedConversation1 = {
  sharedID: faker.string.uuid(),
  conversation: conversationData[0],
  userID: faker.string.uuid(),
  sharedCode: faker.string.uuid(),
  createdAt: faker.date.recent().toISOString(),
};

const fakeSharedConversationItem2: ISharedConversation2 = {
  sharedID: faker.string.uuid(),
  conversation: conversationData[0],
  userID: faker.string.uuid(),
  sharedCode: faker.string.uuid(),
  createdAt: faker.date.recent().toISOString(),
};

const fakeSharedConversationItems: ISharedConversation1[] = [
  fakeSharedConversationItem,
  fakeSharedConversationItem,
  fakeSharedConversationItem,
  fakeSharedConversationItem,
];

export default class FakeShareService {
  static getList_shared(): Promise<IResponseData<ISharedConversation1[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: fakeSharedConversationItems,
        });
      }, 2000);
    });
  }

  static get_shared(
    sharedCode: string
  ): Promise<IResponseData<ISharedConversation2>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (sharedCode === "1") {
          resolve({
            status: 200,
            data: fakeSharedConversationItem2,
          });
        } else {
          reject("Not found");
        }
      }, 2000);
    });
  }

  static save_shared(data: any): Promise<IResponseData<string>> {
    console.log(`Save: ${data}`);

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ status: 201, data }), 2000);
    });
  }

  static regenerate_shared(sharedID: string): Promise<IResponseData<string>> {
    console.log(`Save: ${sharedID}`);

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ status: 204, data: sharedID }), 2000);
    });
  }

  static delete_shared(sharedID: string): Promise<IResponseData<string>> {
    console.log(`Save: ${sharedID}`);

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ status: 200, data: sharedID }), 2000);
    });
  }
}
