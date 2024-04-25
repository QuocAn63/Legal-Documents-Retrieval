import { Injectable } from '@nestjs/common';
import { CreateConversationDTO } from './bot.dto';
import { IAuthToken } from 'src/interfaces/auth.interface';
import { ConversationService } from '../conversation';
import { MessageService } from '../message/message.service';
import ConversationEntity from '../conversation/entities/conversations.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export default class BotService {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  async create(authToken: IAuthToken, data: CreateConversationDTO) {
    let conversation: ConversationEntity | null;

    if (data.conversationID) {
      // Tự động phản hồi lỗi khi không tìm thấy conversation -> không cần check conversation
      conversation = await this.conversationService.get({
        id: data.conversationID,
      });
    } else {
      const title = data.content.slice(0, 90);

      conversation = await this.conversationService.save(authToken, { title });
    }
    const newUserMessage = await this.messageService.save(
      authToken,
      {
        content: data.content,
        conversationID: conversation.id,
      },
      false,
    );
    const newBotMessage = await this.messageService.save(
      { id: '5E17D4A0-ABF8-EE11-9758-7C67A2EE2BB7' },
      {
        content: this.randomBotMessage(),
        conversationID: conversation.id,
        replyToMessageID: newUserMessage.id,
      },
      true,
    );

    return {
      conversationID: conversation.id,
      userMessageID: newUserMessage.id,
      botMessageID: newBotMessage.id,
    };
  }

  private randomBotMessage(): string {
    const numberOfLines = Math.floor(Math.random() * 5) + 1;

    return faker.lorem.paragraphs(numberOfLines);
  }
}
