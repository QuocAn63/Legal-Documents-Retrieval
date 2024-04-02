import { IsEmpty, IsString, Length, Validate } from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class UpdateUserDTO {
  @IsString()
  @IsEmpty({ message: ValidateMessages.USER_PASSWORD_EMPTY })
  @Length(6, 50, { message: ValidateMessages.USER_PASSWORD_LENGTH })
  password: string;

  @IsString()
  @IsEmpty({
    message: ValidateMessages.USER_PASSWORD_EMPTY.replace(
      'Mật khẩu',
      'Mật khẩu mới',
    ),
  })
  @Length(6, 50, {
    message: ValidateMessages.USER_PASSWORD_LENGTH.replace(
      'Mật khẩu',
      'Mật khẩu mới',
    ),
  })
  newPassword: string;

  @IsString()
  @IsEmpty({
    message: ValidateMessages.USER_PASSWORDCONFIRM_EMPTY.replace(
      'Mật khẩu',
      'Mật khẩu mới',
    ),
  })
  @Validate(
    (data) => {
      return data.newPassword === data.newPasswordConfirm;
    },
    { message: ValidateMessages.USER_PASSWORDCONFIRM_NOT_EQUAL },
  )
  newPasswordConfirm: string;
}
