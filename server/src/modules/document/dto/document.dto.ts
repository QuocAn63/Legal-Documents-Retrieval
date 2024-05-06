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
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  label: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    required: false,
  })
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.DOCUMENT_LABEL_EMPTY })
  content: string;
}

export class UpdateDocumentDTO {
  @ApiProperty()
  @IsUUID('all', { message: ValidateMessages.COMMON_UUID_INVALID })
  @IsNotEmpty({ message: ValidateMessages.DOCUMENT_ID_EMPTY })
  documentID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.DOCUMENT_LABEL_EMPTY })
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
