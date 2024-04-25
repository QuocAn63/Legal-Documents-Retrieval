import { ApiProperty } from '@nestjs/swagger';

export class FilterUserDTO {
  @ApiProperty({
    required: false,
  })
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
