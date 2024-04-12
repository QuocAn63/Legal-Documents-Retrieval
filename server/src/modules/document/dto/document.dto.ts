import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class FilterDocumentDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  label: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  configID: string;
}

export class SaveDocumentDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.DOCUMENT_CONFIGID_EMPTY })
  configID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.DOCUMENT_LABEL_EMPTY })
  @Length(1, 100, { message: ValidateMessages.DOCUMENT_LABEL_LENGTH })
  label: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: ValidateMessages.DOCUMENT_LABEL_EMPTY })
  rank: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UpdateDocumentDTO {
  @ApiProperty()
  @IsUUID('4', { message: ValidateMessages.COMMON_UUID_INVALID })
  @IsNotEmpty({ message: ValidateMessages.DOCUMENT_ID_EMPTY })
  documentID: string;

  @ApiProperty()
  @IsUUID('4', { message: ValidateMessages.COMMON_UUID_INVALID })
  @IsNotEmpty({ message: ValidateMessages.DOCUMENT_CONFIGID_EMPTY })
  configID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.DOCUMENT_LABEL_EMPTY })
  @Length(1, 100, { message: ValidateMessages.DOCUMENT_LABEL_LENGTH })
  label: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: ValidateMessages.DOCUMENT_LABEL_EMPTY })
  rank: number;
}

export class DeleteDocumentDTO {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: ValidateMessages.COMMON_ID_EMPTY })
  IDs: string[];
}
