import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { DocumentEntity } from '../entities/document.entity';

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
