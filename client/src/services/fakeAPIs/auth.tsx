import { faker } from "@faker-js/faker";
import { IForgotPwdInput } from "../../pages/forgotPwd";
import { IResetPasswordInput } from "../../pages/resetPws";
import { IResponseData } from "../../interfaces/request";

const LoginData = {
  email: faker.internet.email(),
  token: faker.string.uuid(),
};

export class FakeAuthAPI {
  static async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<IResponseData> {
    return new Promise((resolve, reject) => {
      if (email === "caoan632002@gmail.com" && password === "123123123") {
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

  static async register({
    email,
    password,
    passwordConfirm,
  }: {
    email: string;
    password: string;
    passwordConfirm: string;
  }): Promise<IResponseData> {
    return new Promise((resolve, reject) => {
      if (email === "caoan632002@gmail.com") {
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
          console.log("Password forgot failed");
          reject({
            status: 400,
            message: "Địa chỉ email không tồn tại.",
          });
        }, 1000);
      } else {
        return setTimeout(() => {
          console.log("Password forgot success");

          resolve({
            status: 200,
          });
        }, 1000);
      }
    });
  }

  static async forgotPasswordAccepted({
    password,
  }: IResetPasswordInput): Promise<IResponseData> {
    return new Promise((resolve, reject) => {
      return setTimeout(() => {
        console.log("Password reset failed");

        resolve({
          status: 200,
        });
      }, 1000);
    });
  }
}
