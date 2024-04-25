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
  email: string;
}

export class IFilterUserDTO {
  username: string;
  email: string;
}
