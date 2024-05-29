import { AxiosInstance } from "axios";
import { ILoginInput } from "../../pages/login";

export class AuthService {
  constructor(private readonly instance: AxiosInstance) {}

  async login(data: ILoginInput) {
    return this.instance.post("/auth/login", data);
  }
}
