import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Match } from 'src/commons/decorators/match.decorator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.USER_PASSWORD_EMPTY })
  @Length(6, 50, { message: ValidateMessages.USER_PASSWORD_LENGTH })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: ValidateMessages.USER_PASSWORDCONFIRM_EMPTY.replace(
      'Mật khẩu',
      'Mật khẩu mới',
    ),
  })
  @Match('password', {
    message: ValidateMessages.USER_PASSWORDCONFIRM_NOT_EQUAL.replace(
      'Mật khẩu',
      'Mật khẩu mới',
    ),
  })
  newPasswordConfirm: string;
}
