import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class SaveSharedConversationDTO {
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.CONVERSATION_ID_NOT_EXISTS })
  conversationID: string;
}

export class UpdateSharedConversationDTO {
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.SHAREDCONVERSATION_ID_NOT_EXISTS })
  sharedConversationID: string;
}

export class DeleteSharedConversationDTO {
  @IsArray()
  IDs: string[];
}
