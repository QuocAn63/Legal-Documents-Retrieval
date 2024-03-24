import { IResponseData } from "../interfaces/request";
import {
  ISharedConversation1,
  ISharedConversation2,
} from "../interfaces/shared";
import FakeShareService from "./fakeAPIs/share.fakerservice";

export default class SharedService {
  static getList_shared(): Promise<IResponseData<ISharedConversation1[]>> {
    return FakeShareService.getList_shared();
  }

  static get_shared(
    sharedID: string
  ): Promise<IResponseData<ISharedConversation2>> {
    return FakeShareService.get_shared(sharedID);
  }

  static save_shared(data: any): Promise<IResponseData<string>> {
    console.log(this.name);
    return FakeShareService.save_shared(data);
  }

  static regenerate_shared(sharedID: string): Promise<IResponseData<string>> {
    return FakeShareService.regenerate_shared(sharedID);
  }

  static delete_shared(sharedID: string): Promise<IResponseData<string>> {
    return FakeShareService.delete_shared(sharedID);
  }
}
