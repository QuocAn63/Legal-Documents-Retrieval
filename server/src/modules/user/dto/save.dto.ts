export class SaveUserDTO {
  username: string;
}
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class SaveUserWithUsernameDTO {
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

  @IsString()
  @IsNotEmpty({ message: ValidateMessages.USER_PASSWORDCONFIRM_EMPTY })
  @Validate(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    { message: ValidateMessages.USER_PASSWORDCONFIRM_NOT_EQUAL },
  )
  passwordConfirm: string;
}

export class SaveUserWithEmailDTO {
  @IsEmail({}, { message: ValidateMessages.USER_EMAIL_INVALID })
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
