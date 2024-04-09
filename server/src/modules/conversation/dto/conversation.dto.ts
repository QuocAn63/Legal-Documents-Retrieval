import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class FilterConversationDTO {
  @ApiProperty({ required: false })
  title: string;
}

export class SaveConversationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.CONVERSATION_TITLE_EMPTY })
  @Length(1, 150, { message: ValidateMessages.CONVERSATION_TITLE_LENGTH })
  title: string;
}

export class UpdateConversationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.CONVERSATION_ID_NOT_EXISTS })
  conversationID: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: ValidateMessages.CONVERSATION_TITLE_EMPTY })
  @Length(1, 150, { message: ValidateMessages.CONVERSATION_TITLE_LENGTH })
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(['0', '1'], {
    message: ValidateMessages.CONVERSATION_ISARCHIVED_VALUE,
  })
  isArchived: string;
}

export class DeleteConversationDTO {
  @ApiProperty()
  @IsArray()
  IDs: string[];
}
