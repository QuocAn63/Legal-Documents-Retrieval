import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterUserDTO {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  username: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  id: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  email: string;
}
