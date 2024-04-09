import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteUserDTO {
  @ApiProperty()
  @IsArray()
  IDs: string[];
}
