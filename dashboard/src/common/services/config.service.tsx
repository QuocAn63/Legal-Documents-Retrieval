import { IResponseData } from "../types";
import axios from "./axios";

export class ConfigService {
  constructor(private readonly token: string) {}

  async get_configs(configID: string): Promise<IResponseData> {
    return axios.get(`/configs/${configID}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
