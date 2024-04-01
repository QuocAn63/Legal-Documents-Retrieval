import { IsEmpty, IsEnum, IsString, Length } from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class SaveSharedConversationDTO {
  @IsString()
  @IsEmpty({ message: ValidateMessages.CONVERSATION_ID_NOT_EXISTS })
  conversationID: string;

  @IsString()
  @IsEmpty({ message: ValidateMessages.USER_ID_NOT_EXISTS })
  userID: string;
}

export class UpdateSharedConversationDTO {
  @IsString()
  @IsEmpty({ message: ValidateMessages.SHAREDCONVERSATION_ID_NOT_EXISTS })
  sharedConversationID: string;

  @IsString()
  @IsEmpty({ message: ValidateMessages.CONVERSATION_ID_NOT_EXISTS })
  conversationID: string;

  @IsString()
  @IsEmpty({ message: ValidateMessages.USER_ID_NOT_EXISTS })
  userID: string;
}
