import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
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
  @IsUUID('all', { message: ValidateMessages.COMMON_UUID_INVALID })
  @IsNotEmpty({ message: ValidateMessages.CONFIG_ID_EMPTY })
  configID: string;

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
  @IsNotEmpty({ message: ValidateMessages.CONFIG_DESCRIPTION_EMPTY })
  description: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty({ message: ValidateMessages.CONFIG_SPLITTED_EMPTY })
  splitted: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: ValidateMessages.CONFIG_CHUNKSIZE_EMPTY })
  @Max(4048, { message: ValidateMessages.CONFIG_CHUNKSIZE_INVALID })
  chunkSize: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: ValidateMessages.CONFIG_CHUNKOVERLAP_EMPTY })
  @Max(100, { message: ValidateMessages.CONFIG_CHUNKOVERLAP_INVALID })
  chunkOverlap: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: ValidateMessages.CONFIG_K_EMPTY })
  @Max(50, { message: ValidateMessages.CONFIG_K_INVALID })
  k: string;
}

export class DeleteConfigDTO {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: ValidateMessages.COMMON_ID_EMPTY })
  IDs: string[];
}
