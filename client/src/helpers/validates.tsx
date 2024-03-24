import { z } from "zod";

export const loginValidateObjects = {
  email: z
    .string({
      required_error: "Email không được bỏ trống",
    })
    .email("Địa chỉ Email không hợp lệ"),
  password: z
    .string({ required_error: "Mật khẩu không được bỏ trống" })
    .min(6, "Mật khẩu phải lớn hơn 6 ký tự")
    .max(25, "Mật khẩu phải nhỏ hơn 25 ký tự"),
  passwordConfirm: z
    .string({ required_error: "Mật khẩu nhập lại không được bỏ trống" })
    .min(6, "Mật khẩu nhập lại phải lớn hơn 6 ký tự")
    .max(25, "Mật khẩu nhập lại phải nhỏ hơn 25 ký tự"),
};

export const chatContentValidate = z.string();

export const conversationTitleValidate = z.string().min(1).max(100);
