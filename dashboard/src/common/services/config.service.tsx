import { IUpdateConfig } from "../interfaces/config";
import { IResponseData } from "../types";
import { AxiosInstance } from "axios";

export class ConfigService {
  constructor(private readonly instance: AxiosInstance) {}

  async get_configs(configID: string): Promise<IResponseData> {
    return this.instance.get(`/configs/${configID}`);
  }

  async update_configs(data: IUpdateConfig): Promise<IResponseData> {
    return this.instance.patch(`/configs/`, data);
  }
}
