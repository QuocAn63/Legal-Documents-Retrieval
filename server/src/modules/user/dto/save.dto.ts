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

export class SaveUserWithPasswordDTO {
  @ApiProperty()
  @IsEmail({}, { message: ValidateMessages.USER_EMAIL_INVALID })
  email: string;

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

export class SaveUserWithGoogleIDDTO {
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
