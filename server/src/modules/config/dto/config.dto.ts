import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class FilterConfigDTO {
  @ApiProperty()
  @IsOptional()
  configID: string;

  @ApiProperty()
  @IsOptional()
  userID: string;

  @ApiProperty()
  @IsOptional()
  promptContent: string;
}

export class SaveConfigDTO {
  @ApiProperty()
  @IsUUID('all', { message: ValidateMessages.COMMON_UUID_INVALID })
  @IsNotEmpty({ message: ValidateMessages.CONFIG_USERID_EMPTY })
  userID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.CONFIG_PROMPTCONTENT_EMPTY })
  promptContent: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
}

export class UpdateConfigDTO {
  @ApiProperty()
  @IsUUID('4', { message: ValidateMessages.COMMON_UUID_INVALID })
  @IsNotEmpty({ message: ValidateMessages.CONFIG_ID_EMPTY })
  configID: string;

  @ApiProperty()
  @IsUUID('4', { message: ValidateMessages.COMMON_UUID_INVALID })
  @IsNotEmpty({ message: ValidateMessages.CONFIG_USERID_EMPTY })
  userID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.CONFIG_PROMPTCONTENT_EMPTY })
  @Length(1, 500, { message: ValidateMessages.CONFIG_PROMPTCONTENT_LENGTH })
  promptContent: string;
}

export class DeleteConfigDTO {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: ValidateMessages.COMMON_ID_EMPTY })
  IDs: string[];
}
