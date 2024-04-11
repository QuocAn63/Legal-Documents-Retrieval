import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
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

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
