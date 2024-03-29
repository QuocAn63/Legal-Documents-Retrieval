import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/commons/decorators/roles.decorator';
import RolesGuard from 'src/commons/guards/roles.guard';

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
