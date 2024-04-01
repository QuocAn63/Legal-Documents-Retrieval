export enum ValidateMessages {
  // User
  USER_USERNAME_LENGTH = 'Tên tài khoản phải từ 6 đến 25 ký tự',
  USER_USERNAME_EMPTY = 'Tên tài khoản không được bỏ trống',
  USER_USERNAME_INVALID = 'Tên tài khoản không hợp lệ',
  USER_USERNAME_NOT_EXISTS = 'Tên tài khoản không tồn tại',
  USER_USERNAME_EXISTS = 'Tên tài khoản đã tồn tại',
  USER_ID_NOT_EXISTS = 'Không tìm thấy tài khoản',

  //   Passwod
  USER_PASSWORD_LENGTH = 'Mật khẩu phải từ 6 đến 50 ký tự',
  USER_PASSWORD_EMPTY = 'Mật khẩu không được bỏ trống',
  USER_PASSWORD_INVALID = 'Mật khẩu không hợp lệ',
  USER_PASSWORD_WRONG = 'Mật khẩu không chính xác',

  //   PasswordConfirm
  USER_PASSWORDCONFIRM_EMPTY = 'Mật khẩu nhập lại không được bỏ trống',
  USER_PASSWORDCONFIRM_NOT_EQUAL = 'Mật khẩu nhập lại không giống',

  // Conversations
  CONVERSATION_TITLE_EMPTY = 'Tiêu đề không được để trống',
  CONVERSATION_TITLE_LENGTH = 'Tiêu đề phải từ 1 đến 150 ký tự',
  CONVERSATION_ISARCHIVED_VALUE = "Trạng thái phải là giá trị '0' hoặc '1'",
  CONVERSATION_ID_NOT_EXISTS = 'Không tìm thấy cuộc trò chuyện',

  // SharedConversations
  SHAREDCONVERSATION_ID_NOT_EXISTS = 'Tiêu đề không được để trống',
}
