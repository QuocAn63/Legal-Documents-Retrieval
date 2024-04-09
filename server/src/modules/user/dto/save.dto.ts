import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class SaveUserWithUsernameDTO {
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.USER_PASSWORDCONFIRM_EMPTY })
  @ValidateIf((obj, value) => obj.password !== value, {
    message: ValidateMessages.USER_PASSWORDCONFIRM_NOT_EQUAL,
  })
  passwordConfirm: string;
}

export class SaveUserWithEmailDTO {
  @ApiProperty()
  @IsEmail({}, { message: ValidateMessages.USER_EMAIL_INVALID })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  googleID: string;
}

export class SaveBOTDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.USER_USERNAME_EMPTY })
  @Length(6, 25, { message: ValidateMessages.USER_USERNAME_LENGTH })
  username: string;
}
