import { IsEmpty, IsEnum, IsString, Length } from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class SaveConversationDTO {
  @IsString()
  @IsEmpty({ message: ValidateMessages.CONVERSATION_TITLE_EMPTY })
  @Length(1, 150, { message: ValidateMessages.CONVERSATION_TITLE_LENGTH })
  title: string;

  @IsString()
  @IsEmpty({ message: ValidateMessages.USER_ID_NOT_EXISTS })
  userID: string;
}

export class UpdateConversationDTO {
  @IsString()
  @IsEmpty({ message: ValidateMessages.CONVERSATION_ID_NOT_EXISTS })
  conversationID: string;

  @IsString()
  @IsEmpty({ message: ValidateMessages.USER_ID_NOT_EXISTS })
  userID: string;

  @IsString()
  @IsEmpty({ message: ValidateMessages.CONVERSATION_TITLE_EMPTY })
  @Length(1, 150, { message: ValidateMessages.CONVERSATION_TITLE_LENGTH })
  title: string;

  @IsString()
  @IsEnum(['0', '1'], {
    message: ValidateMessages.CONVERSATION_ISARCHIVED_VALUE,
  })
  isArchived: string;
}
