import { AxiosInstance } from "axios";
import { IForgotPwdInput } from "../pages/forgotPwd";
import { ILoginInput } from "../pages/login";
import { IRegisterInput } from "../pages/register";
import { IResetPasswordInput } from "../pages/resetPws";
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

  static async forgotPassword(data: IForgotPwdInput) {
    return;
  }

  static async forgotPasswordAccepted(data: IResetPasswordInput) {
    return;
  }

  static async loginGoogle() {
    return;
  }
}
