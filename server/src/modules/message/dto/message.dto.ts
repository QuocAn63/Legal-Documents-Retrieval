import {
  IsArray,
  IsNotEmpty,
  IsEnum,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class SaveMessageDTO {
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.MESSAGE_CONTENT_EMPTY })
  content: string;

  @IsString()
  @IsNotEmpty({ message: ValidateMessages.CONVERSATION_ID_EMPTY })
  conversationID: string;

  @IsString()
  @IsOptional()
  replyToMessageID?: string;
}

export class UpdateMessageDTO {
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.MESSAGE_ID_EMPTY })
  messageID: string;

  @IsString()
  @IsNotEmpty({ message: ValidateMessages.CONVERSATION_ID_EMPTY })
  conversationID: string;

  @IsString()
  @IsNotEmpty({ message: ValidateMessages.MESSAGE_CONTENT_EMPTY })
  content: string;
}

export class DeleteMessageDTO {
  @IsArray()
  IDs: string[];
}
