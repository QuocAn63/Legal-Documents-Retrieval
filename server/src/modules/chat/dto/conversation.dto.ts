import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class SaveConversationDTO {
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.CONVERSATION_TITLE_EMPTY })
  @Length(1, 150, { message: ValidateMessages.CONVERSATION_TITLE_LENGTH })
  title: string;
}

export class UpdateConversationDTO {
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.CONVERSATION_ID_NOT_EXISTS })
  conversationID: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: ValidateMessages.CONVERSATION_TITLE_EMPTY })
  @Length(1, 150, { message: ValidateMessages.CONVERSATION_TITLE_LENGTH })
  title: string;

  @IsString()
  @IsOptional()
  @IsEnum(['0', '1'], {
    message: ValidateMessages.CONVERSATION_ISARCHIVED_VALUE,
  })
  isArchived: string;
}

export class DeleteConversationDTO {
  @IsArray()
  IDs: string[];
}
