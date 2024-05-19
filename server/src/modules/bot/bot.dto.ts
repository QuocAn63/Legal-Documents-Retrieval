import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class CreateConversationDTO {
  @ApiProperty()
  @IsUUID('all', { message: ValidateMessages.COMMON_UUID_INVALID })
  @IsOptional()
  conversationID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.MESSAGE_CONTENT_EMPTY })
  content: string;
}

export class AskDTO {
  @ApiProperty()
  @IsUUID('all', { message: ValidateMessages.COMMON_UUID_INVALID })
  @IsOptional()
  conversationID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.MESSAGE_CONTENT_EMPTY })
  input: string;

  @ApiProperty({ required: false })
  messages: any;
}
