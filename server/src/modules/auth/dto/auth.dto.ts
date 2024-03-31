import { IsString, Length, Matches, Validate } from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class LoginDTO {
  @IsString()
  @Matches(/[$&+,:;=?@#|'<>.-^*()%!A-Z]/g, {
    message: ValidateMessages.USERNAME_INVALID,
  })
  @Length(6, 25, { message: ValidateMessages.USERNAME_LENGTH })
  username: string;

  @IsString()
  @Length(6, 50, { message: ValidateMessages.PASSWORD_LENGTH })
  password: string;
}

export class SaveUserDTO {
  @IsString()
  @Matches(/[$&+,:;=?@#|'<>.-^*()%!A-Z]/g, {
    message: ValidateMessages.USERNAME_INVALID,
  })
  @Length(6, 25, { message: ValidateMessages.USERNAME_LENGTH })
  username: string;

  @IsString()
  @Length(6, 50, { message: ValidateMessages.PASSWORD_LENGTH })
  @IsString()
  @Validate(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    { message: ValidateMessages.PASSWORDCONFIRM_NOT_EQUAL },
  )
  passwordConfirm: string;
}
