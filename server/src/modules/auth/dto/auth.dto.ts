import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Match } from 'src/commons/decorators/match.decorator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class LoginWithUsernameDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.USER_USERNAME_EMPTY })
  @Matches(/[$&+,:;=?@#|'<>.-^*()%!A-Z]/g, {
    message: ValidateMessages.USER_USERNAME_INVALID,
  })
  @Length(6, 25, { message: ValidateMessages.USER_USERNAME_LENGTH })
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.USER_PASSWORD_EMPTY })
  @Length(6, 50, { message: ValidateMessages.USER_PASSWORD_LENGTH })
  password: string;
}

export class OAuthLoginDTO {
  email: string;

  googleID: string;
}

export class ForgotPwdDTO {
  @ApiProperty()
  @IsNotEmpty({ message: ValidateMessages.USER_EMAIL_EMPTY })
  @IsEmail({}, { message: ValidateMessages.USER_EMAIL_INVALID })
  email: string;
}

export class ResetPwdDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.TOKEN_EMPTY })
  token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.USER_PASSWORD_EMPTY })
  @Length(6, 50, { message: ValidateMessages.USER_PASSWORD_LENGTH })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.USER_PASSWORDCONFIRM_EMPTY })
  @Match('password', {
    message: ValidateMessages.USER_PASSWORDCONFIRM_NOT_EQUAL,
  })
  passwordConfirm: string;
}
