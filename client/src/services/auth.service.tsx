import { AxiosInstance } from "axios";
import { IForgotPwdInput } from "../pages/forgotPwd";
import { ILoginInput } from "../pages/login";
import { IRegisterInput } from "../pages/register";
import { IResetPasswordInput } from "../pages/resetPwd";
import { IResponseData } from "../interfaces/request";

export interface AuthState {
  isAuthenticated?: boolean;
  isInitialized?: boolean;
  user: User | null;
}

export interface User {
  email: string;
}

export enum AuthActionState {
  INITIALIZE = "INITIALIZE",
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
}

export interface PayloadAction<T> {
  type: AuthActionState;
  payload: T;
}

export default class AuthService {
  constructor(private readonly instance: AxiosInstance) {}

  async login(data: ILoginInput): Promise<IResponseData> {
    return this.instance.post("/auth/login", data);
  }

  async register(data: IRegisterInput): Promise<IResponseData> {
    return this.instance.post("/auth/register", data);
  }

  async forgotPassword(data: IForgotPwdInput) {
    return this.instance.post("/auth/pwdforgot", data);
  }

  async forgotPasswordAccepted(data: IResetPasswordInput) {
    return this.instance.patch("/auth/pwdreset", data);
  }

  async getLoginGoogleUrl() {
    return this.instance.get("/auth/oauth/google");
  }

  async googleLogin(code: string): Promise<IResponseData> {
    return this.instance.post("/auth/oauth/google/callback", { code });
  }

  async deleteAccount(): Promise<IResponseData> {
    return this.instance.delete("/auth/self");
  }
}
