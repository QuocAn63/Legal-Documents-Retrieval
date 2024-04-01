import {
  IsEmail,
  IsEmpty,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class LoginDTO {
  @IsString()
  @IsEmpty({ message: ValidateMessages.USERNAME_EMPTY })
  @Matches(/[$&+,:;=?@#|'<>.-^*()%!A-Z]/g, {
    message: ValidateMessages.USERNAME_INVALID,
  })
  @Length(6, 25, { message: ValidateMessages.USERNAME_LENGTH })
  username: string;

  @IsString()
  @IsEmpty({ message: ValidateMessages.PASSWORD_EMPTY })
  @Length(6, 50, { message: ValidateMessages.PASSWORD_LENGTH })
  password: string;
}

export class SaveUserWithUsernameDTO {
  @IsString()
  @IsEmpty({ message: ValidateMessages.USERNAME_EMPTY })
  @Matches(/[$&+,:;=?@#|'<>.-^*()%!A-Z]/g, {
    message: ValidateMessages.USERNAME_INVALID,
  })
  @Length(6, 25, { message: ValidateMessages.USERNAME_LENGTH })
  username: string;

  @IsString()
  @IsEmpty({ message: ValidateMessages.PASSWORD_EMPTY })
  @Length(6, 50, { message: ValidateMessages.PASSWORD_LENGTH })
  password: string;

  @IsString()
  @IsEmpty({ message: ValidateMessages.PASSWORDCONFIRM_EMPTY })
  @Validate(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    { message: ValidateMessages.PASSWORDCONFIRM_NOT_EQUAL },
  )
  passwordConfirm: string;
}

export class SaveUserWithEmailDTO {
  @IsEmail({}, { message: ValidateMessages.EMAIL_INVALID })
  email: string;

  @IsString()
  @IsEmpty()
  token: string;
}
