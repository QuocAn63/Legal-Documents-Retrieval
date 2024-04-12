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

export class SaveReasonDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.REASON_DESCRIPTION_EMPTY })
  @Length(1, 50, { message: ValidateMessages.REASON_DESCRIPTION_LENGTH })
  description: string;
}

export class UpdateReasonDTO {
  @ApiProperty()
  @IsUUID('4', { message: ValidateMessages.COMMON_UUID_INVALID })
  @IsNotEmpty({ message: ValidateMessages.REASON_ID_EMPTY })
  reasonID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.REASON_DESCRIPTION_EMPTY })
  @Length(1, 50, { message: ValidateMessages.REASON_DESCRIPTION_LENGTH })
  description: string;
}

export class DeleteReasonDTO {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: ValidateMessages.COMMON_ID_EMPTY })
  IDs: string[];
}
