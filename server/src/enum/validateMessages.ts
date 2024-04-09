export enum ValidateMessages {
  // User
  USER_USERNAME_LENGTH = 'Tên tài khoản phải từ 6 đến 25 ký tự',
  USER_USERNAME_EMPTY = 'Tên tài khoản không được bỏ trống',
  USER_USERNAME_INVALID = 'Tên tài khoản không hợp lệ',
  USER_USERNAME_NOT_EXISTS = 'Tên tài khoản không tồn tại',
  USER_USERNAME_EXISTS = 'Tên tài khoản đã tồn tại',
  USER_ID_NOT_EXISTS = 'Không tìm thấy tài khoản',
  USER_EMAIL_EMPTY = 'Địa chỉ email không được bỏ trống',
  USER_EMAIL_EXISTS = 'Địa chỉ email đã tồn tại',
  USER_EMAIL_NOT_EXISTS = 'Địa chỉ email không tồn tại',
  USER_EMAIL_INVALID = 'Địa chỉ email không hợp lệ',
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
  CONVERSATION_ID_EMPTY = 'Mã cuộc trò chuyện không được để trống',

  // SharedConversations
  SHAREDCONVERSATION_ID_NOT_EXISTS = 'Tiêu đề không được để trống',
  SHAREDCONVERSATION_SHAREDCODE_EMPTY = 'Mã chia sẽ không được để trống',

  // Messages
  MESSAGE_CONTENT_EMPTY = 'Nội dung tin nhắn không được để trống',
  MESSAGE_ISBOT_INVALID = "Loại tin nhắn phải là '0' hoặc '1'",
  MESSAGE_ID_EMPTY = 'Mã tin nhắn không được bỏ trống',
  // Token
  TOKEN_EMPTY = 'Token trống',
}