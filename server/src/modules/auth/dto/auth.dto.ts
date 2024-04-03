import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class LoginDTO {
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.USER_USERNAME_EMPTY })
  @Matches(/[$&+,:;=?@#|'<>.-^*()%!A-Z]/g, {
    message: ValidateMessages.USER_USERNAME_INVALID,
  })
  @Length(6, 25, { message: ValidateMessages.USER_USERNAME_LENGTH })
  username: string;

  @IsString()
  @IsNotEmpty({ message: ValidateMessages.USER_PASSWORD_EMPTY })
  @Length(6, 50, { message: ValidateMessages.USER_PASSWORD_LENGTH })
  password: string;
}

export class ForgotPwdDTO {
  @IsNotEmpty({ message: ValidateMessages.USER_EMAIL_EMPTY })
  @IsEmail({}, { message: ValidateMessages.USER_EMAIL_INVALID })
  email: string;
}
