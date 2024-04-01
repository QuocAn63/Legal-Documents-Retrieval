import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard, RolesGuard } from 'src/commons/guards';
import ChatService from './chat.service';
import ConversationEntity from './entities/conversations.entity';

@UseGuards(AuthGuard, RolesGuard)
@Roles('USER')
@Controller('/chat')
export default class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/conversations')
  async getList_conversations() {
    return this.chatService.getList<ConversationEntity>({}, {});
  }

  @Get('/conversations/:conversationID')
  async getByID() {}

  @Get('/conversations/:conversationID/messages')
  async getList_messages() {}
}
