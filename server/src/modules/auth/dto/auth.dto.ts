import { IsEmpty, IsString, Length, Matches } from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class LoginDTO {
  @IsString()
  @IsEmpty({ message: ValidateMessages.USER_USERNAME_EMPTY })
  @Matches(/[$&+,:;=?@#|'<>.-^*()%!A-Z]/g, {
    message: ValidateMessages.USER_USERNAME_INVALID,
  })
  @Length(6, 25, { message: ValidateMessages.USER_USERNAME_LENGTH })
  username: string;

  @IsString()
  @IsEmpty({ message: ValidateMessages.USER_PASSWORD_EMPTY })
  @Length(6, 50, { message: ValidateMessages.USER_PASSWORD_LENGTH })
  password: string;
}
