import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Match } from 'src/commons/decorators/match.decorator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class LoginWithPasswordDTO {
  @ApiProperty()
  @IsNotEmpty({ message: ValidateMessages.USER_EMAIL_EMPTY })
  @IsEmail({}, { message: ValidateMessages.USER_EMAIL_INVALID })
  email: string;

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
