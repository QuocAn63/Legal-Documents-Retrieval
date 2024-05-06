import { IForgotPwdInput } from "../pages/forgotPwd";
import { ILoginInput } from "../pages/login";
import { IRegisterInput } from "../pages/register";
import { IResetPasswordInput } from "../pages/resetPws";
import { FakeAuthAPI } from "./fakeAPIs/auth";

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
  static async login(data: ILoginInput) {
    return FakeAuthAPI.login(data);
  }

  static async register(data: IRegisterInput) {
    return FakeAuthAPI.register(data);
  }

  static async forgotPassword(data: IForgotPwdInput) {
    return FakeAuthAPI.forgotPassword(data);
  }

  static async forgotPasswordAccepted(data: IResetPasswordInput) {
    return FakeAuthAPI.forgotPasswordAccepted(data);
  }

  static async loginGoogle() {
    return FakeAuthAPI.loginGoogle();
  }
}
