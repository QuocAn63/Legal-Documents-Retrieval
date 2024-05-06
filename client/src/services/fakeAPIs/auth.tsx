import { faker } from "@faker-js/faker";
import { IForgotPwdInput } from "../../pages/forgotPwd";
import { IResetPasswordInput } from "../../pages/resetPws";
import { IResponseData } from "../../interfaces/request";

const LoginData = {
  // email: faker.internet.email(),
  id: faker.string.uuid(),
  username: "caoan632002",
  token: faker.string.uuid(),
  email: "thangphamcao@gmail.com",
  isAdmin: false,
};

export class FakeAuthAPI {
  static async login({
    // email,
    username,
    password,
  }: {
    // email: string;
    username: string;
    password: string;
  }): Promise<IResponseData> {
    return new Promise((resolve, reject) => {
      if (username === "caoan632002" && password === "123123123") {
        return setTimeout(() => {
          console.log("Login success");
          resolve({
            status: 200,
            data: LoginData,
          });
        }, 1000);
      } else {
        return setTimeout(() => {
          console.log("Login failed");

          reject("Login failed");
        }, 1000);
      }
    });
  }

  static async loginGoogle(): Promise<IResponseData> {
    return new Promise((resolve, reject) => {
      return setTimeout(() => {
        console.log("Login success");
        resolve({
          status: 200,
          data: "/login/google",
        });
      }, 1000);
    });
  }

  static async register({
    // email,
    username,
    password,
    passwordConfirm,
  }: {
    // email: string;
    username: string;
    password: string;
    passwordConfirm: string;
  }): Promise<IResponseData> {
    return new Promise((resolve, reject) => {
      if (username === "caoan632002@gmail.com") {
        return setTimeout(() => {
          console.log("Registring failed");
          reject({
            status: 400,
            message: "Tên tài khoản đã tồn tại",
          });
        }, 1000);
      } else {
        return setTimeout(() => {
          console.log("Registring success");
          resolve({
            status: 200,
          });
        }, 1000);
      }
    });
  }

  static async forgotPassword({
    email,
  }: IForgotPwdInput): Promise<IResponseData> {
    return new Promise((resolve, reject) => {
      if (email === "caoan632002@gmail.com") {
        return setTimeout(() => {
          console.log("Password forgot success");
          resolve({
            status: 200,
          });
        }, 1000);
      } else {
        return setTimeout(() => {
          console.log("Password forgot failed");
          reject({
            status: 400,
            message: "Địa chỉ email không tồn tại.",
          });
        }, 1000);
      }
    });
  }

  static async forgotPasswordAccepted({
    password,
    passwordConfirm,
    resetPwdToken,
  }: IResetPasswordInput): Promise<IResponseData> {
    console.log({ password, passwordConfirm, resetPwdToken });

    return new Promise((resolve, reject) => {
      if (password === passwordConfirm) {
        return setTimeout(() => {
          console.log("Password reset success");

          resolve({
            status: 200,
          });
        }, 1000);
      } else {
        return setTimeout(() => {
          console.log("Password forgot failed");
          reject({
            status: 400,
            message: "Mật khẩu không trùng khớp",
          });
        }, 1000);
      }
    });
  }
}
