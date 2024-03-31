import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard, RolesGuard } from 'src/commons/guards';

@UseGuards(AuthGuard, RolesGuard)
@Roles('USER')
@Controller('/chat')
export default class ChatController {
  @Get('/conversations')
  async getList() {}

  @Get('/conversations/:conversationID')
  async getByID() {}

  @Get('/conversations/:conversationID/messages')
  async getList_messages() {}
}
