import { z } from "zod";

export const loginValidateObjects = {
  email: z
    .string({
      required_error: "Email không được bỏ trống",
    })
    .email("Địa chỉ Email không hợp lệ"),
  username: z.string({
    required_error: "Tên tài khoản không được bỏ trống",
  }),
  password: z
    .string({ required_error: "Mật khẩu không được bỏ trống" })
    .min(6, "Mật khẩu phải lớn hơn 6 ký tự")
    .max(25, "Mật khẩu phải nhỏ hơn 25 ký tự"),
  passwordConfirm: z
    .string({ required_error: "Mật khẩu nhập lại không được bỏ trống" })
    .min(6, "Mật khẩu nhập lại phải lớn hơn 6 ký tự")
    .max(25, "Mật khẩu nhập lại phải nhỏ hơn 25 ký tự"),
};

export const chatContentValidate = {
  content: z.string({
    required_error: "Bạn chưa nhập gì cả!",
  }),
};

export const conversationTitleValidate = z
  .string({
    required_error: "Tiêu đề không được bỏ trống",
  })
  .min(1)
  .max(100);
