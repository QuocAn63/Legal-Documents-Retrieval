export enum ValidateMessages {
  // Username
  USERNAME_LENGTH = 'Tên tài khoản phải từ 6 đến 25 ký tự',
  USERNAME_EMPTY = 'Tên tài khoản không được bỏ trống',
  USERNAME_INVALID = 'Tên tài khoản không hợp lệ',
  USERNAME_NOT_EXISTS = 'Tên tài khoản không tồn tại',
  USERNAME_EXISTS = 'Tên tài khoản đã tồn tại',

  //   Passwod
  PASSWORD_LENGTH = 'Mật khẩu phải từ 6 đến 50 ký tự',
  PASSWORD_EMPTY = 'Mật khẩu không được bỏ trống',
  PASSWORD_INVALID = 'Mật khẩu không hợp lệ',
  PASSWORD_WRONG = 'Mật khẩu không chính xác',

  //   PasswordConfirm
  PASSWORDCONFIRM_EMPTY = 'Mật khẩu nhập lại không được bỏ trống',
  PASSWORDCONFIRM_NOT_EQUAL = 'Mật khẩu nhập lại không giống',
}
