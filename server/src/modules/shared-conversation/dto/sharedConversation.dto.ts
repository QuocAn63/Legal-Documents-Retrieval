import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class SaveSharedConversationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.CONVERSATION_ID_NOT_EXISTS })
  conversationID: string;
}

export class UpdateSharedConversationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.SHAREDCONVERSATION_ID_NOT_EXISTS })
  sharedConversationID: string;
}

export class DeleteSharedConversationDTO {
  @ApiProperty()
  @IsArray()
  IDs: string[];
}
